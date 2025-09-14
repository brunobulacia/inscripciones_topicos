import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateDocenteJobData,
  UpdateDocenteJobData,
  FindOneDocenteJobData,
  DeleteDocenteJobData,
  DocenteJobName,
} from '../types/docente-job.types';

@Injectable()
export class DocenteQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async addCreateDocenteJob(data: CreateDocenteJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(DocenteJobName.CREATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async addFindAllDocentesJob() {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      DocenteJobName.FIND_ALL,
      {},
      {
        jobId,
      },
    );
    return { jobId: job.id };
  }

  async addFindOneDocenteJob(data: FindOneDocenteJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      DocenteJobName.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id };
  }

  async addUpdateDocenteJob(data: UpdateDocenteJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(DocenteJobName.UPDATE, data, {
      jobId,
    });
    return { jobId: job.id };
  }

  async addDeleteDocenteJob(data: DeleteDocenteJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(DocenteJobName.DELETE, data, {
      jobId,
    });
    return { jobId: job.id };
  }
}
