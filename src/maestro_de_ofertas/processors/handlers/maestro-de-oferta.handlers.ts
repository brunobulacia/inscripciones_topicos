import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { MaestroDeOfertasService } from '../../maestro_de_ofertas.service';
import {
  CreateMaestroDeOfertaJobData,
  UpdateMaestroDeOfertaJobData,
  DeleteMaestroDeOfertaJobData,
  FindAllMaestroDeOfertaJobData,
  FindOneMaestroDeOfertaJobData,
} from '../../types/maestro-de-oferta.job.types';

@Injectable()
export class CreateMaestroDeOfertaHandler
  implements JobHandler<CreateMaestroDeOfertaJobData>
{
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  async handle(data: CreateMaestroDeOfertaJobData) {
    try {
      // Validar datos requeridos
      if (!data) {
        throw new Error(
          'Los datos son requeridos para crear un maestro de oferta',
        );
      }

      if (!data.periodoId || !data.estudianteId) {
        throw new Error('El periodoId y estudianteId son requeridos');
      }

      // Validar que los IDs sean strings válidos (no vacíos)
      if (
        typeof data.periodoId !== 'string' ||
        data.periodoId.trim().length === 0
      ) {
        throw new Error('El periodoId debe ser un string válido');
      }

      if (
        typeof data.estudianteId !== 'string' ||
        data.estudianteId.trim().length === 0
      ) {
        throw new Error('El estudianteId debe ser un string válido');
      }

      const createDto = {
        periodoId: data.periodoId,
        estudianteId: data.estudianteId,
      };

      const result = await this.maestroDeOfertasService.create(createDto);
      return {
        success: true,
        data: result,
        message: 'Maestro de oferta creado exitosamente',
      };
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un maestro de oferta para este período y estudiante`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllMaestroDeOfertasHandler
  implements JobHandler<FindAllMaestroDeOfertaJobData>
{
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  async handle() {
    try {
      const result = await this.maestroDeOfertasService.findAll();
      return {
        success: true,
        data: result,
        message: 'Maestro de ofertas encontrados exitosamente',
      };
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class FindOneMaestroDeOfertaHandler
  implements JobHandler<FindOneMaestroDeOfertaJobData>
{
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  async handle(data: FindOneMaestroDeOfertaJobData) {
    try {
      // Validar datos requeridos
      if (!data) {
        throw new Error(
          'Los datos son requeridos para buscar un maestro de oferta',
        );
      }

      if (!data.id) {
        throw new Error('El ID es requerido para buscar un maestro de oferta');
      }

      // Validar que el ID sea un string válido (no vacío)
      if (typeof data.id !== 'string' || data.id.trim().length === 0) {
        throw new Error('El ID debe ser un string válido');
      }

      const result = await this.maestroDeOfertasService.findOne(data.id);
      return {
        success: true,
        data: result,
        message: 'Maestro de oferta encontrado exitosamente',
      };
    } catch (error) {
      // Si es un error de "no encontrado", mantener el mensaje original
      if (error.message?.includes('no encontrado')) {
        throw error;
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class UpdateMaestroDeOfertaHandler
  implements JobHandler<UpdateMaestroDeOfertaJobData>
{
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  async handle(data: UpdateMaestroDeOfertaJobData) {
    try {
      // Validar datos requeridos
      if (!data) {
        throw new Error(
          'Los datos son requeridos para actualizar un maestro de oferta',
        );
      }

      if (!data.id) {
        throw new Error(
          'El ID es requerido para actualizar un maestro de oferta',
        );
      }

      // Validar que el ID sea un string válido (no vacío)
      if (typeof data.id !== 'string' || data.id.trim().length === 0) {
        throw new Error('El ID debe ser un string válido');
      }

      // Validar que al menos un campo de actualización esté presente
      const { id, ...updateData } = data;
      if (Object.keys(updateData).length === 0) {
        throw new Error(
          'Se debe proporcionar al menos un campo para actualizar',
        );
      }

      // Construir el DTO de actualización solo con campos definidos
      const updateDto = {
        ...(updateData.periodoId !== undefined && {
          periodoId: updateData.periodoId,
        }),
        ...(updateData.estudianteId !== undefined && {
          estudianteId: updateData.estudianteId,
        }),
      };

      // Validar que los IDs sean strings válidos si se proporcionan
      if (
        updateData.periodoId !== undefined &&
        (typeof updateData.periodoId !== 'string' ||
          updateData.periodoId.trim().length === 0)
      ) {
        throw new Error('El periodoId debe ser un string válido');
      }

      if (
        updateData.estudianteId !== undefined &&
        (typeof updateData.estudianteId !== 'string' ||
          updateData.estudianteId.trim().length === 0)
      ) {
        throw new Error('El estudianteId debe ser un string válido');
      }

      const result = await this.maestroDeOfertasService.update(id, updateDto);
      return {
        success: true,
        data: result,
        message: 'Maestro de oferta actualizado exitosamente',
      };
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un maestro de oferta para este período y estudiante`,
        );
      }
      // Si es un error de "no encontrado", mantener el mensaje original
      if (error.message?.includes('no encontrado')) {
        throw error;
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class DeleteMaestroDeOfertaHandler
  implements JobHandler<DeleteMaestroDeOfertaJobData>
{
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  async handle(data: DeleteMaestroDeOfertaJobData) {
    try {
      // Validar datos requeridos
      if (!data) {
        throw new Error(
          'Los datos son requeridos para eliminar un maestro de oferta',
        );
      }

      if (!data.id) {
        throw new Error(
          'El ID es requerido para eliminar un maestro de oferta',
        );
      }

      // Validar que el ID sea un string válido (no vacío)
      if (typeof data.id !== 'string' || data.id.trim().length === 0) {
        throw new Error('El ID debe ser un string válido');
      }

      const result = await this.maestroDeOfertasService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Maestro de oferta eliminado exitosamente',
      };
    } catch (error) {
      // Si es un error de "no encontrado", mantener el mensaje original
      if (error.message?.includes('no encontrado')) {
        throw error;
      }
      // Si hay relaciones dependientes, proporcionar un mensaje más claro
      if (error.message?.includes('Foreign key constraint failed')) {
        throw new Error(
          'No se puede eliminar el maestro de oferta porque tiene registros relacionados',
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}
