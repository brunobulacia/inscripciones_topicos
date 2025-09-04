import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { EstudiantesService } from '../../estudiantes.service';
import {
  CreateEstudianteJobData,
  UpdateEstudianteJobData,
  FindOneEstudianteJobData,
  DeleteEstudianteJobData,
} from '../../types/estudiante-job.types';

@Injectable()
export class CreateEstudianteHandler
  implements JobHandler<CreateEstudianteJobData>
{
  constructor(private readonly estudiantesService: EstudiantesService) {}

  async handle(data: CreateEstudianteJobData) {
    try {
      const createDto = {
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        telefono: data.telefono,
        ci: data.ci,
        email: data.email,
        matricula: data.matricula,
        password: data.password,
        ppac: data.ppac ?? 0,
        avanceAcademicoId: data.avanceAcademicoId,
        estaActivo: data.estaActivo ?? true,
      };
      return await this.estudiantesService.create(createDto);
    } catch (error) {
      // Si es un error de constraint único, lanzarlo como error real para que falle el job
      if (error.message?.includes('Unique constraint failed')) {
        throw new Error(
          `Error de validación: Ya existe un estudiante con estos datos únicos (CI, email, teléfono o matrícula)`,
        );
      }
      // Otros errores se propagan como están
      throw error;
    }
  }
}

@Injectable()
export class FindAllEstudiantesHandler implements JobHandler<null> {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  async handle(_data: null) {
    // Usar valores por defecto para la paginación
    return await this.estudiantesService.findAll({ page: 0, limit: 100 });
  }
}

@Injectable()
export class FindOneEstudianteHandler
  implements JobHandler<FindOneEstudianteJobData>
{
  constructor(private readonly estudiantesService: EstudiantesService) {}

  async handle(data: FindOneEstudianteJobData) {
    return await this.estudiantesService.findOne(data.id);
  }
}

@Injectable()
export class UpdateEstudianteHandler
  implements JobHandler<UpdateEstudianteJobData>
{
  constructor(private readonly estudiantesService: EstudiantesService) {}

  async handle(data: UpdateEstudianteJobData) {
    const { id, ...updateData } = data;
    const updateDto = {
      ...(updateData.nombre !== undefined && { nombre: updateData.nombre }),
      ...(updateData.apellido_paterno !== undefined && {
        apellido_paterno: updateData.apellido_paterno,
      }),
      ...(updateData.apellido_materno !== undefined && {
        apellido_materno: updateData.apellido_materno,
      }),
      ...(updateData.telefono !== undefined && {
        telefono: updateData.telefono,
      }),
      ...(updateData.ci !== undefined && { ci: updateData.ci }),
      ...(updateData.email !== undefined && { email: updateData.email }),
      ...(updateData.matricula !== undefined && {
        matricula: updateData.matricula,
      }),
      ...(updateData.password !== undefined && {
        password: updateData.password,
      }),
      ...(updateData.ppac !== undefined && { ppac: updateData.ppac }),
      ...(updateData.avanceAcademicoId !== undefined && {
        avanceAcademicoId: updateData.avanceAcademicoId,
      }),
      ...(updateData.estaActivo !== undefined && {
        estaActivo: updateData.estaActivo,
      }),
    };
    return await this.estudiantesService.update(id, updateDto);
  }
}

@Injectable()
export class DeleteEstudianteHandler
  implements JobHandler<DeleteEstudianteJobData>
{
  constructor(private readonly estudiantesService: EstudiantesService) {}

  async handle(data: DeleteEstudianteJobData) {
    return await this.estudiantesService.remove(data.id);
  }
}
