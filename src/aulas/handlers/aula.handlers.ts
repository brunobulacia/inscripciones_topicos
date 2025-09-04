import { Injectable } from '@nestjs/common';
import { JobHandler } from '../../common/types/generic-job.types';
import { AulasService } from '../aulas.service';
import {
  CreateAulaJobData,
  UpdateAulaJobData,
  FindOneAulaJobData,
  DeleteAulaJobData,
  AulaJobResult,
} from '../types/aula-job.types';

@Injectable()
export class CreateAulaHandler
  implements JobHandler<CreateAulaJobData, AulaJobResult>
{
  constructor(private readonly aulasService: AulasService) {}

  async handle(data: CreateAulaJobData): Promise<AulaJobResult> {
    return await this.aulasService.create(data);
  }
}

@Injectable()
export class FindAllAulasHandler
  implements JobHandler<Record<string, never>, AulaJobResult>
{
  constructor(private readonly aulasService: AulasService) {}

  async handle(): Promise<AulaJobResult> {
    return await this.aulasService.findAll();
  }
}

@Injectable()
export class FindOneAulaHandler
  implements JobHandler<FindOneAulaJobData, AulaJobResult>
{
  constructor(private readonly aulasService: AulasService) {}

  async handle(data: FindOneAulaJobData): Promise<AulaJobResult> {
    return await this.aulasService.findOne(data.id);
  }
}

@Injectable()
export class UpdateAulaHandler
  implements JobHandler<UpdateAulaJobData, AulaJobResult>
{
  constructor(private readonly aulasService: AulasService) {}

  async handle(data: UpdateAulaJobData): Promise<AulaJobResult> {
    return await this.aulasService.update(data.id, data.data);
  }
}

@Injectable()
export class DeleteAulaHandler
  implements JobHandler<DeleteAulaJobData, AulaJobResult>
{
  constructor(private readonly aulasService: AulasService) {}

  async handle(data: DeleteAulaJobData): Promise<AulaJobResult> {
    return await this.aulasService.remove(data.id);
  }
}
