import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BaseQueueProcessor } from 'src/common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from 'src/common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from 'src/common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  CreateAulaGrupoMateriaHandler,
  FindAllAulaGrupoMateriaHandler,
  FindOneAulaGrupoMateriaHandler,
  UpdateAulaGrupoMateriaHandler,
  DeleteAulaGrupoMateriaHandler,
} from './handlers/aula-grupo-materia.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class AulaGrupoMateriaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createAulaGrupoMateriaHandler: CreateAulaGrupoMateriaHandler,
    private readonly findAllAulaGrupoMateriaHandler: FindAllAulaGrupoMateriaHandler,
    private readonly findOneAulaGrupoMateriaHandler: FindOneAulaGrupoMateriaHandler,
    private readonly updateAulaGrupoMateriaHandler: UpdateAulaGrupoMateriaHandler,
    private readonly deleteAulaGrupoMateriaHandler: DeleteAulaGrupoMateriaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers() {
    this.handlerRegistry.register(
      'aulagrupomateria',
      'create',
      this.createAulaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'aulagrupomateria',
      'find_all',
      this.findAllAulaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'aulagrupomateria',
      'find_one',
      this.findOneAulaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'aulagrupomateria',
      'update',
      this.updateAulaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'aulagrupomateria',
      'delete',
      this.deleteAulaGrupoMateriaHandler,
    );
  }
}
