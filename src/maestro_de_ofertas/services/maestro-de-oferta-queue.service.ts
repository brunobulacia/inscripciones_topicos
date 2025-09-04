import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  MaestroDeOfertaJobType,
  CreateMaestroDeOfertaJobData,
  DeleteMaestroDeOfertaJobData,
  FindAllMaestroDeOfertaJobData,
  FindOneMaestroDeOfertaJobData,
  UpdateMaestroDeOfertaJobData,
} from '../types/maestro-de-oferta.job.types';

@Injectable()
export class MaestroDeOfertaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}
  async createMaestroDeOferta(data: CreateMaestroDeOfertaJobData) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      MaestroDeOfertaJobType.CREATE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Job para crear maestro de oferta encolado',
    };
  }

  async findAllMaestroDeOfertas(data?: FindAllMaestroDeOfertaJobData) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      MaestroDeOfertaJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Job para obtener todas los maestros de oferta encolado',
    };
  }

  async findOneMaestroDeOferta(id: string) {
    const jobId = uuidv4();
    const data: FindOneMaestroDeOfertaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      MaestroDeOfertaJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Job para obtener un maestro de oferta encolado',
    };
  }

  async updateMaestroDeOferta(
    id: string,
    data: Omit<UpdateMaestroDeOfertaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateMaestroDeOfertaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      MaestroDeOfertaJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Job para actualizar un maestro de oferta encolado',
    };
  }

  async deleteMaestroDeOferta(id: string) {
    const jobId = uuidv4();
    const jobData: DeleteMaestroDeOfertaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      MaestroDeOfertaJobType.DELETE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Job para eliminar un maestro de oferta encolado',
    };
  }
}
