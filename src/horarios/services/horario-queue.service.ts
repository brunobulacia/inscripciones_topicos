import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  HorarioJobType,
  CreateHorarioJobData,
  FindAllHorarioJobData,
  FindOneHorarioJobData,
  UpdateHorarioJobData,
  DeleteHorarioJobData,
} from '../types/horario-job.types';

@Injectable()
export class HorarioQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createHorario(data: CreateHorarioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(HorarioJobType.CREATE, data, {
      jobId,
    });

    return {
      jobId: job.id,
      message: 'Horario encolado para creación',
    };
  }

  async findAllHorarios(data?: FindAllHorarioJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      HorarioJobType.FIND_ALL,
      data || {},
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Búsqueda de horarios encolada',
    };
  }

  async findOneHorario(id: string) {
    const jobId = uuidv4();
    const jobData: FindOneHorarioJobData = { id };
    const job = await this.inscripcionesQueue.add(
      HorarioJobType.FIND_ONE,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Búsqueda de horario encolada',
    };
  }

  async updateHorario(id: string, data: Omit<UpdateHorarioJobData, 'id'>) {
    const jobId = uuidv4();
    const jobData: UpdateHorarioJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      HorarioJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Horario encolado para actualización',
    };
  }

  async deleteHorario(id: string) {
    const jobId = uuidv4();
    const jobData: DeleteHorarioJobData = { id };
    const job = await this.inscripcionesQueue.add(
      HorarioJobType.DELETE,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Horario encolado para eliminación',
    };
  }

  async findHorariosByAulaGrupoMateria(aulaGrupoMateriaId: string) {
    const jobId = uuidv4();
    const jobData: FindAllHorarioJobData = { aulaGrupoMateriaId };
    const job = await this.inscripcionesQueue.add(
      HorarioJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );

    return {
      jobId: job.id,
      message: 'Búsqueda de horarios por aula-grupo-materia encolada',
    };
  }
}
