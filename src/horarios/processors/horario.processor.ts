import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { HorarioJobType } from '../types/horario-job.types';
import {
  CreateHorarioHandler,
  FindAllHorariosHandler,
  FindOneHorarioHandler,
  UpdateHorarioHandler,
  DeleteHorarioHandler,
} from './handlers/horario.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class HorarioProcessor extends BaseQueueProcessor {
  constructor(
    protected readonly jobSerializer: QueueJobSerializer,
    protected readonly handlerRegistry: QueueJobHandlerRegistry,
    private readonly createHorarioHandler: CreateHorarioHandler,
    private readonly findAllHorariosHandler: FindAllHorariosHandler,
    private readonly findOneHorarioHandler: FindOneHorarioHandler,
    private readonly updateHorarioHandler: UpdateHorarioHandler,
    private readonly deleteHorarioHandler: DeleteHorarioHandler,
  ) {
    super(jobSerializer, handlerRegistry);
    this.registerHandlers();
  }

  registerHandlers(): void {
    this.handlerRegistry.register(
      'horario',
      'create',
      this.createHorarioHandler,
    );
    this.handlerRegistry.register(
      'horario',
      'find_all',
      this.findAllHorariosHandler,
    );
    this.handlerRegistry.register(
      'horario',
      'find_one',
      this.findOneHorarioHandler,
    );
    this.handlerRegistry.register(
      'horario',
      'update',
      this.updateHorarioHandler,
    );
    this.handlerRegistry.register(
      'horario',
      'delete',
      this.deleteHorarioHandler,
    );
  }
}
