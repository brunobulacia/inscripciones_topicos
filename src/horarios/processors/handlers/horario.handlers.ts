import { Injectable } from '@nestjs/common';
import { HorariosService } from '../../horarios.service';
import { JobHandler } from '../../../common/types/generic-job.types';
import {
  CreateHorarioJobData,
  FindAllHorarioJobData,
  FindOneHorarioJobData,
  UpdateHorarioJobData,
  DeleteHorarioJobData,
} from '../../types/horario-job.types';

@Injectable()
export class CreateHorarioHandler implements JobHandler<CreateHorarioJobData> {
  constructor(private readonly horarioService: HorariosService) {}

  async handle(data: CreateHorarioJobData) {
    try {
      return await this.horarioService.create(data);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(
          `Ya existe un horario para esta aula-grupo-materia en el día ${data.diaSemana} a las ${data.horaInicio}`,
        );
      }
      if (error.code === 'P2003') {
        throw new Error('La aula-grupo-materia especificada no existe');
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllHorariosHandler
  implements JobHandler<FindAllHorarioJobData>
{
  constructor(private readonly horarioService: HorariosService) {}

  async handle(data?: FindAllHorarioJobData) {
    try {
      if (data?.aulaGrupoMateriaId) {
        return await this.horarioService.findByAulaGrupoMateria(
          data.aulaGrupoMateriaId,
        );
      }
      // Para el findAll básico usamos el método existente
      return await this.horarioService.findAll();
    } catch (error: any) {
      throw error;
    }
  }
}

@Injectable()
export class FindOneHorarioHandler
  implements JobHandler<FindOneHorarioJobData>
{
  constructor(private readonly horarioService: HorariosService) {}

  async handle(data: FindOneHorarioJobData) {
    try {
      return await this.horarioService.findOne(data.id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error(`Horario con ID ${data.id} no encontrado`);
      }
      throw error;
    }
  }
}

@Injectable()
export class UpdateHorarioHandler implements JobHandler<UpdateHorarioJobData> {
  constructor(private readonly horarioService: HorariosService) {}

  async handle(data: UpdateHorarioJobData) {
    try {
      const { id, ...updateData } = data;
      return await this.horarioService.update(id, updateData);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(
          `Ya existe un horario para esta aula-grupo-materia en el día ${data.diaSemana} a las ${data.horaInicio}`,
        );
      }
      if (error.code === 'P2003') {
        throw new Error('La aula-grupo-materia especificada no existe');
      }
      if (error.code === 'P2025') {
        throw new Error(`Horario con ID ${data.id} no encontrado`);
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteHorarioHandler implements JobHandler<DeleteHorarioJobData> {
  constructor(private readonly horarioService: HorariosService) {}

  async handle(data: DeleteHorarioJobData) {
    try {
      return await this.horarioService.remove(data.id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error(`Horario con ID ${data.id} no encontrado`);
      }
      throw error;
    }
  }
}
