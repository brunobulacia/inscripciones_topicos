import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateAvanceAcademicoHandler,
  FindAllAvanceAcademicoHandler,
  FindOneAvanceAcademicoHandler,
  UpdateAvanceAcademicoHandler,
  DeleteAvanceAcademicoHandler,
} from './handlers/avance-academico.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class AvanceAcademicoProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createAvanceAcademicoHandler: CreateAvanceAcademicoHandler,
    private readonly findAllAvanceAcademicoHandler: FindAllAvanceAcademicoHandler,
    private readonly findOneAvanceAcademicoHandler: FindOneAvanceAcademicoHandler,
    private readonly updateAvanceAcademicoHandler: UpdateAvanceAcademicoHandler,
    private readonly deleteAvanceAcademicoHandler: DeleteAvanceAcademicoHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'avanceacademico',
      'create',
      this.createAvanceAcademicoHandler,
    );
    this.handlerRegistry.register(
      'avanceacademico',
      'find_all',
      this.findAllAvanceAcademicoHandler,
    );
    this.handlerRegistry.register(
      'avanceacademico',
      'find_one',
      this.findOneAvanceAcademicoHandler,
    );
    this.handlerRegistry.register(
      'avanceacademico',
      'update',
      this.updateAvanceAcademicoHandler,
    );
    this.handlerRegistry.register(
      'avanceacademico',
      'delete',
      this.deleteAvanceAcademicoHandler,
    );
  }
}
