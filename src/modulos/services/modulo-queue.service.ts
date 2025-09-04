import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  ModuloJobType,
  CreateModuloJobData,
  FindOneModuloJobData,
  UpdateModuloJobData,
  DeleteModuloJobData,
} from '../types/modulo-job.types';

@Injectable()
export class ModuloQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async enqueueCreateModulo(data: CreateModuloJobData) {
    return await this.inscripcionesQueue.add(ModuloJobType.CREATE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueFindAllModulos() {
    return await this.inscripcionesQueue.add(ModuloJobType.FIND_ALL, null, {
      jobId: uuidv4(),
    });
  }

  async enqueueFindOneModulo(data: FindOneModuloJobData) {
    return await this.inscripcionesQueue.add(ModuloJobType.FIND_ONE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueUpdateModulo(data: UpdateModuloJobData) {
    return await this.inscripcionesQueue.add(ModuloJobType.UPDATE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueDeleteModulo(data: DeleteModuloJobData) {
    return await this.inscripcionesQueue.add(ModuloJobType.DELETE, data, {
      jobId: uuidv4(),
    });
  }
}
