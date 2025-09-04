import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { AvanceAcademicoService } from '../../avance_academico.service';
import {
  CreateAvanceAcademicoJobData,
  UpdateAvanceAcademicoJobData,
  FindOneAvanceAcademicoJobData,
  DeleteAvanceAcademicoJobData,
  FindAllAvanceAcademicoJobData,
} from '../../types/avance-academico-job.types';

@Injectable()
export class CreateAvanceAcademicoHandler
  implements JobHandler<CreateAvanceAcademicoJobData>
{
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  async handle(data: CreateAvanceAcademicoJobData) {
    try {
      const result = await this.avanceAcademicoService.create(data);
      return {
        success: true,
        data: result,
        message: 'Avance académico creado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'El avance académico ya existe',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllAvanceAcademicoHandler
  implements JobHandler<FindAllAvanceAcademicoJobData>
{
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  async handle(data: FindAllAvanceAcademicoJobData) {
    const result = await this.avanceAcademicoService.findAll();
    return {
      success: true,
      data: result,
      message: 'Avances académicos obtenidos exitosamente',
    };
  }
}

@Injectable()
export class FindOneAvanceAcademicoHandler
  implements JobHandler<FindOneAvanceAcademicoJobData>
{
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  async handle(data: FindOneAvanceAcademicoJobData) {
    const result = await this.avanceAcademicoService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Avance académico obtenido exitosamente',
    };
  }
}

@Injectable()
export class UpdateAvanceAcademicoHandler
  implements JobHandler<UpdateAvanceAcademicoJobData>
{
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  async handle(data: UpdateAvanceAcademicoJobData) {
    try {
      const { id, ...updateData } = data;
      const result = await this.avanceAcademicoService.update(id, updateData);
      return {
        success: true,
        data: result,
        message: 'Avance académico actualizado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Violación de restricción única',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Avance académico no encontrado',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteAvanceAcademicoHandler
  implements JobHandler<DeleteAvanceAcademicoJobData>
{
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  async handle(data: DeleteAvanceAcademicoJobData) {
    try {
      const result = await this.avanceAcademicoService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Avance académico eliminado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Avance académico no encontrado',
        };
      }
      throw error;
    }
  }
}
