import { PartialType } from '@nestjs/mapped-types';
import { BaseColaDto, EndpointDto } from './create-cola.dto';
import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateColaDto extends PartialType(BaseColaDto) {
  @IsBoolean()
  @IsOptional()
  estaActiva?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @IsOptional()
  workers?: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EndpointDto)
  @IsOptional()
  endpoints?: EndpointDto[];
}
