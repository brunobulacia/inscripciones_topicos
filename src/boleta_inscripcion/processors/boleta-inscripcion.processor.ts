import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateBoletaInscripcionHandler,
  FindAllBoletaInscripcionHandler,
  FindOneBoletaInscripcionHandler,
  UpdateBoletaInscripcionHandler,
  DeleteBoletaInscripcionHandler,
} from './handlers/boleta-inscripcion.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class BoletaInscripcionProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createBoletaInscripcionHandler: CreateBoletaInscripcionHandler,
    private readonly findAllBoletaInscripcionHandler: FindAllBoletaInscripcionHandler,
    private readonly findOneBoletaInscripcionHandler: FindOneBoletaInscripcionHandler,
    private readonly updateBoletaInscripcionHandler: UpdateBoletaInscripcionHandler,
    private readonly deleteBoletaInscripcionHandler: DeleteBoletaInscripcionHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'boletainscripcion',
      'create',
      this.createBoletaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'boletainscripcion',
      'find_all',
      this.findAllBoletaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'boletainscripcion',
      'find_one',
      this.findOneBoletaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'boletainscripcion',
      'update',
      this.updateBoletaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'boletainscripcion',
      'delete',
      this.deleteBoletaInscripcionHandler,
    );
  }
}
