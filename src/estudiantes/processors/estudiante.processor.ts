import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateEstudianteHandler,
  FindAllEstudiantesHandler,
  FindOneEstudianteHandler,
  UpdateEstudianteHandler,
  DeleteEstudianteHandler,
} from './handlers/estudiante.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class EstudianteProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createEstudianteHandler: CreateEstudianteHandler,
    private readonly findAllEstudiantesHandler: FindAllEstudiantesHandler,
    private readonly findOneEstudianteHandler: FindOneEstudianteHandler,
    private readonly updateEstudianteHandler: UpdateEstudianteHandler,
    private readonly deleteEstudianteHandler: DeleteEstudianteHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'estudiante',
      'create',
      this.createEstudianteHandler,
    );
    this.handlerRegistry.register(
      'estudiante',
      'find_all',
      this.findAllEstudiantesHandler,
    );
    this.handlerRegistry.register(
      'estudiante',
      'find_one',
      this.findOneEstudianteHandler,
    );
    this.handlerRegistry.register(
      'estudiante',
      'update',
      this.updateEstudianteHandler,
    );
    this.handlerRegistry.register(
      'estudiante',
      'delete',
      this.deleteEstudianteHandler,
    );
  }
}
