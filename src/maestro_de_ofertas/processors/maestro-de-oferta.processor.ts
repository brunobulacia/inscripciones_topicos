import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateMaestroDeOfertaHandler,
  FindAllMaestroDeOfertasHandler,
  FindOneMaestroDeOfertaHandler,
  UpdateMaestroDeOfertaHandler,
  DeleteMaestroDeOfertaHandler,
} from './handlers/maestro-de-oferta.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class MaestroDeOfertaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createMaestroDeOfertaHandler: CreateMaestroDeOfertaHandler,
    private readonly findAllMaestroDeOfertasHandler: FindAllMaestroDeOfertasHandler,
    private readonly findOneMaestroDeOfertaHandler: FindOneMaestroDeOfertaHandler,
    private readonly updateMaestroDeOfertaHandler: UpdateMaestroDeOfertaHandler,
    private readonly deleteMaestroDeOfertaHandler: DeleteMaestroDeOfertaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'maestrodeoferta',
      'create',
      this.createMaestroDeOfertaHandler,
    );
    this.handlerRegistry.register(
      'maestrodeoferta',
      'find_all',
      this.findAllMaestroDeOfertasHandler,
    );
    this.handlerRegistry.register(
      'maestrodeoferta',
      'find_one',
      this.findOneMaestroDeOfertaHandler,
    );
    this.handlerRegistry.register(
      'maestrodeoferta',
      'update',
      this.updateMaestroDeOfertaHandler,
    );
    this.handlerRegistry.register(
      'maestrodeoferta',
      'delete',
      this.deleteMaestroDeOfertaHandler,
    );
  }
}
