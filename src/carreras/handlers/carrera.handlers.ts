import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { CarrerasService } from '../carreras.service';
import {
  CreateCarreraJobData,
  FindOneCarreraJobData,
  UpdateCarreraJobData,
  DeleteCarreraJobData,
} from '../types/carrera-job.types';

@Injectable()
export class CreateCarreraHandler implements JobHandler<CreateCarreraJobData> {
  constructor(private readonly carrerasService: CarrerasService) {}

  async handle(data: CreateCarreraJobData) {
    try {
      const createDto = {
        codigo: data.codigo,
        nombre: data.nombre,
      };
      return await this.carrerasService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe una carrera con el código ${data.codigo}`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllCarrerasHandler implements JobHandler<null> {
  constructor(private readonly carrerasService: CarrerasService) {}

  async handle(_data: null) {
    return await this.carrerasService.findAll();
  }
}

@Injectable()
export class FindOneCarreraHandler
  implements JobHandler<FindOneCarreraJobData>
{
  constructor(private readonly carrerasService: CarrerasService) {}

  async handle(data: FindOneCarreraJobData) {
    return await this.carrerasService.findOne(data.id);
  }
}

@Injectable()
export class UpdateCarreraHandler implements JobHandler<UpdateCarreraJobData> {
  constructor(private readonly carrerasService: CarrerasService) {}

  async handle(data: UpdateCarreraJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.codigo !== undefined && { codigo: updateData.codigo }),
      ...(updateData.nombre !== undefined && { nombre: updateData.nombre }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.carrerasService.update(id, updateDto);
  }
}

@Injectable()
export class DeleteCarreraHandler implements JobHandler<DeleteCarreraJobData> {
  constructor(private readonly carrerasService: CarrerasService) {}

  async handle(data: DeleteCarreraJobData) {
    return await this.carrerasService.remove(data.id);
  }
}
