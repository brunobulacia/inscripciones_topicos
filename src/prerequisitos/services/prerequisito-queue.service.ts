import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  PrerequisitJobType,
  CreatePrerequisitJobData,
  FindAllPrerequisitJobData,
  FindOnePrerequisitJobData,
  UpdatePrerequisitJobData,
  DeletePrerequisitJobData,
} from '../types/prerequisito-job.types';

@Injectable()
export class PrerequisitQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES) private readonly queue: Queue,
  ) {}

  async create(data: CreatePrerequisitJobData) {
    const jobId = uuidv4();
    const job = await this.queue.add(PrerequisitJobType.CREATE, data, {
      jobId,
    });
    return { jobId: job.id, message: 'Job para crear prerequisito encolado' };
  }

  async findAll(data: FindAllPrerequisitJobData = {}) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.queue.add(PrerequisitJobType.FIND_ALL, jobData, {
      jobId,
    });
    return {
      jobId: job.id,
      message: 'Job para obtener todos los prerequisitos encolado',
    };
  }

  async findOne(data: FindOnePrerequisitJobData) {
    const jobId = uuidv4();
    const jobData: FindOnePrerequisitJobData = { id: data.id };
    const job = await this.queue.add(PrerequisitJobType.FIND_ONE, jobData, {
      jobId,
    });
    return { jobId: job.id, message: 'Job para obtener prerequisito encolado' };
  }

  async update(data: UpdatePrerequisitJobData) {
    const jobId = uuidv4();
    const job = await this.queue.add(PrerequisitJobType.UPDATE, data, {
      jobId,
    });
    return {
      jobId: job.id,
      message: 'Job para actualizar prerequisito encolado',
    };
  }

  async delete(data: DeletePrerequisitJobData) {
    const jobId = uuidv4();
    const job = await this.queue.add(PrerequisitJobType.DELETE, data, {
      jobId,
    });
    return {
      jobId: job.id,
      message: 'Job para eliminar prerequisito encolado',
    };
  }
}
