import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateBoletaGrupoMateriaHandler,
  FindAllBoletaGrupoMateriaHandler,
  FindOneBoletaGrupoMateriaHandler,
  UpdateBoletaGrupoMateriaHandler,
  DeleteBoletaGrupoMateriaHandler,
} from './handlers/boleta-grupo-materia.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class BoletaGrupoMateriaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createBoletaGrupoMateriaHandler: CreateBoletaGrupoMateriaHandler,
    private readonly findAllBoletaGrupoMateriaHandler: FindAllBoletaGrupoMateriaHandler,
    private readonly findOneBoletaGrupoMateriaHandler: FindOneBoletaGrupoMateriaHandler,
    private readonly updateBoletaGrupoMateriaHandler: UpdateBoletaGrupoMateriaHandler,
    private readonly deleteBoletaGrupoMateriaHandler: DeleteBoletaGrupoMateriaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'boletagrupomateria',
      'create',
      this.createBoletaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'boletagrupomateria',
      'find_all',
      this.findAllBoletaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'boletagrupomateria',
      'find_one',
      this.findOneBoletaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'boletagrupomateria',
      'update',
      this.updateBoletaGrupoMateriaHandler,
    );
    this.handlerRegistry.register(
      'boletagrupomateria',
      'delete',
      this.deleteBoletaGrupoMateriaHandler,
    );
  }
}
