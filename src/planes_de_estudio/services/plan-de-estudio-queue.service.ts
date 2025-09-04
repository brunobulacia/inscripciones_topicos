import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  PlanDeEstudioJobType,
  CreatePlanDeEstudioJobData,
  FindOnePlanDeEstudioJobData,
  UpdatePlanDeEstudioJobData,
  DeletePlanDeEstudioJobData,
} from '../types/plan-de-estudio-job.types';

@Injectable()
export class PlanDeEstudioQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async enqueueCreatePlanDeEstudio(data: CreatePlanDeEstudioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PlanDeEstudioJobType.CREATE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Plan de estudio encolado para creación' };
  }

  async enqueueFindAllPlanesDeEstudio() {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PlanDeEstudioJobType.FIND_ALL,
      null,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Consulta de planes de estudio encolada' };
  }

  async enqueueFindOnePlanDeEstudio(data: FindOnePlanDeEstudioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PlanDeEstudioJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Consulta de plan de estudio encolada' };
  }

  async enqueueUpdatePlanDeEstudio(data: UpdatePlanDeEstudioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PlanDeEstudioJobType.UPDATE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Plan de estudio encolado para actualización',
    };
  }

  async enqueueDeletePlanDeEstudio(data: DeletePlanDeEstudioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      PlanDeEstudioJobType.DELETE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Plan de estudio encolado para eliminación',
    };
  }
}
