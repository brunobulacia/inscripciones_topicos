import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreatePeriodoHandler,
  FindAllPeriodosHandler,
  FindOnePeriodoHandler,
  UpdatePeriodoHandler,
  DeletePeriodoHandler,
} from './handlers/periodo.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class PeriodoProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createPeriodoHandler: CreatePeriodoHandler,
    private readonly findAllPeriodosHandler: FindAllPeriodosHandler,
    private readonly findOnePeriodoHandler: FindOnePeriodoHandler,
    private readonly updatePeriodoHandler: UpdatePeriodoHandler,
    private readonly deletePeriodoHandler: DeletePeriodoHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'periodo',
      'create',
      this.createPeriodoHandler,
    );
    this.handlerRegistry.register(
      'periodo',
      'find_all',
      this.findAllPeriodosHandler,
    );
    this.handlerRegistry.register(
      'periodo',
      'find_one',
      this.findOnePeriodoHandler,
    );
    this.handlerRegistry.register(
      'periodo',
      'update',
      this.updatePeriodoHandler,
    );
    this.handlerRegistry.register(
      'periodo',
      'delete',
      this.deletePeriodoHandler,
    );
  }
}
