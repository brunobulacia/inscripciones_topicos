import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsArray,
  IsNumber,
  Min,
  ArrayNotEmpty,
} from 'class-validator';

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
}
