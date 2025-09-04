import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  AvanceAcademicoJobType,
  CreateAvanceAcademicoJobData,
  FindOneAvanceAcademicoJobData,
  UpdateAvanceAcademicoJobData,
  DeleteAvanceAcademicoJobData,
  FindAllAvanceAcademicoJobData,
} from '../types/avance-academico-job.types';

@Injectable()
export class AvanceAcademicoQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createAvanceAcademico(data: CreateAvanceAcademicoJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      AvanceAcademicoJobType.CREATE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Avance académico encolado para creación',
    };
  }

  async findAllAvanceAcademico(data?: FindAllAvanceAcademicoJobData) {
    const jobId = uuidv4();
    const jobData = data || {};
    const job = await this.inscripcionesQueue.add(
      AvanceAcademicoJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Consulta de avances académicos encolada',
    };
  }

  async findOneAvanceAcademico(id: string) {
    const jobId = uuidv4();
    const data: FindOneAvanceAcademicoJobData = { id };
    const job = await this.inscripcionesQueue.add(
      AvanceAcademicoJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Consulta de avance académico encolada' };
  }

  async updateAvanceAcademico(
    id: string,
    data: Omit<UpdateAvanceAcademicoJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateAvanceAcademicoJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      AvanceAcademicoJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Avance académico encolado para actualización',
    };
  }

  async deleteAvanceAcademico(id: string) {
    const jobId = uuidv4();
    const data: DeleteAvanceAcademicoJobData = { id };
    const job = await this.inscripcionesQueue.add(
      AvanceAcademicoJobType.DELETE,
      data,
      {
        jobId,
      },
    );
    return {
      jobId: job.id,
      message: 'Avance académico encolado para eliminación',
    };
  }
}
