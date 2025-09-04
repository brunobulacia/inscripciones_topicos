import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import {
  CreateGestionHandler,
  FindAllGestionesHandler,
  FindOneGestionHandler,
  UpdateGestionHandler,
  DeleteGestionHandler,
} from '../handlers/gestion.handlers';

@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class GestionProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    protected readonly jobSerializer: QueueJobSerializer,
    private readonly createGestionHandler: CreateGestionHandler,
    private readonly findAllGestionesHandler: FindAllGestionesHandler,
    private readonly findOneGestionHandler: FindOneGestionHandler,
    private readonly updateGestionHandler: UpdateGestionHandler,
    private readonly deleteGestionHandler: DeleteGestionHandler,
  ) {
    super(jobSerializer, handlerRegistry);
    this.registerHandlers();
  }

  registerHandlers() {
    // Registrar todos los handlers para 'gestion'
    this.handlerRegistry.register(
      'gestion',
      'create',
      this.createGestionHandler,
    );
    this.handlerRegistry.register(
      'gestion',
      'find_all',
      this.findAllGestionesHandler,
    );
    this.handlerRegistry.register(
      'gestion',
      'find_one',
      this.findOneGestionHandler,
    );
    this.handlerRegistry.register(
      'gestion',
      'update',
      this.updateGestionHandler,
    );
    this.handlerRegistry.register(
      'gestion',
      'delete',
      this.deleteGestionHandler,
    );
  }
}
