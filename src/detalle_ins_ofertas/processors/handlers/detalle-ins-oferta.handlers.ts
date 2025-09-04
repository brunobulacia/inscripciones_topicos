import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../../common/types/generic-job.types';
import { DetalleInsOfertasService } from '../../detalle_ins_ofertas.service';
import {
  CreateDetalleInsOfertaJobData,
  UpdateDetalleInsOfertaJobData,
  FindOneDetalleInsOfertaJobData,
  DeleteDetalleInsOfertaJobData,
  FindAllDetalleInsOfertaJobData,
} from '../../types/detalle-ins-oferta-job.types';

@Injectable()
export class CreateDetalleInsOfertaHandler
  implements JobHandler<CreateDetalleInsOfertaJobData>
{
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  async handle(data: CreateDetalleInsOfertaJobData) {
    try {
      const result = await this.detalleInsOfertasService.create(data);
      return {
        success: true,
        data: result,
        message: 'Detalle ins oferta creado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'El detalle ins oferta ya existe con esa combinación única',
          details: error.meta,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error:
            'Referencia inválida - detalle inscripción u oferta grupo materia no encontrado',
          details: error.meta,
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllDetalleInsOfertaHandler
  implements JobHandler<FindAllDetalleInsOfertaJobData>
{
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  async handle(data: FindAllDetalleInsOfertaJobData) {
    const result = await this.detalleInsOfertasService.findAll();
    return {
      success: true,
      data: result,
      message: 'Detalles ins oferta obtenidos exitosamente',
    };
  }
}

@Injectable()
export class FindOneDetalleInsOfertaHandler
  implements JobHandler<FindOneDetalleInsOfertaJobData>
{
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  async handle(data: FindOneDetalleInsOfertaJobData) {
    const result = await this.detalleInsOfertasService.findOne(data.id);
    return {
      success: true,
      data: result,
      message: 'Detalle ins oferta obtenido exitosamente',
    };
  }
}

@Injectable()
export class UpdateDetalleInsOfertaHandler
  implements JobHandler<UpdateDetalleInsOfertaJobData>
{
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  async handle(data: UpdateDetalleInsOfertaJobData) {
    try {
      const { id, ...updateData } = data;
      const result = await this.detalleInsOfertasService.update(id, updateData);
      return {
        success: true,
        data: result,
        message: 'Detalle ins oferta actualizado exitosamente',
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
            'Referencia inválida - detalle inscripción u oferta grupo materia no encontrado',
          details: error.meta,
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Detalle ins oferta no encontrado',
        };
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteDetalleInsOfertaHandler
  implements JobHandler<DeleteDetalleInsOfertaJobData>
{
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  async handle(data: DeleteDetalleInsOfertaJobData) {
    try {
      const result = await this.detalleInsOfertasService.remove(data.id);
      return {
        success: true,
        data: result,
        message: 'Detalle ins oferta eliminado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Detalle ins oferta no encontrado',
        };
      }
      throw error;
    }
  }
}
