import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { BoletaGrupoMateriasService } from '../../boleta_grupo_materias.service';
import {
  CreateBoletaGrupoMateriaJobData,
  UpdateBoletaGrupoMateriaJobData,
  FindOneBoletaGrupoMateriaJobData,
  DeleteBoletaGrupoMateriaJobData,
  FindAllBoletaGrupoMateriaJobData,
} from '../../types/boleta-grupo-materia-job.types';

@Injectable()
export class CreateBoletaGrupoMateriaHandler
  implements JobHandler<CreateBoletaGrupoMateriaJobData>
{
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  async handle(data: CreateBoletaGrupoMateriaJobData) {
    try {
      // Convertir undefined a null para que coincida con el DTO
      const dtoData = {
        ...data,
        nota: data.nota === undefined ? null : data.nota,
      };
      const result = await this.boletaGrupoMateriasService.create(dtoData);
      return {
        success: true,
        data: result,
        message: 'Boleta grupo materia creada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'La boleta grupo materia ya existe',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error:
            'Referencia inválida - boleta de inscripción o grupo materia no encontrado',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllBoletaGrupoMateriaHandler
  implements JobHandler<FindAllBoletaGrupoMateriaJobData>
{
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  async handle(data: FindAllBoletaGrupoMateriaJobData) {
    const result = await this.boletaGrupoMateriasService.findAll();
    return {
      success: true,
      data: result,
      message: 'Boletas grupo materia obtenidas exitosamente',
    };
  }
}

@Injectable()
export class FindOneBoletaGrupoMateriaHandler
  implements JobHandler<FindOneBoletaGrupoMateriaJobData>
{
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  async handle(data: FindOneBoletaGrupoMateriaJobData) {
    const result = await this.boletaGrupoMateriasService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Boleta grupo materia obtenida exitosamente',
    };
  }
}

@Injectable()
export class UpdateBoletaGrupoMateriaHandler
  implements JobHandler<UpdateBoletaGrupoMateriaJobData>
{
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  async handle(data: UpdateBoletaGrupoMateriaJobData) {
    try {
      const { id, ...updateData } = data;
      // Convertir undefined a null para que coincida con el DTO
      const dtoData = {
        ...updateData,
        nota: updateData.nota === undefined ? null : updateData.nota,
      };
      const result = await this.boletaGrupoMateriasService.update(id, dtoData);
      return {
        success: true,
        data: result,
        message: 'Boleta grupo materia actualizada exitosamente',
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
            'Referencia inválida - boleta de inscripción o grupo materia no encontrado',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Boleta grupo materia no encontrada',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteBoletaGrupoMateriaHandler
  implements JobHandler<DeleteBoletaGrupoMateriaJobData>
{
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  async handle(data: DeleteBoletaGrupoMateriaJobData) {
    try {
      const result = await this.boletaGrupoMateriasService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Boleta grupo materia eliminada exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Boleta grupo materia no encontrada',
        };
      }
      throw error;
    }
  }
}
