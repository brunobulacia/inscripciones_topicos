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
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(ModuloJobType.CREATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async enqueueFindAllModulos() {
    const job = await this.inscripcionesQueue.add(
      ModuloJobType.FIND_ALL,
      null,
      {
        jobId: uuidv4(),
      },
    );
    return { jobId: job.id };
  }

  async enqueueFindOneModulo(data: FindOneModuloJobData) {
    const job = await this.inscripcionesQueue.add(
      ModuloJobType.FIND_ONE,
      data,
      {
        jobId: uuidv4(),
      },
    );
    return { jobId: job.id };
  }

  async enqueueUpdateModulo(data: UpdateModuloJobData) {
    const job = await this.inscripcionesQueue.add(ModuloJobType.UPDATE, data, {
      jobId: uuidv4(),
    });
    return { jobId: job.id };
  }

  async enqueueDeleteModulo(data: DeleteModuloJobData) {
    const job = await this.inscripcionesQueue.add(ModuloJobType.DELETE, data, {
      jobId: uuidv4(),
    });
    return { jobId: job.id };
  }
}
