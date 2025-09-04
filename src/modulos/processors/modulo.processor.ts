import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateModuloHandler,
  FindAllModulosHandler,
  FindOneModuloHandler,
  UpdateModuloHandler,
  DeleteModuloHandler,
} from '../handlers/modulo.handlers';

@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class ModuloProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    protected readonly jobSerializer: QueueJobSerializer,
    private readonly createModuloHandler: CreateModuloHandler,
    private readonly findAllModulosHandler: FindAllModulosHandler,
    private readonly findOneModuloHandler: FindOneModuloHandler,
    private readonly updateModuloHandler: UpdateModuloHandler,
    private readonly deleteModuloHandler: DeleteModuloHandler,
  ) {
    super(jobSerializer, handlerRegistry);
    this.registerHandlers();
  }

  registerHandlers() {
    // Registrar todos los handlers para 'modulo'
    this.handlerRegistry.register('modulo', 'create', this.createModuloHandler);
    this.handlerRegistry.register(
      'modulo',
      'find_all',
      this.findAllModulosHandler,
    );
    this.handlerRegistry.register(
      'modulo',
      'find_one',
      this.findOneModuloHandler,
    );
    this.handlerRegistry.register('modulo', 'update', this.updateModuloHandler);
    this.handlerRegistry.register('modulo', 'delete', this.deleteModuloHandler);
  }
}
