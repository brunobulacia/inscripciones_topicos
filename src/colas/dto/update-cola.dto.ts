import { PartialType } from '@nestjs/mapped-types';
import { BaseColaDto } from './create-cola.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateColaDto extends PartialType(BaseColaDto) {
  @IsBoolean()
  @IsOptional()
  estaActiva?: boolean;
}
