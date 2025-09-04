import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { DetallesInscripcionService } from '../../detalles_inscripcion.service';
import {
  CreateDetalleInscripcionJobData,
  UpdateDetalleInscripcionJobData,
  FindOneDetalleInscripcionJobData,
  DeleteDetalleInscripcionJobData,
  FindAllDetalleInscripcionJobData,
} from '../../types/detalle-inscripcion-job.types';

@Injectable()
export class CreateDetalleInscripcionHandler
  implements JobHandler<CreateDetalleInscripcionJobData>
{
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
  ) {}

  async handle(data: CreateDetalleInscripcionJobData) {
    try {
      const result = await this.detallesInscripcionService.create(data);
      return {
        success: true,
        data: result,
        message: 'Detalle inscripción creado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'El detalle de inscripción ya existe',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Referencia inválida - ficha de inscripción no encontrada',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllDetalleInscripcionHandler
  implements JobHandler<FindAllDetalleInscripcionJobData>
{
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
  ) {}

  async handle(data: FindAllDetalleInscripcionJobData) {
    const result = await this.detallesInscripcionService.findAll();
    return {
      success: true,
      data: result,
      message: 'Detalles de inscripción obtenidos exitosamente',
    };
  }
}

@Injectable()
export class FindOneDetalleInscripcionHandler
  implements JobHandler<FindOneDetalleInscripcionJobData>
{
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
  ) {}

  async handle(data: FindOneDetalleInscripcionJobData) {
    const result = await this.detallesInscripcionService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Detalle de inscripción obtenido exitosamente',
    };
  }
}

@Injectable()
export class UpdateDetalleInscripcionHandler
  implements JobHandler<UpdateDetalleInscripcionJobData>
{
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
  ) {}

  async handle(data: UpdateDetalleInscripcionJobData) {
    try {
      const { id, ...updateData } = data;
      const result = await this.detallesInscripcionService.update(
        id,
        updateData,
      );
      return {
        success: true,
        data: result,
        message: 'Detalle de inscripción actualizado exitosamente',
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
          error: 'Referencia inválida - ficha de inscripción no encontrada',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Detalle de inscripción no encontrado',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteDetalleInscripcionHandler
  implements JobHandler<DeleteDetalleInscripcionJobData>
{
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
  ) {}

  async handle(data: DeleteDetalleInscripcionJobData) {
    try {
      const result = await this.detallesInscripcionService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Detalle de inscripción eliminado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Detalle de inscripción no encontrado',
        };
      }
      throw error;
    }
  }
}
