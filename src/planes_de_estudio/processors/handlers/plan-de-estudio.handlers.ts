import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { PlanesDeEstudioService } from '../../planes_de_estudio.service';
import {
  CreatePlanDeEstudioJobData,
  UpdatePlanDeEstudioJobData,
  FindOnePlanDeEstudioJobData,
  DeletePlanDeEstudioJobData,
} from '../../types/plan-de-estudio-job.types';

@Injectable()
export class CreatePlanDeEstudioHandler
  implements JobHandler<CreatePlanDeEstudioJobData>
{
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  async handle(data: CreatePlanDeEstudioJobData) {
    try {
      const createDto = {
        version: data.version,
        carreraId: data.carreraId,
        estaActivo: data.estaActivo ?? true,
      };
      return await this.planesDeEstudioService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un plan de estudio con la versión ${data.version} para esta carrera`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllPlanesDeEstudioHandler implements JobHandler<null> {
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  async handle(_data: null) {
    return await this.planesDeEstudioService.findAll();
  }
}

@Injectable()
export class FindOnePlanDeEstudioHandler
  implements JobHandler<FindOnePlanDeEstudioJobData>
{
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  async handle(data: FindOnePlanDeEstudioJobData) {
    return await this.planesDeEstudioService.findOne(data.id);
  }
}

@Injectable()
export class UpdatePlanDeEstudioHandler
  implements JobHandler<UpdatePlanDeEstudioJobData>
{
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  async handle(data: UpdatePlanDeEstudioJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.version !== undefined && { version: updateData.version }),
      ...(updateData.carreraId !== undefined && {
        carreraId: updateData.carreraId,
      }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.planesDeEstudioService.update(id, updateDto);
  }
}

@Injectable()
export class DeletePlanDeEstudioHandler
  implements JobHandler<DeletePlanDeEstudioJobData>
{
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  async handle(data: DeletePlanDeEstudioJobData) {
    return await this.planesDeEstudioService.remove(data.id);
  }
}
