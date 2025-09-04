import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CreateDetalleInsOfertaHandler,
  FindAllDetalleInsOfertaHandler,
  FindOneDetalleInsOfertaHandler,
  UpdateDetalleInsOfertaHandler,
  DeleteDetalleInsOfertaHandler,
} from './handlers/detalle-ins-oferta.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class DetalleInsOfertaProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createDetalleInsOfertaHandler: CreateDetalleInsOfertaHandler,
    private readonly findAllDetalleInsOfertaHandler: FindAllDetalleInsOfertaHandler,
    private readonly findOneDetalleInsOfertaHandler: FindOneDetalleInsOfertaHandler,
    private readonly updateDetalleInsOfertaHandler: UpdateDetalleInsOfertaHandler,
    private readonly deleteDetalleInsOfertaHandler: DeleteDetalleInsOfertaHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'detalleinsoferta',
      'create',
      this.createDetalleInsOfertaHandler,
    );
    this.handlerRegistry.register(
      'detalleinsoferta',
      'find_all',
      this.findAllDetalleInsOfertaHandler,
    );
    this.handlerRegistry.register(
      'detalleinsoferta',
      'find_one',
      this.findOneDetalleInsOfertaHandler,
    );
    this.handlerRegistry.register(
      'detalleinsoferta',
      'update',
      this.updateDetalleInsOfertaHandler,
    );
    this.handlerRegistry.register(
      'detalleinsoferta',
      'delete',
      this.deleteDetalleInsOfertaHandler,
    );
  }
}
