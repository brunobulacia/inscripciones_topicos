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
}
