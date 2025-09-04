import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  BoletaGrupoMateriaJobType,
  CreateBoletaGrupoMateriaJobData,
  FindOneBoletaGrupoMateriaJobData,
  UpdateBoletaGrupoMateriaJobData,
  DeleteBoletaGrupoMateriaJobData,
  FindAllBoletaGrupoMateriaJobData,
} from '../types/boleta-grupo-materia-job.types';

@Injectable()
export class BoletaGrupoMateriaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createBoletaGrupoMateria(data: CreateBoletaGrupoMateriaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      BoletaGrupoMateriaJobType.CREATE,
      data,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear boleta grupo materia encolado',
    };
  }

  async findAllBoletaGrupoMaterias(
    data: FindAllBoletaGrupoMateriaJobData = {},
  ) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      BoletaGrupoMateriaJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todas las boletas grupo materia encolado',
    };
  }

  async findOneBoletaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: FindOneBoletaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      BoletaGrupoMateriaJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener boleta grupo materia encolado',
    };
  }

  async updateBoletaGrupoMateria(
    id: string,
    data: Omit<UpdateBoletaGrupoMateriaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateBoletaGrupoMateriaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      BoletaGrupoMateriaJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar boleta grupo materia encolado',
    };
  }

  async deleteBoletaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: DeleteBoletaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      BoletaGrupoMateriaJobType.DELETE,
      data,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar boleta grupo materia encolado',
    };
  }
}
