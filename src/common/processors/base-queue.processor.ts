import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueJobSerializer } from '../services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../services/queue-job-handler-registry.service';
import { BaseJobResult } from '../types/queue.types';

@Injectable()
export abstract class BaseQueueProcessor
  extends WorkerHost
  implements OnModuleInit
{
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly jobSerializer: QueueJobSerializer,
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
  ) {
    super();
  }

  async process(job: Job): Promise<BaseJobResult> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    // Parsear el nombre del job para obtener entidad y operación
    const { entity, operation } = this.jobSerializer.parseJobName(job.name);

    // Obtener el handler correspondiente
    const handler = this.handlerRegistry.getHandler(entity, operation);

    if (!handler) {
      const errorMessage = `No handler found for entity: ${entity}, operation: ${operation}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Ejecutar el handler con los datos del job
    const result = await handler.handle(job.data);

    this.logger.log(
      `Successfully processed job ${job.id} for ${entity}.${operation}`,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Método abstracto que deben implementar las clases derivadas
   * para registrar sus handlers específicos
   */
  abstract registerHandlers(): void;

  /**
   * Método que se llama automáticamente después de la construcción
   * para registrar todos los handlers
   */
  onModuleInit() {
    this.registerHandlers();
    this.logger.log(
      `Registered handlers: ${this.handlerRegistry.listHandlers().join(', ')}`,
    );
  }
}
