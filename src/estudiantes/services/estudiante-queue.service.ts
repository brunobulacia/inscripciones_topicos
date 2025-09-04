import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  EstudianteJobType,
  CreateEstudianteJobData,
  FindOneEstudianteJobData,
  UpdateEstudianteJobData,
  DeleteEstudianteJobData,
  FindAllEstudiantesJobData,
} from '../types/estudiante-job.types';

@Injectable()
export class EstudianteQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async createEstudiante(data: CreateEstudianteJobData) {
    const jobId = uuidv4();
    const job = await this.inscripcionesQueue.add(
      EstudianteJobType.CREATE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Estudiante encolado para creación' };
  }

  async findAllEstudiantes(data?: FindAllEstudiantesJobData) {
    const jobId = uuidv4();
    const jobData = data || { page: 0, limit: 100 };
    const job = await this.inscripcionesQueue.add(
      EstudianteJobType.FIND_ALL,
      jobData,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Consulta de estudiantes encolada' };
  }

  async findOneEstudiante(id: string) {
    const jobId = uuidv4();
    const data: FindOneEstudianteJobData = { id };
    const job = await this.inscripcionesQueue.add(
      EstudianteJobType.FIND_ONE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Consulta de estudiante encolada' };
  }

  async updateEstudiante(
    id: string,
    data: Omit<UpdateEstudianteJobData, 'id'>,
  ) {
    const jobId = uuidv4();
    const jobData: UpdateEstudianteJobData = { id, ...data };
    const job = await this.inscripcionesQueue.add(
      EstudianteJobType.UPDATE,
      jobData,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Estudiante encolado para actualización' };
  }

  async deleteEstudiante(id: string) {
    const jobId = uuidv4();
    const data: DeleteEstudianteJobData = { id };
    const job = await this.inscripcionesQueue.add(
      EstudianteJobType.DELETE,
      data,
      {
        jobId,
      },
    );
    return { jobId: job.id, message: 'Estudiante encolado para eliminación' };
  }
}
