import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BaseQueueProcessor } from 'src/common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from 'src/common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from 'src/common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  CreatePrerequisitHandler,
  FindAllPrerequisitHandler,
  FindOnePrerequisitHandler,
  UpdatePrerequisitHandler,
  DeletePrerequisitHandler,
} from './handlers/prerequisito.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class PrerequisitProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createPrerequisitHandler: CreatePrerequisitHandler,
    private readonly findAllPrerequisitHandler: FindAllPrerequisitHandler,
    private readonly findOnePrerequisitHandler: FindOnePrerequisitHandler,
    private readonly updatePrerequisitHandler: UpdatePrerequisitHandler,
    private readonly deletePrerequisitHandler: DeletePrerequisitHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers() {
    this.handlerRegistry.register(
      'prerequisito',
      'create',
      this.createPrerequisitHandler,
    );
    this.handlerRegistry.register(
      'prerequisito',
      'find_all',
      this.findAllPrerequisitHandler,
    );
    this.handlerRegistry.register(
      'prerequisito',
      'find_one',
      this.findOnePrerequisitHandler,
    );
    this.handlerRegistry.register(
      'prerequisito',
      'update',
      this.updatePrerequisitHandler,
    );
    this.handlerRegistry.register(
      'prerequisito',
      'delete',
      this.deletePrerequisitHandler,
    );
  }
}
