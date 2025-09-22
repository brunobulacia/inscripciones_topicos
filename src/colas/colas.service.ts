import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  Inject,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateColaDto,
  UpdateColaDto,
  ColaResponseDto,
  CreateJobDto,
} from './dto';
import { Queue, ConnectionOptions } from 'bullmq';
import { BullMQDashboardService } from '../bullmq-dashboard/bullmq-dashboard.service';
import { WorkersService } from '../workers/workers.service';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable()
export class ColasService {
  private readonly logger = new Logger(ColasService.name);
  private readonly dinamicQueues = new Map<string, Queue>();
  private readonly redisConnection: ConnectionOptions;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: BullMQDashboardService,
    @Inject(forwardRef(() => WorkersService))
    private readonly workersService: WorkersService,
    @Inject(forwardRef(() => EndpointsService))
    private readonly endpointsService: EndpointsService,
  ) {
    // Configuración de Redis usando la misma configuración del app.module
    this.redisConnection = {
      host: 'localhost',
      port: 6379,
    };
  }

  async create(createColaDto: CreateColaDto): Promise<ColaResponseDto> {
    const existingCola = await this.prisma.cola.findUnique({
      where: { nombre: createColaDto.nombre },
    });

    if (existingCola) {
      throw new ConflictException(
        `Cola con nombre "${createColaDto.nombre}" ya existe`,
      );
    }

    // Extraer workers del DTO y crear datos para la cola sin workers
    const { workers, ...colaData } = createColaDto;

    const cola = await this.prisma.cola.create({
      data: colaData,
    });

    await this.createBullMQQueue(cola.nombre);

    // Si se proporcionó array de workers, crear automáticamente los workers
    if (workers && workers.length > 0) {
      this.logger.log(
        `Creando ${workers.length} workers para la cola "${cola.nombre}"`,
      );

      for (let i = 0; i < workers.length; i++) {
        const concurrencia = workers[i];
        const workerName = `worker-${i + 1}-${cola.nombre}`;

        try {
          await this.workersService.create({
            nombre: workerName,
            concurrencia: concurrencia,
            colaId: cola.id,
          });

          this.logger.log(
            `Worker "${workerName}" creado con concurrencia ${concurrencia} para cola "${cola.nombre}"`,
          );
        } catch (error) {
          this.logger.error(
            `Error creando worker "${workerName}" para cola "${cola.nombre}": ${error.message}`,
          );
          // Continuar con los demás workers aunque uno falle
        }
      }
    }

    this.logger.log(`Cola "${cola.nombre}" creada exitosamente`);

    // Retornar la cola con sus workers creados
    const colaWithWorkers = await this.prisma.cola.findUnique({
      where: { id: cola.id },
      include: {
        workers: {
          where: { estaActivo: true },
        },
      },
    });

    return this.mapToResponseDto(colaWithWorkers);
  }

  async findAll(): Promise<ColaResponseDto[]> {
    const colas = await this.prisma.cola.findMany({
      where: { estaActiva: true },
      include: {
        workers: {
          where: { estaActivo: true },
        },
      },
    });

    return colas.map((cola) => this.mapToResponseDto(cola));
  }

  async findOne(id: string): Promise<ColaResponseDto> {
    const cola = await this.prisma.cola.findUnique({
      where: { id },
      include: {
        workers: {
          where: { estaActivo: true },
        },
      },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${id}" no encontrada`);
    }

    return this.mapToResponseDto(cola);
  }

  async findByName(nombre: string): Promise<ColaResponseDto> {
    const cola = await this.prisma.cola.findUnique({
      where: { nombre },
      include: {
        workers: {
          where: { estaActivo: true },
        },
      },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con nombre "${nombre}" no encontrada`);
    }

    return this.mapToResponseDto(cola);
  }

  async update(
    id: string,
    updateColaDto: UpdateColaDto,
  ): Promise<ColaResponseDto> {
    const existingCola = await this.prisma.cola.findUnique({
      where: { id },
    });

    if (!existingCola) {
      throw new NotFoundException(`Cola con ID "${id}" no encontrada`);
    }

    // Si se está cambiando el nombre, verificar que no exista otra cola con ese nombre
    if (updateColaDto.nombre && updateColaDto.nombre !== existingCola.nombre) {
      const colaWithSameName = await this.prisma.cola.findUnique({
        where: { nombre: updateColaDto.nombre },
      });

      if (colaWithSameName) {
        throw new ConflictException(
          `Cola con nombre "${updateColaDto.nombre}" ya existe`,
        );
      }
    }

    const updatedCola = await this.prisma.cola.update({
      where: { id },
      data: updateColaDto,
    });

    // Si se desactivó la cola, cerrar la cola de BullMQ
    if (updateColaDto.estaActiva === false) {
      await this.closeBullMQQueue(existingCola.nombre);
    }
    // Si se reactivó la cola, crear la cola de BullMQ
    else if (updateColaDto.estaActiva === true && !existingCola.estaActiva) {
      await this.createBullMQQueue(updatedCola.nombre);
    }

    this.logger.log(`Cola "${updatedCola.nombre}" actualizada exitosamente`);

    return this.mapToResponseDto(updatedCola);
  }

  async remove(id: string): Promise<void> {
    const cola = await this.prisma.cola.findUnique({
      where: { id },
      include: {
        workers: { where: { estaActivo: true } },
        endpoints: { where: { estaActivo: true } },
      },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${id}" no encontrada`);
    }

    this.logger.log(
      `Iniciando eliminación en cascada para cola "${cola.nombre}"`,
    );

    // 1. Eliminar todos los endpoints asociados a la cola
    if (cola.endpoints && cola.endpoints.length > 0) {
      this.logger.log(
        `Eliminando ${cola.endpoints.length} endpoints asociados a la cola "${cola.nombre}"`,
      );

      for (const endpoint of cola.endpoints) {
        try {
          await this.endpointsService.remove(endpoint.id);
          this.logger.log(
            `Endpoint ${endpoint.metodo} ${endpoint.ruta} eliminado exitosamente`,
          );
        } catch (error) {
          this.logger.error(
            `Error eliminando endpoint ${endpoint.metodo} ${endpoint.ruta}: ${error.message}`,
          );
          // Continuar con los demás endpoints aunque uno falle
        }
      }
    }

    // 2. Eliminar todos los workers asociados a la cola
    if (cola.workers && cola.workers.length > 0) {
      this.logger.log(
        `Eliminando ${cola.workers.length} workers asociados a la cola "${cola.nombre}"`,
      );

      for (const worker of cola.workers) {
        try {
          await this.workersService.remove(worker.id);
          this.logger.log(`Worker "${worker.nombre}" eliminado exitosamente`);
        } catch (error) {
          this.logger.error(
            `Error eliminando worker "${worker.nombre}": ${error.message}`,
          );
          // Continuar con los demás workers aunque uno falle
        }
      }
    }

    // 3. Cerrar la cola de BullMQ antes de desactivarla
    await this.closeBullMQQueue(cola.nombre);

    // 4. Finalmente, desactivar la cola en lugar de eliminarla
    await this.prisma.cola.update({
      where: { id },
      data: { estaActiva: false },
    });

    this.logger.log(
      `Cola "${cola.nombre}" y todos sus recursos asociados eliminados exitosamente`,
    );
  }

  // Métodos para manejar jobs en colas específicas
  async addJob(nombreCola: string, createJobDto: CreateJobDto): Promise<any> {
    const queue = this.dinamicQueues.get(nombreCola);
    if (!queue) {
      throw new NotFoundException(
        `Cola "${nombreCola}" no encontrada o no activa`,
      );
    }

    const job = await queue.add(
      createJobDto.name,
      createJobDto.data,
      createJobDto.opts,
    );

    this.logger.log(
      `Job "${createJobDto.name}" agregado a la cola "${nombreCola}"`,
    );

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
    };
  }

  async getQueueStats(nombreCola: string): Promise<any> {
    const queue = this.dinamicQueues.get(nombreCola);
    if (!queue) {
      throw new NotFoundException(
        `Cola "${nombreCola}" no encontrada o no activa`,
      );
    }

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      name: nombreCola,
      counts: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      },
      waiting: waiting.map((job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
      })),
      active: active.map((job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
      })),
    };
  }

  async getQueueJobs(
    nombreCola: string,
    status: 'waiting' | 'active' | 'completed' | 'failed' = 'waiting',
  ): Promise<any[]> {
    const queue = this.dinamicQueues.get(nombreCola);
    if (!queue) {
      throw new NotFoundException(
        `Cola "${nombreCola}" no encontrada o no activa`,
      );
    }

    let jobs;
    switch (status) {
      case 'waiting':
        jobs = await queue.getWaiting();
        break;
      case 'active':
        jobs = await queue.getActive();
        break;
      case 'completed':
        jobs = await queue.getCompleted();
        break;
      case 'failed':
        jobs = await queue.getFailed();
        break;
      default:
        jobs = await queue.getWaiting();
    }

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
      timestamp: job.timestamp,
    }));
  }

  // Métodos privados
  private async createBullMQQueue(nombreCola: string): Promise<void> {
    try {
      const queue = new Queue(nombreCola, {
        connection: this.redisConnection,
        defaultJobOptions: {
          removeOnComplete: false,
          removeOnFail: false,
          attempts: 3,
          /* backoff: {
            type: 'exponential',
            delay: 2000,
          }, */
        },
      });

      this.dinamicQueues.set(nombreCola, queue);
      this.dashboardService.addQueue(queue);

      this.logger.log(
        `Cola BullMQ "${nombreCola}" creada y registrada en el dashboard`,
      );
    } catch (error) {
      this.logger.error(`Error creando cola BullMQ "${nombreCola}":`, error);
      throw error;
    }
  }

  private async closeBullMQQueue(nombreCola: string): Promise<void> {
    try {
      const queue = this.dinamicQueues.get(nombreCola);
      if (queue) {
        await queue.close();
        this.dinamicQueues.delete(nombreCola);
        this.dashboardService.removeQueue(nombreCola);
        this.logger.log(
          `Cola BullMQ "${nombreCola}" cerrada y removida del dashboard`,
        );
      }
    } catch (error) {
      this.logger.error(`Error cerrando cola BullMQ "${nombreCola}":`, error);
    }
  }

  private mapToResponseDto(cola: any): ColaResponseDto {
    return {
      id: cola.id,
      nombre: cola.nombre,
      descripcion: cola.descripcion,
      estaActiva: cola.estaActiva,
      createdAt: cola.createdAt,
      updatedAt: cola.updatedAt,
    };
  }

  // Método para inicializar colas existentes al inicio de la aplicación
  async initializeExistingQueues(): Promise<void> {
    const colasActivas = await this.prisma.cola.findMany({
      where: { estaActiva: true },
    });

    for (const cola of colasActivas) {
      await this.createBullMQQueue(cola.nombre);
    }

    this.logger.log(`${colasActivas.length} colas existentes inicializadas`);
  }

  // Método para obtener las colas dinámicas (solo lectura)
  getDinamicQueues(): ReadonlyMap<string, Queue> {
    return this.dinamicQueues;
  }

  // Métodos para consultar jobs
  async getJobById(jobId: string): Promise<any> {
    try {
      // Buscar en todas las colas activas
      const colas = await this.prisma.cola.findMany({
        where: { estaActiva: true },
      });

      for (const cola of colas) {
        const queue = this.dinamicQueues.get(cola.nombre);
        if (!queue) continue;

        // Buscar el job en esta cola
        const job = await queue.getJob(jobId);
        if (job) {
          return {
            jobId: job.id,
            name: job.name,
            data: job.data,
            progress: job.progress,
            state: await job.getState(),
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
            failedReason: job.failedReason,
            returnValue: job.returnvalue,
            queueName: cola.nombre,
            timestamp: job.timestamp,
            opts: job.opts,
          };
        }
      }

      throw new NotFoundException(`Job with ID ${jobId} not found`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching job: ${error.message}`,
      );
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await this.getJobById(jobId);
      return {
        jobId: job.jobId,
        status: job.state,
        progress: job.progress,
        queueName: job.queueName,
        createdAt: new Date(job.timestamp),
        processedAt: job.processedOn ? new Date(job.processedOn) : null,
        completedAt: job.finishedOn ? new Date(job.finishedOn) : null,
        result: job.returnValue,
        error: job.failedReason,
      };
    } catch (error) {
      throw error;
    }
  }

  // Métodos para limpiar y sincronizar Redis
  async cleanupRedis(): Promise<{
    message: string;
    cleaned: string[];
    kept: string[];
  }> {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(this.redisConnection);

      // Obtener todas las colas activas de la base de datos
      const colasActivas = await this.prisma.cola.findMany({
        where: { estaActiva: true },
        select: { nombre: true },
      });

      const colasActivasNombres = new Set(
        colasActivas.map((cola) => cola.nombre),
      );

      // Obtener todas las claves de Redis relacionadas con BullMQ
      const keys = await redis.keys('bull:*');

      const cleaned: string[] = [];
      const kept: string[] = [];

      for (const key of keys) {
        // Extraer el nombre de la cola de la clave de Redis
        const parts = key.split(':');
        if (parts.length >= 2) {
          const queueName = parts[1];

          // Si la cola no está activa en la base de datos, eliminarla de Redis
          if (!colasActivasNombres.has(queueName)) {
            await redis.del(key);
            cleaned.push(key);
            this.logger.log(`🗑️ Eliminada clave de Redis: ${key}`);
          } else {
            kept.push(key);
          }
        }
      }

      // También cerrar las colas de BullMQ que no deberían existir
      for (const [nombre, queue] of this.dinamicQueues.entries()) {
        if (!colasActivasNombres.has(nombre)) {
          await queue.close();
          this.dinamicQueues.delete(nombre);
          this.logger.log(
            `🔌 Cola BullMQ "${nombre}" cerrada y eliminada del mapa`,
          );
        }
      }

      await redis.quit();

      this.logger.log(
        `🧹 Limpieza de Redis completada. Eliminadas: ${cleaned.length}, Mantenidas: ${kept.length}`,
      );

      return {
        message: 'Limpieza de Redis completada exitosamente',
        cleaned,
        kept,
      };
    } catch (error) {
      this.logger.error('Error durante la limpieza de Redis:', error);
      throw new InternalServerErrorException(
        `Error cleaning Redis: ${error.message}`,
      );
    }
  }

  async syncWithDatabase(): Promise<{
    message: string;
    synced: string[];
    errors: string[];
  }> {
    try {
      // Obtener todas las colas activas de la base de datos
      const colasActivas = await this.prisma.cola.findMany({
        where: { estaActiva: true },
      });

      const synced: string[] = [];
      const errors: string[] = [];

      // Recrear las colas que deberían existir pero no están en el mapa
      for (const cola of colasActivas) {
        try {
          if (!this.dinamicQueues.has(cola.nombre)) {
            await this.createBullMQQueue(cola.nombre);
            synced.push(cola.nombre);
            this.logger.log(`🔄 Cola "${cola.nombre}" recreada en BullMQ`);
          }
        } catch (error) {
          errors.push(
            `Error recreando cola "${cola.nombre}": ${error.message}`,
          );
          this.logger.error(`Error recreando cola "${cola.nombre}":`, error);
        }
      }

      this.logger.log(
        `🔄 Sincronización completada. Sincronizadas: ${synced.length}, Errores: ${errors.length}`,
      );

      return {
        message: 'Sincronización con base de datos completada',
        synced,
        errors,
      };
    } catch (error) {
      this.logger.error('Error durante la sincronización:', error);
      throw new InternalServerErrorException(
        `Error syncing with database: ${error.message}`,
      );
    }
  }

  async fullCleanupAndSync(): Promise<any> {
    try {
      this.logger.log('🚀 Iniciando limpieza completa y sincronización...');

      const cleanupResult = await this.cleanupRedis();
      const syncResult = await this.syncWithDatabase();

      return {
        message: 'Limpieza completa y sincronización exitosa',
        cleanup: cleanupResult,
        sync: syncResult,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error durante limpieza completa:', error);
      throw error;
    }
  }
}
