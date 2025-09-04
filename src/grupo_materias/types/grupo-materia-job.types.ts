export enum GrupoMateriaJobType {
  CREATE = 'CREATE_GRUPO_MATERIA',
  FIND_ALL = 'FIND_ALL_GRUPO_MATERIA',
  FIND_ONE = 'FIND_ONE_GRUPO_MATERIA',
  UPDATE = 'UPDATE_GRUPO_MATERIA',
  DELETE = 'DELETE_GRUPO_MATERIA',
}

export interface CreateGrupoMateriaJobData {
  grupo: string;
  inscritos?: number;
  cupos?: number;
  materiaId: string;
  docenteId: string;
  periodoId: string;
  estaActivo?: boolean;
}

export interface FindAllGrupoMateriaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneGrupoMateriaJobData {
  id: string;
}

export interface UpdateGrupoMateriaJobData {
  id: string;
  grupo?: string;
  inscritos?: number;
  cupos?: number;
  materiaId?: string;
  docenteId?: string;
  periodoId?: string;
  estaActivo?: boolean;
}

export interface DeleteGrupoMateriaJobData {
  id: string;
}
