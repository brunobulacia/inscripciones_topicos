import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { FichasInscripcionService } from '../../fichas_inscripcion.service';
import {
  CreateFichaInscripcionJobData,
  UpdateFichaInscripcionJobData,
  FindOneFichaInscripcionJobData,
  DeleteFichaInscripcionJobData,
  FindAllFichaInscripcionJobData,
} from '../../types/ficha-inscripcion-job.types';

@Injectable()
export class CreateFichaInscripcionHandler
  implements JobHandler<CreateFichaInscripcionJobData>
{
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  async handle(data: CreateFichaInscripcionJobData) {
    try {
      const result = await this.fichasInscripcionService.create(data);
      return {
        success: true,
        data: result,
        message: 'Ficha de inscripción creada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'La ficha de inscripción ya existe',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Referencia inválida - estudiante no encontrado',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllFichaInscripcionHandler
  implements JobHandler<FindAllFichaInscripcionJobData>
{
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  async handle(data: FindAllFichaInscripcionJobData) {
    const result = await this.fichasInscripcionService.findAll();
    return {
      success: true,
      data: result,
      message: 'Fichas de inscripción obtenidas exitosamente',
    };
  }
}

@Injectable()
export class FindOneFichaInscripcionHandler
  implements JobHandler<FindOneFichaInscripcionJobData>
{
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  async handle(data: FindOneFichaInscripcionJobData) {
    const result = await this.fichasInscripcionService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Ficha de inscripción obtenida exitosamente',
    };
  }
}

@Injectable()
export class UpdateFichaInscripcionHandler
  implements JobHandler<UpdateFichaInscripcionJobData>
{
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  async handle(data: UpdateFichaInscripcionJobData) {
    try {
      const { id, ...updateData } = data;
      const result = await this.fichasInscripcionService.update(id, updateData);
      return {
        success: true,
        data: result,
        message: 'Ficha de inscripción actualizada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Violación de restricción única',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Referencia inválida - estudiante no encontrado',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Ficha de inscripción no encontrada',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteFichaInscripcionHandler
  implements JobHandler<DeleteFichaInscripcionJobData>
{
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  async handle(data: DeleteFichaInscripcionJobData) {
    try {
      const result = await this.fichasInscripcionService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Ficha de inscripción eliminada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Ficha de inscripción no encontrada',
        };
      }
      throw error;
    }
  }
}
