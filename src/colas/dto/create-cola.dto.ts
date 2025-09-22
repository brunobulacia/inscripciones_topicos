import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsArray,
  IsNumber,
  Min,
  ArrayNotEmpty,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  prioridad?: number = 1;
}

export class BaseColaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class CreateColaDto extends BaseColaDto {
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
