import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { DocentesService } from '../docentes.service';
import {
  CreateDocenteJobData,
  UpdateDocenteJobData,
  FindOneDocenteJobData,
  DeleteDocenteJobData,
  DocenteJobResult,
} from '../types/docente-job.types';

@Injectable()
export class CreateDocenteHandler
  implements JobHandler<CreateDocenteJobData, DocenteJobResult>
{
  constructor(private readonly docentesService: DocentesService) {}

  async handle(data: CreateDocenteJobData): Promise<DocenteJobResult> {
    return await this.docentesService.create(data);
  }
}

@Injectable()
export class FindAllDocentesHandler
  implements JobHandler<Record<string, never>, DocenteJobResult>
{
  constructor(private readonly docentesService: DocentesService) {}

  async handle(): Promise<DocenteJobResult> {
    return await this.docentesService.findAll();
  }
}

@Injectable()
export class FindOneDocenteHandler
  implements JobHandler<FindOneDocenteJobData, DocenteJobResult>
{
  constructor(private readonly docentesService: DocentesService) {}

  async handle(data: FindOneDocenteJobData): Promise<DocenteJobResult> {
    return await this.docentesService.findOne(data.id);
  }
}

@Injectable()
export class UpdateDocenteHandler
  implements JobHandler<UpdateDocenteJobData, DocenteJobResult>
{
  constructor(private readonly docentesService: DocentesService) {}

  async handle(data: UpdateDocenteJobData): Promise<DocenteJobResult> {
    return await this.docentesService.update(data.id, data.data);
  }
}

@Injectable()
export class DeleteDocenteHandler
  implements JobHandler<DeleteDocenteJobData, DocenteJobResult>
{
  constructor(private readonly docentesService: DocentesService) {}

  async handle(data: DeleteDocenteJobData): Promise<DocenteJobResult> {
    return await this.docentesService.remove(data.id);
  }
}
