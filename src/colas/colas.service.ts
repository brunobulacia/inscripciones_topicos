import { Injectable, ConflictException, NotFoundException, Logger, Inject, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColaDto, UpdateColaDto, ColaResponseDto, CreateJobDto } from './dto';
import { Queue, ConnectionOptions } from 'bullmq';
import { BullMQDashboardService } from '../bullmq-dashboard/bullmq-dashboard.service';

@Injectable()
export class ColasService {
  private readonly logger = new Logger(ColasService.name);
  private readonly dinamicQueues = new Map<string, Queue>();
  private readonly redisConnection: ConnectionOptions;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: BullMQDashboardService,
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
      throw new ConflictException(`Cola con nombre "${createColaDto.nombre}" ya existe`);
    }

    const cola = await this.prisma.cola.create({
      data: createColaDto,
    });

    await this.createBullMQQueue(cola.nombre);

    this.logger.log(`Cola "${cola.nombre}" creada exitosamente`);

    return this.mapToResponseDto(cola);
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

    return colas.map(cola => this.mapToResponseDto(cola));
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

  async update(id: string, updateColaDto: UpdateColaDto): Promise<ColaResponseDto> {
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
        throw new ConflictException(`Cola con nombre "${updateColaDto.nombre}" ya existe`);
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
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${id}" no encontrada`);
    }

    // Desactivar la cola en lugar de eliminarla
    await this.prisma.cola.update({
      where: { id },
      data: { estaActiva: false },
    });

    // Cerrar la cola de BullMQ
    await this.closeBullMQQueue(cola.nombre);

    this.logger.log(`Cola "${cola.nombre}" desactivada exitosamente`);
  }

  // Métodos para manejar jobs en colas específicas
  async addJob(nombreCola: string, createJobDto: CreateJobDto): Promise<any> {
    const queue = this.dinamicQueues.get(nombreCola);
    if (!queue) {
      throw new NotFoundException(`Cola "${nombreCola}" no encontrada o no activa`);
    }

    const job = await queue.add(createJobDto.name, createJobDto.data, createJobDto.opts);
    
    this.logger.log(`Job "${createJobDto.name}" agregado a la cola "${nombreCola}"`);
    
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
      throw new NotFoundException(`Cola "${nombreCola}" no encontrada o no activa`);
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
      waiting: waiting.map(job => ({
        id: job.id,
        name: job.name,
        data: job.data,
      })),
      active: active.map(job => ({
        id: job.id,
        name: job.name,
        data: job.data,
      })),
    };
  }

  async getQueueJobs(nombreCola: string, status: 'waiting' | 'active' | 'completed' | 'failed' = 'waiting'): Promise<any[]> {
    const queue = this.dinamicQueues.get(nombreCola);
    if (!queue) {
      throw new NotFoundException(`Cola "${nombreCola}" no encontrada o no activa`);
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

    return jobs.map(job => ({
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
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      this.dinamicQueues.set(nombreCola, queue);
      this.dashboardService.addQueue(queue);

      this.logger.log(`Cola BullMQ "${nombreCola}" creada y registrada en el dashboard`);
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
        this.logger.log(`Cola BullMQ "${nombreCola}" cerrada y removida del dashboard`);
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

  // Métodos para consultar jobs
  async getJobById(jobId: string): Promise<any> {
    try {
      // Buscar en todas las colas activas
      const colas = await this.prisma.cola.findMany({
        where: { estaActiva: true }
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
            opts: job.opts
          };
        }
      }

      throw new NotFoundException(`Job with ID ${jobId} not found`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching job: ${error.message}`);
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
        error: job.failedReason
      };
    } catch (error) {
      throw error;
    }
  }
}