import { IsString, IsNotEmpty, IsUUID, IsIn, IsOptional } from 'class-validator';

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string; // ej: "/api/carreras"

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string; // ej: "GET", "POST", etc.

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  @IsNotEmpty()
  colaId: string;
}