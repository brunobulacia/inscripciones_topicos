import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { CarrerasService } from '../carreras.service';
import { QUEUE_NAMES } from '../../common/types/queue.types';
import {
  CarreraJobType,
  CarreraJobData,
  CreateCarreraJobData,
  FindOneCarreraJobData,
  UpdateCarreraJobData,
  DeleteCarreraJobData,
  CarreraJobResult,
} from '../types/carrera-job.types';

@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class CarreraProcessor extends WorkerHost {
  private readonly logger = new Logger(CarreraProcessor.name);

  constructor(private readonly carrerasService: CarrerasService) {
    super();
  }

  async process(job: Job<CarreraJobData>): Promise<CarreraJobResult> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case CarreraJobType.CREATE:
        return await this.handleCreateCarrera(job.data as CreateCarreraJobData);

      case CarreraJobType.FIND_ALL:
        return await this.handleFindAllCarreras();

      case CarreraJobType.FIND_ONE:
        return await this.handleFindOneCarrera(
          job.data as FindOneCarreraJobData,
        );

      case CarreraJobType.UPDATE:
        return await this.handleUpdateCarrera(job.data as UpdateCarreraJobData);

      case CarreraJobType.DELETE:
        return await this.handleDeleteCarrera(job.data as DeleteCarreraJobData);

      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async handleCreateCarrera(
    data: CreateCarreraJobData,
  ): Promise<CarreraJobResult> {
    const createDto = {
      codigo: data.codigo,
      nombre: data.nombre,
    };
    const carrera = await this.carrerasService.create(createDto);
    return {
      success: true,
      data: carrera,
    };
  }

  private async handleFindAllCarreras(): Promise<CarreraJobResult> {
    const carreras = await this.carrerasService.findAll();
    return {
      success: true,
      data: carreras,
    };
  }

  private async handleFindOneCarrera(
    data: FindOneCarreraJobData,
  ): Promise<CarreraJobResult> {
    const carrera = await this.carrerasService.findOne(data.id);
    return {
      success: true,
      data: carrera,
    };
  }

  private async handleUpdateCarrera(
    data: UpdateCarreraJobData,
  ): Promise<CarreraJobResult> {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.codigo !== undefined && { codigo: updateData.codigo }),
      ...(updateData.nombre !== undefined && { nombre: updateData.nombre }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    const carrera = await this.carrerasService.update(id, updateDto);
    return {
      success: true,
      data: carrera,
    };
  }

  private async handleDeleteCarrera(
    data: DeleteCarreraJobData,
  ): Promise<CarreraJobResult> {
    const carrera = await this.carrerasService.remove(data.id);
    return {
      success: true,
      data: carrera,
    };
  }
}
