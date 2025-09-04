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
} from '../types/aula-job.types';

@Injectable()
export class AulaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async addCreateAulaJob(data: CreateAulaJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('aulas_create', data, {
      jobId,
    });
  }

  async addFindAllAulasJob() {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add(
      'aulas_find_all',
      {},
      {
        jobId,
      },
    );
  }

  async addFindOneAulaJob(data: FindOneAulaJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('aulas_find_one', data, {
      jobId,
    });
  }

  async addUpdateAulaJob(data: UpdateAulaJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('aulas_update', data, {
      jobId,
    });
  }

  async addDeleteAulaJob(data: DeleteAulaJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('aulas_delete', data, {
      jobId,
    });
  }
}
