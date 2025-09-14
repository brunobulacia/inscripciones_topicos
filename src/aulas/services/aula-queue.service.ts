import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateAulaJobData,
  UpdateAulaJobData,
  FindOneAulaJobData,
  DeleteAulaJobData,
  AulasJobType,
} from '../types/aula-job.types';

@Injectable()
export class AulaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async addCreateAulaJob(data: CreateAulaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(AulasJobType.CREATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async addFindAllAulasJob() {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      AulasJobType.FIND_ALL,
      {},
      {
        jobId,
      },
    );
    return { jobId: job.id };
  }

  async addFindOneAulaJob(data: FindOneAulaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(AulasJobType.FIND_ONE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async addUpdateAulaJob(data: UpdateAulaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(AulasJobType.UPDATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async addDeleteAulaJob(data: DeleteAulaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(AulasJobType.DELETE, data, {
      jobId,
    });
    return { jobId: job.id };
  }
}
