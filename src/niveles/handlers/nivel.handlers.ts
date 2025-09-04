import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { NivelesService } from '../niveles.service';
import {
  CreateNivelJobData,
  FindOneNivelJobData,
  UpdateNivelJobData,
  DeleteNivelJobData,
} from '../types/nivel-job.types';

@Injectable()
export class CreateNivelHandler implements JobHandler<CreateNivelJobData> {
  constructor(private readonly nivelesService: NivelesService) {}

  async handle(data: CreateNivelJobData) {
    try {
      const createDto = {
        semestre: data.semestre,
        estaActivo: data.estaActivo ?? true, // Default value if not provided
      };
      return await this.nivelesService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un nivel con el semestre ${data.semestre}`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllNivelesHandler implements JobHandler<null> {
  constructor(private readonly nivelesService: NivelesService) {}

  async handle(_data: null) {
    return await this.nivelesService.findAll();
  }
}

@Injectable()
export class FindOneNivelHandler implements JobHandler<FindOneNivelJobData> {
  constructor(private readonly nivelesService: NivelesService) {}

  async handle(data: FindOneNivelJobData) {
    return await this.nivelesService.findOne(data.id);
  }
}

@Injectable()
export class UpdateNivelHandler implements JobHandler<UpdateNivelJobData> {
  constructor(private readonly nivelesService: NivelesService) {}

  async handle(data: UpdateNivelJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.semestre !== undefined && {
        semestre: updateData.semestre,
      }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.nivelesService.update(id, updateDto);
  }
}

@Injectable()
export class DeleteNivelHandler implements JobHandler<DeleteNivelJobData> {
  constructor(private readonly nivelesService: NivelesService) {}

  async handle(data: DeleteNivelJobData) {
    return await this.nivelesService.remove(data.id);
  }
}
