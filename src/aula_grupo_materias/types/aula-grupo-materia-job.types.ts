export enum AulaGrupoMateriaJobType {
  CREATE = 'CREATE_AULA_GRUPO_MATERIA',
  FIND_ALL = 'FIND_ALL_AULA_GRUPO_MATERIA',
  FIND_ONE = 'FIND_ONE_AULA_GRUPO_MATERIA',
  UPDATE = 'UPDATE_AULA_GRUPO_MATERIA',
  DELETE = 'DELETE_AULA_GRUPO_MATERIA',
}

export interface CreateAulaGrupoMateriaJobData {
  grupoMateriaId: string;
  aulaId: string;
  estaActivo?: boolean;
}

export interface FindAllAulaGrupoMateriaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneAulaGrupoMateriaJobData {
  id: string;
}

export interface UpdateAulaGrupoMateriaJobData {
  id: string;
  grupoMateriaId?: string;
  aulaId?: string;
  estaActivo?: boolean;
}

export interface DeleteAulaGrupoMateriaJobData {
  id: string;
}
