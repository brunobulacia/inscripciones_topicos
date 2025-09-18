import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsBoolean()
  @IsOptional()
  estaActivo?: boolean;
}