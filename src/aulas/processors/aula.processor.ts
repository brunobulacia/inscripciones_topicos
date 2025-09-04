import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateAulaHandler,
  FindAllAulasHandler,
  FindOneAulaHandler,
  UpdateAulaHandler,
  DeleteAulaHandler,
} from '../handlers/aula.handlers';

@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class AulaProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    protected readonly jobSerializer: QueueJobSerializer,
    private readonly createAulaHandler: CreateAulaHandler,
    private readonly findAllAulasHandler: FindAllAulasHandler,
    private readonly findOneAulaHandler: FindOneAulaHandler,
    private readonly updateAulaHandler: UpdateAulaHandler,
    private readonly deleteAulaHandler: DeleteAulaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
    this.registerHandlers();
  }

  registerHandlers() {
    // Registrar todos los handlers para 'aula'
    this.handlerRegistry.register('aula', 'create', this.createAulaHandler);
    this.handlerRegistry.register('aula', 'find_all', this.findAllAulasHandler);
    this.handlerRegistry.register('aula', 'find_one', this.findOneAulaHandler);
    this.handlerRegistry.register('aula', 'update', this.updateAulaHandler);
    this.handlerRegistry.register('aula', 'delete', this.deleteAulaHandler);
  }
}
