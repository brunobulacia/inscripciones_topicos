import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import {
  CreateNivelHandler,
  FindAllNivelesHandler,
  FindOneNivelHandler,
  UpdateNivelHandler,
  DeleteNivelHandler,
} from '../handlers/nivel.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class NivelProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createNivelHandler: CreateNivelHandler,
    private readonly findAllNivelesHandler: FindAllNivelesHandler,
    private readonly findOneNivelHandler: FindOneNivelHandler,
    private readonly updateNivelHandler: UpdateNivelHandler,
    private readonly deleteNivelHandler: DeleteNivelHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    // Registrar todos los handlers para la entidad "nivel"
    this.handlerRegistry.register('nivel', 'create', this.createNivelHandler);
    this.handlerRegistry.register(
      'nivel',
      'find_all',
      this.findAllNivelesHandler,
    );
    this.handlerRegistry.register(
      'nivel',
      'find_one',
      this.findOneNivelHandler,
    );
    this.handlerRegistry.register('nivel', 'update', this.updateNivelHandler);
    this.handlerRegistry.register('nivel', 'delete', this.deleteNivelHandler);
  }
}
