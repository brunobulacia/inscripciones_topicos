import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  PeriodoJobType,
  CreatePeriodoJobData,
  FindOnePeriodoJobData,
  UpdatePeriodoJobData,
  DeletePeriodoJobData,
} from '../types/periodo-job.types';

@Injectable()
export class PeriodoQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async enqueueCreatePeriodo(data: CreatePeriodoJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(PeriodoJobType.CREATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async enqueueFindAllPeriodos() {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PeriodoJobType.FIND_ALL,
      null,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Job encolado correctamente' };
  }

  async enqueueFindOnePeriodo(data: FindOnePeriodoJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PeriodoJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Job encolado correctamente' };
  }

  async enqueueUpdatePeriodo(data: UpdatePeriodoJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(PeriodoJobType.UPDATE, data, {
      jobId,
    });
    return { jobId: job.id, message: 'Job encolado correctamente' };
  }

  async enqueueDeletePeriodo(data: DeletePeriodoJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(PeriodoJobType.DELETE, data, {
      jobId,
    });
    return { jobId: job.id, message: 'Job encolado correctamente' };
  }
}
