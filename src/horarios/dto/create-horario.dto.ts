import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHorarioDto {
  @IsString()
  @IsNotEmpty()
  diaSemana: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  aulaGrupoMateriaId: string;
}
