import { IsString, IsNotEmpty, IsUUID, IsIn, IsOptional } from 'class-validator';

export class AssignEndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class UnassignEndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string;
}