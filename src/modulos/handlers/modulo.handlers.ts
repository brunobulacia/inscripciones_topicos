import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { ModulosService } from '../modulos.service';
import {
  CreateModuloJobData,
  FindOneModuloJobData,
  UpdateModuloJobData,
  DeleteModuloJobData,
} from '../types/modulo-job.types';

@Injectable()
export class CreateModuloHandler implements JobHandler<CreateModuloJobData> {
  constructor(private readonly modulosService: ModulosService) {}

  async handle(data: CreateModuloJobData) {
    try {
      const createDto = {
        numero: data.numero,
        estaActivo: data.estaActivo ?? true,
      };
      return await this.modulosService.create(createDto);
    } catch (error) {
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un módulo con el número ${data.numero}`,
        );
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllModulosHandler implements JobHandler<null> {
  constructor(private readonly modulosService: ModulosService) {}

  async handle(_data: null) {
    return await this.modulosService.findAll();
  }
}

@Injectable()
export class FindOneModuloHandler implements JobHandler<FindOneModuloJobData> {
  constructor(private readonly modulosService: ModulosService) {}

  async handle(data: FindOneModuloJobData) {
    return await this.modulosService.findOne(data.id);
  }
}

@Injectable()
export class UpdateModuloHandler implements JobHandler<UpdateModuloJobData> {
  constructor(private readonly modulosService: ModulosService) {}

  async handle(data: UpdateModuloJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.numero !== undefined && { numero: updateData.numero }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.modulosService.update(id, updateDto);
  }
}

@Injectable()
export class DeleteModuloHandler implements JobHandler<DeleteModuloJobData> {
  constructor(private readonly modulosService: ModulosService) {}

  async handle(data: DeleteModuloJobData) {
    return await this.modulosService.remove(data.id);
  }
}
