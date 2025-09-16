import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  GrupoMateriaJobType,
  CreateGrupoMateriaJobData,
  FindAllGrupoMateriaJobData,
  FindOneGrupoMateriaJobData,
  UpdateGrupoMateriaJobData,
  DeleteGrupoMateriaJobData,
} from '../types/grupo-materia-job.types';

@Injectable()
export class GrupoMateriaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createGrupoMateria(data: CreateGrupoMateriaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      GrupoMateriaJobType.CREATE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear grupo materia encolado',
    };
  }

  async findAllGrupoMaterias(data: FindAllGrupoMateriaJobData = {}) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      GrupoMateriaJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todos los grupos materia encolado',
    };
  }

  async findOneGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: FindOneGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      GrupoMateriaJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener grupo materia encolado',
    };
  }

  async updateGrupoMateria(
    id: string,
    data: Omit<UpdateGrupoMateriaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateGrupoMateriaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      GrupoMateriaJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar grupo materia encolado',
    };
  }

  async deleteGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: DeleteGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      GrupoMateriaJobType.DELETE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar grupo materia encolado',
    };
  }
}
