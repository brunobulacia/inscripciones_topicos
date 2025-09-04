import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreatePlanDeEstudioHandler,
  FindAllPlanesDeEstudioHandler,
  FindOnePlanDeEstudioHandler,
  UpdatePlanDeEstudioHandler,
  DeletePlanDeEstudioHandler,
} from './handlers/plan-de-estudio.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class PlanDeEstudioProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createPlanDeEstudioHandler: CreatePlanDeEstudioHandler,
    private readonly findAllPlanesDeEstudioHandler: FindAllPlanesDeEstudioHandler,
    private readonly findOnePlanDeEstudioHandler: FindOnePlanDeEstudioHandler,
    private readonly updatePlanDeEstudioHandler: UpdatePlanDeEstudioHandler,
    private readonly deletePlanDeEstudioHandler: DeletePlanDeEstudioHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'plandeestudio',
      'create',
      this.createPlanDeEstudioHandler,
    );
    this.handlerRegistry.register(
      'plandeestudio',
      'find_all',
      this.findAllPlanesDeEstudioHandler,
    );
    this.handlerRegistry.register(
      'plandeestudio',
      'find_one',
      this.findOnePlanDeEstudioHandler,
    );
    this.handlerRegistry.register(
      'plandeestudio',
      'update',
      this.updatePlanDeEstudioHandler,
    );
    this.handlerRegistry.register(
      'plandeestudio',
      'delete',
      this.deletePlanDeEstudioHandler,
    );
  }
}
