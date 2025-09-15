import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { BaseQueueProcessor } from '../../common/processors/base-queue.processor';
import { QueueJobSerializer } from '../../common/services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from '../../common/services/queue-job-handler-registry.service';
import {
  CreateCarreraHandler,
  FindAllCarrerasHandler,
  FindOneCarreraHandler,
  UpdateCarreraHandler,
  DeleteCarreraHandler,
} from '../handlers/carrera.handlers';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES, {
  concurrency: 20, // Procesar hasta 20 jobs de carreras simultáneamente
})
export class CarreraProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createCarreraHandler: CreateCarreraHandler,
    private readonly findAllCarrerasHandler: FindAllCarrerasHandler,
    private readonly findOneCarreraHandler: FindOneCarreraHandler,
    private readonly updateCarreraHandler: UpdateCarreraHandler,
    private readonly deleteCarreraHandler: DeleteCarreraHandler,
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    // Registrar todos los handlers para la entidad "carrera"
    this.handlerRegistry.register(
      'carrera',
      'create',
      this.createCarreraHandler,
    );
    this.handlerRegistry.register(
      'carrera',
      'find_all',
      this.findAllCarrerasHandler,
    );
    this.handlerRegistry.register(
      'carrera',
      'find_one',
      this.findOneCarreraHandler,
    );
    this.handlerRegistry.register(
      'carrera',
      'update',
      this.updateCarreraHandler,
    );
    this.handlerRegistry.register(
      'carrera',
      'delete',
      this.deleteCarreraHandler,
    );
  }
}
