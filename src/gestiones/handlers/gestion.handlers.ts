import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { GestionesService } from '../gestiones.service';
import {
  CreateGestionJobData,
  FindOneGestionJobData,
  UpdateGestionJobData,
  DeleteGestionJobData,
} from '../types/gestion-job.types';

@Injectable()
export class CreateGestionHandler implements JobHandler<CreateGestionJobData> {
  constructor(private readonly gestionesService: GestionesService) {}

  async handle(data: CreateGestionJobData) {
    try {
      const createDto = {
        año: data.año,
        estaActivo: data.estaActivo ?? true,
      };
      return await this.gestionesService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe una gestión para el año ${data.año}`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllGestionesHandler implements JobHandler<null> {
  constructor(private readonly gestionesService: GestionesService) {}

  async handle(_data: null) {
    return await this.gestionesService.findAll();
  }
}

@Injectable()
export class FindOneGestionHandler
  implements JobHandler<FindOneGestionJobData>
{
  constructor(private readonly gestionesService: GestionesService) {}

  async handle(data: FindOneGestionJobData) {
    return await this.gestionesService.findOne(data.id);
  }
}

@Injectable()
export class UpdateGestionHandler implements JobHandler<UpdateGestionJobData> {
  constructor(private readonly gestionesService: GestionesService) {}

  async handle(data: UpdateGestionJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.año !== undefined && { año: updateData.año }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.gestionesService.update(id, updateDto);
  }
}

@Injectable()
export class DeleteGestionHandler implements JobHandler<DeleteGestionJobData> {
  constructor(private readonly gestionesService: GestionesService) {}

  async handle(data: DeleteGestionJobData) {
    return await this.gestionesService.remove(data.id);
  }
}
