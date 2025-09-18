import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateColaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}