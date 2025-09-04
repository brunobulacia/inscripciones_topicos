export enum BoletaGrupoMateriaJobType {
  CREATE = 'CREATE_BOLETA_GRUPO_MATERIA',
  FIND_ALL = 'FIND_ALL_BOLETA_GRUPO_MATERIA',
  FIND_ONE = 'FIND_ONE_BOLETA_GRUPO_MATERIA',
  UPDATE = 'UPDATE_BOLETA_GRUPO_MATERIA',
  DELETE = 'DELETE_BOLETA_GRUPO_MATERIA',
}

export interface CreateBoletaGrupoMateriaJobData {
  boletaInscripcionId: string;
  grupoMateriaId: string;
  nota?: number | null;
  estaActivo?: boolean;
}

export interface FindAllBoletaGrupoMateriaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneBoletaGrupoMateriaJobData {
  id: string;
}

export interface UpdateBoletaGrupoMateriaJobData {
  id: string;
  boletaInscripcionId?: string;
  grupoMateriaId?: string;
  nota?: number | null;
  estaActivo?: boolean;
}

export interface DeleteBoletaGrupoMateriaJobData {
  id: string;
}

export type BoletaGrupoMateriaJobData =
  | CreateBoletaGrupoMateriaJobData
  | FindAllBoletaGrupoMateriaJobData
  | FindOneBoletaGrupoMateriaJobData
  | UpdateBoletaGrupoMateriaJobData
  | DeleteBoletaGrupoMateriaJobData;
