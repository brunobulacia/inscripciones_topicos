import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import {
  CarreraJobType,
  CreateCarreraJobData,
  FindOneCarreraJobData,
  UpdateCarreraJobData,
  DeleteCarreraJobData,
} from '../types/carrera-job.types';
import { QUEUE_NAMES, JobStatusResponse } from '../../common/types/queue.types';

@Injectable()
export class CarreraQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES) private carreraQueue: Queue,
  ) {}

  async createCarrera(data: CreateCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.CREATE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      delay: 10000, //PARA SIMULAR RETRASO NOMAS XD
    });
    return { jobId: job.id };
  }

  async findAllCarreras() {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.FIND_ALL, null, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      // delay: Math.floor(Math.random() * 500),
    });
    return { jobId: job.id };
  }

  async findOneCarrera(data: FindOneCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.FIND_ONE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      // delay: Math.floor(Math.random() * 500),
    });
    return { jobId: job.id };
  }

  async updateCarrera(data: UpdateCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.UPDATE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      // delay: Math.floor(Math.random() * 500),
    });
    return { jobId: job.id };
  }

  async deleteCarrera(data: DeleteCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.DELETE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      // delay: Math.floor(Math.random() * 500),
    });
    return { jobId: job.id };
  }

  async getJobResult(jobId: string): Promise<JobStatusResponse> {
    const job = await this.carreraQueue.getJob(jobId);

    if (!job) {
      return { status: 'not_found', message: 'Job not found' };
    }

    if (job.finishedOn) {
      if (job.failedReason) {
        return {
          status: 'failed',
          error: job.failedReason,
          data: job.returnvalue,
        };
      }
      return {
        status: 'completed',
        data: job.returnvalue,
      };
    }

    if (job.processedOn) {
      return { status: 'processing' };
    }

    return { status: 'waiting' };
  }
}
