import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  DetalleInscripcionJobType,
  CreateDetalleInscripcionJobData,
  FindOneDetalleInscripcionJobData,
  UpdateDetalleInscripcionJobData,
  DeleteDetalleInscripcionJobData,
  FindAllDetalleInscripcionJobData,
} from '../types/detalle-inscripcion-job.types';

@Injectable()
export class DetalleInscripcionQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createDetalleInscripcion(data: CreateDetalleInscripcionJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      DetalleInscripcionJobType.CREATE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear detalle de inscripción encolado',
    };
  }

  async findAllDetalleInscripciones(
    data: FindAllDetalleInscripcionJobData = {},
  ) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      DetalleInscripcionJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todos los detalles de inscripción encolado',
    };
  }

  async findOneDetalleInscripcion(id: string) {
    const jobId = uuidv4();
    const data: FindOneDetalleInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      DetalleInscripcionJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener detalle de inscripción encolado',
    };
  }

  async updateDetalleInscripcion(
    id: string,
    data: Omit<UpdateDetalleInscripcionJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateDetalleInscripcionJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      DetalleInscripcionJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar detalle de inscripción encolado',
    };
  }

  async deleteDetalleInscripcion(id: string) {
    const jobId = uuidv4();
    const data: DeleteDetalleInscripcionJobData = { id };
    const job = await this.inscripcionesQueue.add(
      DetalleInscripcionJobType.DELETE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar detalle de inscripción encolado',
    };
  }
}
