import { PartialType } from '@nestjs/mapped-types';
import { CreateColaDto } from './create-cola.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateColaDto extends PartialType(CreateColaDto) {
  @IsBoolean()
  @IsOptional()
  estaActiva?: boolean;
}