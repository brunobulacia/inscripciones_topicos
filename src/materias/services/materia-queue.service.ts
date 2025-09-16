import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID as uuidv4 } from 'crypto';
import { QUEUE_NAMES } from 'src/common/types/queue.types';
import {
  MateriaJobType,
  CreateMateriaJobData,
  FindAllMateriaJobData,
  FindOneMateriaJobData,
  UpdateMateriaJobData,
  DeleteMateriaJobData,
} from '../types/materia-job.types';

@Injectable()
export class MateriaQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createMateria(data: CreateMateriaJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(MateriaJobType.CREATE, data, {
      jobId,
      removeOnComplete: false,
      removeOnFail: false,
    });

    return {
      jobId: job.id,
      message: 'Job para crear materia encolado',
    };
  }

  async findAllMaterias(data: FindAllMateriaJobData = {}) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      MateriaJobType.FIND_ALL,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener todas las materias encolado',
    };
  }

  async findOneMateria(id: string) {
    const jobId = uuidv4();
    const data: FindOneMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(
      MateriaJobType.FIND_ONE,
      data,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para obtener materia encolado',
    };
  }

  async updateMateria(id: string, data: Omit<UpdateMateriaJobData, 'id'>) {
    const jobId = uuidv4();
    const jobData: UpdateMateriaJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      MateriaJobType.UPDATE,
      jobData,
      {
        jobId,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return {
      jobId: job.id,
      message: 'Job para actualizar materia encolado',
    };
  }

  async deleteMateria(id: string) {
    const jobId = uuidv4();
    const data: DeleteMateriaJobData = { id };
    const job = await this.inscripcionesQueue.add(MateriaJobType.DELETE, data, {
      jobId,
      removeOnComplete: false,
      removeOnFail: false,
    });

    return {
      jobId: job.id,
      message: 'Job para eliminar materia encolado',
    };
  }
}
