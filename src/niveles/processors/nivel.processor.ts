import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { NivelesService } from '../niveles.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  NivelJobType,
  NivelJobData,
  CreateNivelJobData,
  FindOneNivelJobData,
  UpdateNivelJobData,
  DeleteNivelJobData,
  NivelJobResult,
} from '../types/nivel-job.types';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class NivelProcessor extends WorkerHost {
  private readonly logger = new Logger(NivelProcessor.name);

  constructor(private readonly nivelesService: NivelesService) {
    super();
  }

  async process(job: Job<NivelJobData>): Promise<NivelJobResult> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case NivelJobType.CREATE:
        return await this.handleCreateNivel(job.data as CreateNivelJobData);

      case NivelJobType.FIND_ALL:
        return await this.handleFindAllNiveles();

      case NivelJobType.FIND_ONE:
        return await this.handleFindOneNivel(job.data as FindOneNivelJobData);

      case NivelJobType.UPDATE:
        return await this.handleUpdateNivel(job.data as UpdateNivelJobData);

      case NivelJobType.DELETE:
        return await this.handleDeleteNivel(job.data as DeleteNivelJobData);

      default:
        this.logger.error(`Unknown job type: ${job.name}`);
        return {
          success: false,
          error: `Unknown job type: ${job.name}`,
        };
    }
  }

  private async handleCreateNivel(
    data: CreateNivelJobData,
  ): Promise<NivelJobResult> {
    try {
      this.logger.log(`Creating nivel with data: ${JSON.stringify(data)}`);
      const createData = {
        semestre: data.semestre,
        estaActivo: data.estaActivo ?? true, // Valor por defecto si no se proporciona
      };
      const nivel = await this.nivelesService.create(createData);

      return {
        success: true,
        data: nivel,
      };
    } catch (error) {
      this.logger.error(`Error creating nivel: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async handleFindAllNiveles(): Promise<NivelJobResult> {
    try {
      this.logger.log('Finding all niveles');
      const niveles = await this.nivelesService.findAll();

      return {
        success: true,
        data: niveles,
      };
    } catch (error) {
      this.logger.error(`Error finding all niveles: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async handleFindOneNivel(
    data: FindOneNivelJobData,
  ): Promise<NivelJobResult> {
    try {
      this.logger.log(`Finding nivel with id: ${data.id}`);
      const nivel = await this.nivelesService.findOne(data.id);

      return {
        success: true,
        data: nivel,
      };
    } catch (error) {
      this.logger.error(`Error finding nivel: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async handleUpdateNivel(
    data: UpdateNivelJobData,
  ): Promise<NivelJobResult> {
    try {
      this.logger.log(`Updating nivel with id: ${data.id}`);
      const { id, ...updateData } = data;
      const nivel = await this.nivelesService.update(id, updateData);

      return {
        success: true,
        data: nivel,
      };
    } catch (error) {
      this.logger.error(`Error updating nivel: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async handleDeleteNivel(
    data: DeleteNivelJobData,
  ): Promise<NivelJobResult> {
    try {
      this.logger.log(`Deleting nivel with id: ${data.id}`);
      const nivel = await this.nivelesService.remove(data.id);

      return {
        success: true,
        data: nivel,
      };
    } catch (error) {
      this.logger.error(`Error deleting nivel: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
