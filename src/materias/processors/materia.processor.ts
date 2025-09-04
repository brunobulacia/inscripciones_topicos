import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BaseQueueProcessor } from 'src/common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from 'src/common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from 'src/common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  CreateMateriaHandler,
  FindAllMateriaHandler,
  FindOneMateriaHandler,
  UpdateMateriaHandler,
  DeleteMateriaHandler,
} from './handlers/materia.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class MateriaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createMateriaHandler: CreateMateriaHandler,
    private readonly findAllMateriaHandler: FindAllMateriaHandler,
    private readonly findOneMateriaHandler: FindOneMateriaHandler,
    private readonly updateMateriaHandler: UpdateMateriaHandler,
    private readonly deleteMateriaHandler: DeleteMateriaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers() {
    this.handlerRegistry.register(
      'materia',
      'create',
      this.createMateriaHandler,
    );
    this.handlerRegistry.register(
      'materia',
      'find_all',
      this.findAllMateriaHandler,
    );
    this.handlerRegistry.register(
      'materia',
      'find_one',
      this.findOneMateriaHandler,
    );
    this.handlerRegistry.register(
      'materia',
      'update',
      this.updateMateriaHandler,
    );
    this.handlerRegistry.register(
      'materia',
      'delete',
      this.deleteMateriaHandler,
    );
  }
}
