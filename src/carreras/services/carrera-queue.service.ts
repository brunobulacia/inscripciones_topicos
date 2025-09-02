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
  constructor(@InjectQueue(QUEUE_NAMES.CARRERAS) private carreraQueue: Queue) {}

  async createCarrera(data: CreateCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.CREATE, data, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    return { jobId: job.id };
  }

  async findAllCarreras() {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.FIND_ALL, null, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    return { jobId: job.id };
  }

  async findOneCarrera(data: FindOneCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.FIND_ONE, data, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    return { jobId: job.id };
  }

  async updateCarrera(data: UpdateCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.UPDATE, data, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    return { jobId: job.id };
  }

  async deleteCarrera(data: DeleteCarreraJobData) {
    const jobId = uuidv4();
    const job = await this.carreraQueue.add(CarreraJobType.DELETE, data, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
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

  async getQueueStats() {
    const waiting = await this.carreraQueue.getWaiting();
    const active = await this.carreraQueue.getActive();
    const completed = await this.carreraQueue.getCompleted();
    const failed = await this.carreraQueue.getFailed();

    return {
      stats: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      },
      jobs: {
        waiting: waiting.slice(0, 10).map((job) => ({
          id: job.id,
          name: job.name,
          data: job.data,
          createdAt: new Date(job.timestamp).toISOString(),
        })),
        active: active.map((job) => ({
          id: job.id,
          name: job.name,
          data: job.data,
          processedAt: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
        })),
        recien_completados: completed.slice(-5).map((job) => ({
          id: job.id,
          name: job.name,
          result: job.returnvalue,
          processedAt: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
          completedAt: job.finishedOn
            ? new Date(job.finishedOn).toISOString()
            : null,
        })),
        fallados: failed.slice(-5).map((job) => ({
          id: job.id,
          name: job.name,
          error: job.failedReason,
          failedAt: job.failedOn ? new Date(job.failedOn).toISOString() : null,
        })),
      },
    };
  }

  async clearQueue() {
    await this.carreraQueue.obliterate({ force: true });
    return { message: 'Cola limpiada exitosamente' };
  }
}
