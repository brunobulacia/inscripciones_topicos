export enum HorarioJobType {
  CREATE = 'horario.create',
  FIND_ALL = 'horario.find_all',
  FIND_ONE = 'horario.find_one',
  UPDATE = 'horario.update',
  DELETE = 'horario.delete',
}

export interface CreateHorarioJobData {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aulaGrupoMateriaId: string;
  estaActivo?: boolean;
}

export interface FindAllHorarioJobData {
  aulaGrupoMateriaId?: string;
  diaSemana?: string;
  estaActivo?: boolean;
}

export interface FindOneHorarioJobData {
  id: string;
}

export interface UpdateHorarioJobData {
  id: string;
  diaSemana?: string;
  horaInicio?: string;
  horaFin?: string;
  aulaGrupoMateriaId?: string;
  estaActivo?: boolean;
}

export interface DeleteHorarioJobData {
  id: string;
}
