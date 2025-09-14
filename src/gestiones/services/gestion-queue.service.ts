import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  GestionJobType,
  CreateGestionJobData,
  FindOneGestionJobData,
  UpdateGestionJobData,
  DeleteGestionJobData,
} from '../types/gestion-job.types';

@Injectable()
export class GestionQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async enqueueCreateGestion(data: CreateGestionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(GestionJobType.CREATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async enqueueFindAllGestiones() {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      GestionJobType.FIND_ALL,
      null,
      {
        jobId,
      },
    );
    return { jobId: job.id };
  }

  async enqueueFindOneGestion(data: FindOneGestionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      GestionJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id };
  }

  async enqueueUpdateGestion(data: UpdateGestionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(GestionJobType.UPDATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async enqueueDeleteGestion(data: DeleteGestionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(GestionJobType.DELETE, data, {
      jobId,
    });
    return { jobId: job.id };
  }
}
