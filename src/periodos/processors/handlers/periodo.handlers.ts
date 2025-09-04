import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { PeriodosService } from '../../periodos.service';
import {
  CreatePeriodoJobData,
  UpdatePeriodoJobData,
  FindOnePeriodoJobData,
  DeletePeriodoJobData,
} from '../../types/periodo-job.types';

@Injectable()
export class CreatePeriodoHandler implements JobHandler<CreatePeriodoJobData> {
  constructor(private readonly periodosService: PeriodosService) {}

  async handle(data: CreatePeriodoJobData) {
    try {
      const createDto = {
        numero: data.numero,
        gestionId: data.gestionId,
      };
      return await this.periodosService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un período con el número ${data.numero} para esta gestión`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllPeriodosHandler implements JobHandler<null> {
  constructor(private readonly periodosService: PeriodosService) {}

  async handle(_data: null) {
    return await this.periodosService.findAll();
  }
}

@Injectable()
export class FindOnePeriodoHandler
  implements JobHandler<FindOnePeriodoJobData>
{
  constructor(private readonly periodosService: PeriodosService) {}

  async handle(data: FindOnePeriodoJobData) {
    return await this.periodosService.findOne(data.id);
  }
}

@Injectable()
export class UpdatePeriodoHandler implements JobHandler<UpdatePeriodoJobData> {
  constructor(private readonly periodosService: PeriodosService) {}

  async handle(data: UpdatePeriodoJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.numero !== undefined && { numero: updateData.numero }),
      ...(updateData.gestionId !== undefined && {
        gestionId: updateData.gestionId,
      }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.periodosService.update(id, updateDto);
  }
}

@Injectable()
export class DeletePeriodoHandler implements JobHandler<DeletePeriodoJobData> {
  constructor(private readonly periodosService: PeriodosService) {}

  async handle(data: DeletePeriodoJobData) {
    return await this.periodosService.remove(data.id);
  }
}
