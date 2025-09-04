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
} from '../types/docente-job.types';

@Injectable()
export class DocenteQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async addCreateDocenteJob(data: CreateDocenteJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('docentes_create', data, {
      jobId,
    });
  }

  async addFindAllDocentesJob() {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add(
      'docentes_find_all',
      {},
      {
        jobId,
      },
    );
  }

  async addFindOneDocenteJob(data: FindOneDocenteJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('docentes_find_one', data, {
      jobId,
    });
  }

  async addUpdateDocenteJob(data: UpdateDocenteJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('docentes_update', data, {
      jobId,
    });
  }

  async addDeleteDocenteJob(data: DeleteDocenteJobData) {
    const jobId = uuidv4();
    return await this.inscripcionesQueue.add('docentes_delete', data, {
      jobId,
    });
  }
}
