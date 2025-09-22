import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string; // ej: "/api/carreras"

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string; // ej: "GET", "POST", etc.
}

export class AssignEndpointToColaDto {
  @IsUUID()
  @IsNotEmpty()
  endpointId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  prioridad?: number = 1;
}

export class CreateAndAssignEndpointDto {
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  prioridad?: number = 1;
}
