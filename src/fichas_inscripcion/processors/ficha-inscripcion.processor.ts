import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateFichaInscripcionHandler,
  FindAllFichaInscripcionHandler,
  FindOneFichaInscripcionHandler,
  UpdateFichaInscripcionHandler,
  DeleteFichaInscripcionHandler,
} from './handlers/ficha-inscripcion.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class FichaInscripcionProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createFichaInscripcionHandler: CreateFichaInscripcionHandler,
    private readonly findAllFichaInscripcionHandler: FindAllFichaInscripcionHandler,
    private readonly findOneFichaInscripcionHandler: FindOneFichaInscripcionHandler,
    private readonly updateFichaInscripcionHandler: UpdateFichaInscripcionHandler,
    private readonly deleteFichaInscripcionHandler: DeleteFichaInscripcionHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'fichainscripcion',
      'create',
      this.createFichaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'fichainscripcion',
      'find_all',
      this.findAllFichaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'fichainscripcion',
      'find_one',
      this.findOneFichaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'fichainscripcion',
      'update',
      this.updateFichaInscripcionHandler,
    );
    this.handlerRegistry.register(
      'fichainscripcion',
      'delete',
      this.deleteFichaInscripcionHandler,
    );
  }
}
