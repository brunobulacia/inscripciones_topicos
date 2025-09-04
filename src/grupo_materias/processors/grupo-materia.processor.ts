import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { GrupoMateriaJobType } from '../types/grupo-materia-job.types';
import {
  CreateGrupoMateriaHandler,
  FindAllGrupoMateriaHandler,
  FindOneGrupoMateriaHandler,
  UpdateGrupoMateriaHandler,
  DeleteGrupoMateriaHandler,
} from './handlers/grupo-materia.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class GrupoMateriaProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly jobSerializer: QueueJobSerializer,
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    private readonly createGrupoMateriaHandler: CreateGrupoMateriaHandler,
    private readonly findAllGrupoMateriaHandler: FindAllGrupoMateriaHandler,
    private readonly findOneGrupoMateriaHandler: FindOneGrupoMateriaHandler,
    private readonly updateGrupoMateriaHandler: UpdateGrupoMateriaHandler,
    private readonly deleteGrupoMateriaHandler: DeleteGrupoMateriaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    const entityName = 'grupomateria';

    this.handlerRegistry.register(
      entityName,
      'create',
      this.createGrupoMateriaHandler,
    );

    this.handlerRegistry.register(
      entityName,
      'find_all',
      this.findAllGrupoMateriaHandler,
    );

    this.handlerRegistry.register(
      entityName,
      'find_one',
      this.findOneGrupoMateriaHandler,
    );

    this.handlerRegistry.register(
      entityName,
      'update',
      this.updateGrupoMateriaHandler,
    );

    this.handlerRegistry.register(
      entityName,
      'delete',
      this.deleteGrupoMateriaHandler,
    );
  }
}
