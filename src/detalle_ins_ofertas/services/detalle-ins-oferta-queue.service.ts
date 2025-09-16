import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  DetalleInsOfertaJobType,
  CreateDetalleInsOfertaJobData,
  FindOneDetalleInsOfertaJobData,
  UpdateDetalleInsOfertaJobData,
  DeleteDetalleInsOfertaJobData,
  FindAllDetalleInsOfertaJobData,
} from '../types/detalle-ins-oferta-job.types';

@Injectable()
export class DetalleInsOfertaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createDetalleInsOferta(data: CreateDetalleInsOfertaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      DetalleInsOfertaJobType.CREATE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear detalle ins oferta encolado',
    };
  }

  async findAllDetalleInsOfertas(data: FindAllDetalleInsOfertaJobData = {}) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      DetalleInsOfertaJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todos los detalles ins oferta encolado',
    };
  }

  async findOneDetalleInsOferta(id: string) {
    const jobId = uuidv4();
    const data: FindOneDetalleInsOfertaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      DetalleInsOfertaJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener detalle ins oferta encolado',
    };
  }

  async updateDetalleInsOferta(
    id: string,
    data: Omit<UpdateDetalleInsOfertaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateDetalleInsOfertaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      DetalleInsOfertaJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar detalle ins oferta encolado',
    };
  }

  async deleteDetalleInsOferta(id: string) {
    const jobId = uuidv4();
    const data: DeleteDetalleInsOfertaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      DetalleInsOfertaJobType.DELETE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar detalle ins oferta encolado',
    };
  }
}
