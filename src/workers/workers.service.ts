import { Injectable, ConflictException, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDto, UpdateWorkerDto, WorkerResponseDto } from './dto';
import { Worker } from 'bullmq';
import { EndpointExecutorService } from '../endpoints/services/endpoint-executor.service';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);
  private readonly activeWorkers = new Map<string, Worker>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => EndpointExecutorService))
    private readonly endpointExecutorService: EndpointExecutorService,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<WorkerResponseDto> {
    // Verificar que la cola existe
    const cola = await this.prisma.cola.findUnique({
      where: { id: createWorkerDto.colaId },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${createWorkerDto.colaId}" no encontrada`);
    }

    // Verificar que no existe un worker con el mismo nombre para esa cola
    const existingWorker = await this.prisma.worker.findUnique({
      where: {
        nombre_colaId: {
          nombre: createWorkerDto.nombre,
          colaId: createWorkerDto.colaId,
        },
      },
    });

    if (existingWorker) {
      throw new ConflictException(
        `Worker con nombre "${createWorkerDto.nombre}" ya existe para la cola "${cola.nombre}"`
      );
    }

    // Crear el worker en la base de datos
    const worker = await this.prisma.worker.create({
      data: createWorkerDto,
      include: {
        cola: true,
      },
    });

    // Crear el worker de BullMQ
    await this.createBullMQWorker(worker);

    this.logger.log(`Worker "${worker.nombre}" creado exitosamente para la cola "${cola.nombre}"`);

    return this.mapToResponseDto(worker);
  }

  async findAll(): Promise<WorkerResponseDto[]> {
    const workers = await this.prisma.worker.findMany({
      where: { estaActivo: true },
      include: {
        cola: true,
      },
    });

    return workers.map(worker => this.mapToResponseDto(worker));
  }

  async findOne(id: string): Promise<WorkerResponseDto> {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        cola: true,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker con ID "${id}" no encontrado`);
    }

    return this.mapToResponseDto(worker);
  }

  async findByColaId(colaId: string): Promise<WorkerResponseDto[]> {
    const workers = await this.prisma.worker.findMany({
      where: { 
        colaId,
        estaActivo: true,
      },
      include: {
        cola: true,
      },
    });

    return workers.map(worker => this.mapToResponseDto(worker));
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto): Promise<WorkerResponseDto> {
    const existingWorker = await this.prisma.worker.findUnique({
      where: { id },
      include: { cola: true },
    });

    if (!existingWorker) {
      throw new NotFoundException(`Worker con ID "${id}" no encontrado`);
    }

    // Si se está cambiando el nombre o la cola, verificar unicidad
    if (updateWorkerDto.nombre && updateWorkerDto.nombre !== existingWorker.nombre) {
      const colaId = updateWorkerDto.colaId || existingWorker.colaId;
      const workerWithSameName = await this.prisma.worker.findUnique({
        where: {
          nombre_colaId: {
            nombre: updateWorkerDto.nombre,
            colaId,
          },
        },
      });

      if (workerWithSameName && workerWithSameName.id !== id) {
        throw new ConflictException(
          `Worker con nombre "${updateWorkerDto.nombre}" ya existe para esa cola`
        );
      }
    }

    // Si se está cambiando la cola, verificar que la nueva cola existe
    if (updateWorkerDto.colaId && updateWorkerDto.colaId !== existingWorker.colaId) {
      const nuevaCola = await this.prisma.cola.findUnique({
        where: { id: updateWorkerDto.colaId },
      });

      if (!nuevaCola) {
        throw new NotFoundException(`Cola con ID "${updateWorkerDto.colaId}" no encontrada`);
      }
    }

    const updatedWorker = await this.prisma.worker.update({
      where: { id },
      data: updateWorkerDto,
      include: {
        cola: true,
      },
    });

    // Si se desactivó el worker, detener el worker de BullMQ
    if (updateWorkerDto.estaActivo === false) {
      await this.stopBullMQWorker(id);
    }
    // Si se reactivó el worker o cambió la configuración, recrear el worker de BullMQ
    else if (updateWorkerDto.estaActivo === true || updateWorkerDto.concurrencia || updateWorkerDto.colaId) {
      await this.stopBullMQWorker(id);
      await this.createBullMQWorker(updatedWorker);
    }

    this.logger.log(`Worker "${updatedWorker.nombre}" actualizado exitosamente`);

    return this.mapToResponseDto(updatedWorker);
  }

  async remove(id: string): Promise<void> {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: { cola: true },
    });

    if (!worker) {
      throw new NotFoundException(`Worker con ID "${id}" no encontrado`);
    }

    // Desactivar el worker en lugar de eliminarlo
    await this.prisma.worker.update({
      where: { id },
      data: { estaActivo: false },
    });

    // Detener el worker de BullMQ
    await this.stopBullMQWorker(id);

    this.logger.log(`Worker "${worker.nombre}" desactivado exitosamente`);
  }

  // Métodos privados
  private async createBullMQWorker(workerData: any): Promise<void> {
    try {
      // Procesador que ejecuta endpoints reales
      const processor = async (job: any) => {
        const { method, path, query, params, body, headers, timestamp, endpointId, userAgent, ip, customJobId } = job.data;
        
        this.logger.log(`🔄 Procesando job ${customJobId}: ${method} ${path} en worker "${workerData.nombre}"`);

        try {
          // Ejecutar el endpoint real usando el EndpointExecutorService
          let endpointResult: any = null;
          
          if (this.endpointExecutorService) {
            endpointResult = await this.endpointExecutorService.executeEndpoint(method, path, {
              query,
              params,
              body,
              headers,
              timestamp,
              endpointId,
              userAgent,
              ip,
              customJobId
            });
          } else {
            this.logger.warn('EndpointExecutorService no disponible, usando procesamiento básico');
            endpointResult = { message: 'Endpoint executor not available' };
          }

          // Retornar el resultado completo
          const result = {
            success: true,
            message: `Job "${job.name}" procesado por worker "${workerData.nombre}"`,
            jobId: customJobId,
            endpoint: {
              method,
              path,
              timestamp
            },
            data: endpointResult, // Aquí va el resultado real del endpoint
            processedAt: new Date().toISOString(),
            executionInfo: {
              worker: workerData.nombre,
              queue: workerData.cola.nombre,
              processingTime: Date.now() - job.timestamp,
              attempts: job.attemptsMade + 1
            }
          };

          this.logger.log(`✅ Job ${customJobId} completado exitosamente en worker "${workerData.nombre}"`);
          return result;

        } catch (error) {
          this.logger.error(`❌ Error procesando job ${customJobId} en worker "${workerData.nombre}":`, error.message);
          
          // Retornar información del error
          const errorResult = {
            success: false,
            message: `Job "${job.name}" falló durante el procesamiento`,
            jobId: customJobId,
            endpoint: {
              method,
              path,
              timestamp
            },
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name
            },
            processedAt: new Date().toISOString(),
            executionInfo: {
              worker: workerData.nombre,
              queue: workerData.cola.nombre,
              processingTime: Date.now() - job.timestamp,
              attempts: job.attemptsMade + 1
            }
          };

          throw new Error(JSON.stringify(errorResult));
        }
      };

      const worker = new Worker(workerData.cola.nombre, processor, {
        connection: {
          host: 'localhost',
          port: 6379,
        },
        concurrency: workerData.concurrencia,
      });

      // Manejo de eventos del worker
      worker.on('completed', (job) => {
        this.logger.log(`Job ${job.id} completado por worker "${workerData.nombre}"`);
      });

      worker.on('failed', (job, err) => {
        this.logger.error(`Job ${job?.id} falló en worker "${workerData.nombre}":`, err);
      });

      worker.on('error', (err) => {
        this.logger.error(`Error en worker "${workerData.nombre}":`, err);
      });

      this.activeWorkers.set(workerData.id, worker);

      this.logger.log(
        `Worker BullMQ "${workerData.nombre}" creado para cola "${workerData.cola.nombre}" con concurrencia ${workerData.concurrencia}`
      );
    } catch (error) {
      this.logger.error(`Error creando worker BullMQ "${workerData.nombre}":`, error);
      throw error;
    }
  }

  private async stopBullMQWorker(workerId: string): Promise<void> {
    try {
      const worker = this.activeWorkers.get(workerId);
      if (worker) {
        await worker.close();
        this.activeWorkers.delete(workerId);
        this.logger.log(`Worker BullMQ con ID "${workerId}" detenido`);
      }
    } catch (error) {
      this.logger.error(`Error deteniendo worker BullMQ con ID "${workerId}":`, error);
    }
  }

  private mapToResponseDto(worker: any): WorkerResponseDto {
    return {
      id: worker.id,
      nombre: worker.nombre,
      concurrencia: worker.concurrencia,
      colaId: worker.colaId,
      estaActivo: worker.estaActivo,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    };
  }

  // Método para inicializar workers existentes al inicio de la aplicación
  async initializeExistingWorkers(): Promise<void> {
    const workersActivos = await this.prisma.worker.findMany({
      where: { 
        estaActivo: true,
        cola: {
          estaActiva: true,
        },
      },
      include: {
        cola: true,
      },
    });

    for (const worker of workersActivos) {
      await this.createBullMQWorker(worker);
    }

    this.logger.log(`${workersActivos.length} workers existentes inicializados`);
  }

  // Método para obtener estadísticas de workers
  async getWorkerStats(): Promise<any> {
    const totalWorkers = await this.prisma.worker.count({
      where: { estaActivo: true },
    });

    const workersByQueue = await this.prisma.worker.groupBy({
      by: ['colaId'],
      where: { estaActivo: true },
      _count: true,
      _sum: {
        concurrencia: true,
      },
    });

    const queuesWithWorkers = await Promise.all(
      workersByQueue.map(async (item) => {
        const cola = await this.prisma.cola.findUnique({
          where: { id: item.colaId },
        });
        return {
          colaId: item.colaId,
          colaNombre: cola?.nombre,
          workersCount: item._count,
          totalConcurrencia: item._sum.concurrencia,
        };
      })
    );

    return {
      totalWorkers,
      activeWorkers: this.activeWorkers.size,
      queuesWithWorkers,
    };
  }
}