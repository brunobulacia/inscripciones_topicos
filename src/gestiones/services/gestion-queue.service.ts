import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  GestionJobType,
  CreateGestionJobData,
  FindOneGestionJobData,
  UpdateGestionJobData,
  DeleteGestionJobData,
} from '../types/gestion-job.types';

@Injectable()
export class GestionQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  async enqueueCreateGestion(data: CreateGestionJobData) {
    return await this.inscripcionesQueue.add(GestionJobType.CREATE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueFindAllGestiones() {
    return await this.inscripcionesQueue.add(GestionJobType.FIND_ALL, null, {
      jobId: uuidv4(),
    });
  }

  async enqueueFindOneGestion(data: FindOneGestionJobData) {
    return await this.inscripcionesQueue.add(GestionJobType.FIND_ONE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueUpdateGestion(data: UpdateGestionJobData) {
    return await this.inscripcionesQueue.add(GestionJobType.UPDATE, data, {
      jobId: uuidv4(),
    });
  }

  async enqueueDeleteGestion(data: DeleteGestionJobData) {
    return await this.inscripcionesQueue.add(GestionJobType.DELETE, data, {
      jobId: uuidv4(),
    });
  }
}
