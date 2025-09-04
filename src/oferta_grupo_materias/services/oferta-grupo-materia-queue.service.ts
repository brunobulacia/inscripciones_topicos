import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  OfertaGrupoMateriaJobType,
  CreateOfertaGrupoMateriaJobData,
  FindAllOfertaGrupoMateriaJobData,
  FindOneOfertaGrupoMateriaJobData,
  UpdateOfertaGrupoMateriaJobData,
  DeleteOfertaGrupoMateriaJobData,
} from '../types/oferta-grupo-materia-job.types';

@Injectable()
export class OfertaGrupoMateriaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createOfertaGrupoMateria(data: CreateOfertaGrupoMateriaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      OfertaGrupoMateriaJobType.CREATE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear oferta grupo materia encolado',
    };
  }

  async findAllOfertaGrupoMaterias(
    data: FindAllOfertaGrupoMateriaJobData = {},
  ) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      OfertaGrupoMateriaJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todas las ofertas grupo materia encolado',
    };
  }

  async findOneOfertaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: FindOneOfertaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      OfertaGrupoMateriaJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener oferta grupo materia encolado',
    };
  }

  async updateOfertaGrupoMateria(
    id: string,
    data: Omit<UpdateOfertaGrupoMateriaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateOfertaGrupoMateriaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      OfertaGrupoMateriaJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar oferta grupo materia encolado',
    };
  }

  async deleteOfertaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: DeleteOfertaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      OfertaGrupoMateriaJobType.DELETE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar oferta grupo materia encolado',
    };
  }
}
