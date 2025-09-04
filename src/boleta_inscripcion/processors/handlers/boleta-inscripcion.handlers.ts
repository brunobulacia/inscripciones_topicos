import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { BoletaInscripcionService } from '../../boleta_inscripcion.service';
import {
  CreateBoletaInscripcionJobData,
  UpdateBoletaInscripcionJobData,
  FindOneBoletaInscripcionJobData,
  DeleteBoletaInscripcionJobData,
  FindAllBoletaInscripcionJobData,
} from '../../types/boleta-inscripcion-job.types';

@Injectable()
export class CreateBoletaInscripcionHandler
  implements JobHandler<CreateBoletaInscripcionJobData>
{
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  async handle(data: CreateBoletaInscripcionJobData) {
    try {
      const result = await this.boletaInscripcionService.create(data);
      return {
        success: true,
        data: result,
        message: 'Boleta de inscripción creada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'La boleta de inscripción ya existe',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error:
            'Referencia inválida - estudiante o avance académico no encontrado',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllBoletaInscripcionHandler
  implements JobHandler<FindAllBoletaInscripcionJobData>
{
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  async handle(data: FindAllBoletaInscripcionJobData) {
    const result = await this.boletaInscripcionService.findAll();
    return {
      success: true,
      data: result,
      message: 'Boletas de inscripción obtenidas exitosamente',
    };
  }
}

@Injectable()
export class FindOneBoletaInscripcionHandler
  implements JobHandler<FindOneBoletaInscripcionJobData>
{
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  async handle(data: FindOneBoletaInscripcionJobData) {
    const result = await this.boletaInscripcionService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Boleta de inscripción obtenida exitosamente',
    };
  }
}

@Injectable()
export class UpdateBoletaInscripcionHandler
  implements JobHandler<UpdateBoletaInscripcionJobData>
{
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  async handle(data: UpdateBoletaInscripcionJobData) {
    try {
      const { id, ...updateData } = data;
      const result = await this.boletaInscripcionService.update(id, updateData);
      return {
        success: true,
        data: result,
        message: 'Boleta de inscripción actualizada exitosamente',
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
          error:
            'Referencia inválida - estudiante o avance académico no encontrado',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Boleta de inscripción no encontrada',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteBoletaInscripcionHandler
  implements JobHandler<DeleteBoletaInscripcionJobData>
{
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  async handle(data: DeleteBoletaInscripcionJobData) {
    try {
      const result = await this.boletaInscripcionService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Boleta de inscripción eliminada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Boleta de inscripción no encontrada',
        };
      }
      throw error;
    }
  }
}
