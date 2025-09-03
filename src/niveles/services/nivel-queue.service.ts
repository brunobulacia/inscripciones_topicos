import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import {
  NivelJobType,
  CreateNivelJobData,
  FindOneNivelJobData,
  UpdateNivelJobData,
  DeleteNivelJobData,
} from '../types/nivel-job.types';
import { QUEUE_NAMES, JobStatusResponse } from '../../common/types/queue.types';

@Injectable()
export class NivelQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES) private nivelQueue: Queue,
  ) {}

  async createNivel(data: CreateNivelJobData) {
    const jobId = uuidv4();
    const job = await this.nivelQueue.add(NivelJobType.CREATE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      delay: 10000, // Para simular retraso
    });
    return { jobId: job.id };
  }

  async findAllNiveles() {
    const jobId = uuidv4();
    const job = await this.nivelQueue.add(NivelJobType.FIND_ALL, null, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return { jobId: job.id };
  }

  async findOneNivel(data: FindOneNivelJobData) {
    const jobId = uuidv4();
    const job = await this.nivelQueue.add(NivelJobType.FIND_ONE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return { jobId: job.id };
  }

  async updateNivel(data: UpdateNivelJobData) {
    const jobId = uuidv4();
    const job = await this.nivelQueue.add(NivelJobType.UPDATE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      delay: 10000, // Para simular retraso
    });
    return { jobId: job.id };
  }

  async deleteNivel(data: DeleteNivelJobData) {
    const jobId = uuidv4();
    const job = await this.nivelQueue.add(NivelJobType.DELETE, data, {
      jobId,
      removeOnComplete: 100,
      removeOnFail: 50,
      delay: 10000, // Para simular retraso
    });
    return { jobId: job.id };
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const job = await this.nivelQueue.getJob(jobId);

      if (!job) {
        return {
          status: 'not_found',
          message: 'Job not found',
        };
      }

      const state = await job.getState();

      switch (state) {
        case 'waiting':
          return {
            status: 'waiting',
            message: 'Job is waiting to be processed',
          };

        case 'active':
          return {
            status: 'processing',
            message: 'Job is currently being processed',
          };

        case 'completed':
          return {
            status: 'completed',
            data: job.returnvalue,
            message: 'Job completed successfully',
          };

        case 'failed':
          return {
            status: 'failed',
            error: job.failedReason,
            message: 'Job failed to process',
          };

        default:
          return {
            status: 'not_found',
            message: 'Unknown job state',
          };
      }
    } catch (error) {
      return {
        status: 'failed',
        error: error.message,
        message: 'Error retrieving job status',
      };
    }
  }

  async getJobResult(jobId: string): Promise<JobStatusResponse> {
    const job = await this.nivelQueue.getJob(jobId);

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
    const waiting = await this.nivelQueue.getWaiting();
    const active = await this.nivelQueue.getActive();
    const completed = await this.nivelQueue.getCompleted();
    const failed = await this.nivelQueue.getFailed();

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
        recien_completados: completed.slice(-10).map((job) => ({
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
        fallados: failed.slice(-10).map((job) => ({
          id: job.id,
          name: job.name,
          error: job.failedReason,
          failedAt:
            job.failedReason && job.finishedOn
              ? new Date(job.finishedOn).toISOString()
              : job.processedOn
                ? new Date(job.processedOn).toISOString()
                : new Date().toISOString(),
        })),
      },
    };
  }

  async clearQueue() {
    await this.nivelQueue.obliterate({ force: true });
    return { message: 'Cola limpiada exitosamente' };
  }
}
