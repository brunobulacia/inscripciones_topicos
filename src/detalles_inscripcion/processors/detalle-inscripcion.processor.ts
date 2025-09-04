import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateDetalleInscripcionHandler,
  FindAllDetalleInscripcionHandler,
  FindOneDetalleInscripcionHandler,
  UpdateDetalleInscripcionHandler,
  DeleteDetalleInscripcionHandler,
} from './handlers/detalle-inscripcion.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class DetalleInscripcionProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createDetalleInscripcionHandler: CreateDetalleInscripcionHandler,
    private readonly findAllDetalleInscripcionHandler: FindAllDetalleInscripcionHandler,
    private readonly findOneDetalleInscripcionHandler: FindOneDetalleInscripcionHandler,
    private readonly updateDetalleInscripcionHandler: UpdateDetalleInscripcionHandler,
    private readonly deleteDetalleInscripcionHandler: DeleteDetalleInscripcionHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'detalleinscripcion',
      'create',
      this.createDetalleInscripcionHandler,
    );
    this.handlerRegistry.register(
      'detalleinscripcion',
      'find_all',
      this.findAllDetalleInscripcionHandler,
    );
    this.handlerRegistry.register(
      'detalleinscripcion',
      'find_one',
      this.findOneDetalleInscripcionHandler,
    );
    this.handlerRegistry.register(
      'detalleinscripcion',
      'update',
      this.updateDetalleInscripcionHandler,
    );
    this.handlerRegistry.register(
      'detalleinscripcion',
      'delete',
      this.deleteDetalleInscripcionHandler,
    );
  }
}
