import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateOfertaGrupoMateriaHandler,
  FindAllOfertaGrupoMateriaHandler,
  FindOneOfertaGrupoMateriaHandler,
  UpdateOfertaGrupoMateriaHandler,
  DeleteOfertaGrupoMateriaHandler,
} from './handlers/oferta-grupo-materia.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES, {
  concurrency: 5,
})
export class OfertaGrupoMateriaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createHandler: CreateOfertaGrupoMateriaHandler,
    private readonly findAllHandler: FindAllOfertaGrupoMateriaHandler,
    private readonly findOneHandler: FindOneOfertaGrupoMateriaHandler,
    private readonly updateHandler: UpdateOfertaGrupoMateriaHandler,
    private readonly deleteHandler: DeleteOfertaGrupoMateriaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'ofertagrupomateria',
      'create',
      this.createHandler,
    );
    this.handlerRegistry.register(
      'ofertagrupomateria',
      'find_all',
      this.findAllHandler,
    );
    this.handlerRegistry.register(
      'ofertagrupomateria',
      'find_one',
      this.findOneHandler,
    );
    this.handlerRegistry.register(
      'ofertagrupomateria',
      'update',
      this.updateHandler,
    );
    this.handlerRegistry.register(
      'ofertagrupomateria',
      'delete',
      this.deleteHandler,
    );
  }
}
