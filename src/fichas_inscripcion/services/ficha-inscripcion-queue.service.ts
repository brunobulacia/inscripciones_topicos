import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  FichaInscripcionJobType,
  CreateFichaInscripcionJobData,
  FindOneFichaInscripcionJobData,
  UpdateFichaInscripcionJobData,
  DeleteFichaInscripcionJobData,
  FindAllFichaInscripcionJobData,
} from '../types/ficha-inscripcion-job.types';

@Injectable()
export class FichaInscripcionQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createFichaInscripcion(data: CreateFichaInscripcionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      FichaInscripcionJobType.CREATE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Ficha de inscripción encolada para creación',
    };
  }

  async findAllFichaInscripcion(data?: FindAllFichaInscripcionJobData) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      FichaInscripcionJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Consulta de fichas de inscripción encolada',
    };
  }

  async findOneFichaInscripcion(id: string) {
    const jobId = uuidv4();
    const data: FindOneFichaInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      FichaInscripcionJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Consulta de ficha de inscripción encolada',
    };
  }

  async updateFichaInscripcion(
    id: string,
    data: Omit<UpdateFichaInscripcionJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateFichaInscripcionJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      FichaInscripcionJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Ficha de inscripción encolada para actualización',
    };
  }

  async deleteFichaInscripcion(id: string) {
    const jobId = uuidv4();
    const data: DeleteFichaInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      FichaInscripcionJobType.DELETE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Ficha de inscripción encolada para eliminación',
    };
  }
}
