import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateDocenteHandler,
  FindAllDocentesHandler,
  FindOneDocenteHandler,
  UpdateDocenteHandler,
  DeleteDocenteHandler,
} from '../handlers/docente.handlers';

@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class DocenteProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    protected readonly jobSerializer: QueueJobSerializer,
    private readonly createDocenteHandler: CreateDocenteHandler,
    private readonly findAllDocentesHandler: FindAllDocentesHandler,
    private readonly findOneDocenteHandler: FindOneDocenteHandler,
    private readonly updateDocenteHandler: UpdateDocenteHandler,
    private readonly deleteDocenteHandler: DeleteDocenteHandler,
  ) {
    super(jobSerializer, handlerRegistry);
    this.registerHandlers();
  }

  registerHandlers() {
    // Registrar todos los handlers para 'docente'
    this.handlerRegistry.register(
      'docente',
      'create',
      this.createDocenteHandler,
    );
    this.handlerRegistry.register(
      'docente',
      'find_all',
      this.findAllDocentesHandler,
    );
    this.handlerRegistry.register(
      'docente',
      'find_one',
      this.findOneDocenteHandler,
    );
    this.handlerRegistry.register(
      'docente',
      'update',
      this.updateDocenteHandler,
    );
    this.handlerRegistry.register(
      'docente',
      'delete',
      this.deleteDocenteHandler,
    );
  }
}
