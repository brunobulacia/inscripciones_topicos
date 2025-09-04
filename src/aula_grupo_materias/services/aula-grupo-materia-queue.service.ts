import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID as uuidv4 } from 'crypto';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  AulaGrupoMateriaJobType,
  CreateAulaGrupoMateriaJobData,
  FindAllAulaGrupoMateriaJobData,
  FindOneAulaGrupoMateriaJobData,
  UpdateAulaGrupoMateriaJobData,
  DeleteAulaGrupoMateriaJobData,
} from '../types/aula-grupo-materia-job.types';

@Injectable()
export class AulaGrupoMateriaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createAulaGrupoMateria(data: CreateAulaGrupoMateriaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      AulaGrupoMateriaJobType.CREATE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para crear aula grupo materia encolado',
    };
  }

  async findAllAulaGrupoMaterias(data: FindAllAulaGrupoMateriaJobData = {}) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      AulaGrupoMateriaJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todas las aula grupo materias encolado',
    };
  }

  async findOneAulaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: FindOneAulaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      AulaGrupoMateriaJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener aula grupo materia encolado',
    };
  }

  async updateAulaGrupoMateria(
    id: string,
    data: Omit<UpdateAulaGrupoMateriaJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateAulaGrupoMateriaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      AulaGrupoMateriaJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar aula grupo materia encolado',
    };
  }

  async deleteAulaGrupoMateria(id: string) {
    const jobId = uuidv4();
    const data: DeleteAulaGrupoMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      AulaGrupoMateriaJobType.DELETE,
      data,
      {
        jobId,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para eliminar aula grupo materia encolado',
    };
  }
}
