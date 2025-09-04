import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  BoletaInscripcionJobType,
  CreateBoletaInscripcionJobData,
  FindOneBoletaInscripcionJobData,
  UpdateBoletaInscripcionJobData,
  DeleteBoletaInscripcionJobData,
  FindAllBoletaInscripcionJobData,
} from '../types/boleta-inscripcion-job.types';

@Injectable()
export class BoletaInscripcionQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createBoletaInscripcion(data: CreateBoletaInscripcionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      BoletaInscripcionJobType.CREATE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Boleta de inscripción encolada para creación',
    };
  }

  async findAllBoletaInscripcion(data?: FindAllBoletaInscripcionJobData) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      BoletaInscripcionJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Consulta de boletas de inscripción encolada',
    };
  }

  async findOneBoletaInscripcion(id: string) {
    const jobId = uuidv4();
    const data: FindOneBoletaInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      BoletaInscripcionJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Consulta de boleta de inscripción encolada',
    };
  }

  async updateBoletaInscripcion(
    id: string,
    data: Omit<UpdateBoletaInscripcionJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateBoletaInscripcionJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      BoletaInscripcionJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Boleta de inscripción encolada para actualización',
    };
  }

  async deleteBoletaInscripcion(id: string) {
    const jobId = uuidv4();
    const data: DeleteBoletaInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      BoletaInscripcionJobType.DELETE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Boleta de inscripción encolada para eliminación',
    };
  }
}
