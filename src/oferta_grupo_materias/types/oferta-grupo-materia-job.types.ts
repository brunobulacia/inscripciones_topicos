export enum OfertaGrupoMateriaJobType {
  CREATE = 'CREATE_OFERTA_GRUPO_MATERIA',
  FIND_ALL = 'FIND_ALL_OFERTA_GRUPO_MATERIA',
  FIND_ONE = 'FIND_ONE_OFERTA_GRUPO_MATERIA',
  UPDATE = 'UPDATE_OFERTA_GRUPO_MATERIA',
  DELETE = 'DELETE_OFERTA_GRUPO_MATERIA',
}

export interface CreateOfertaGrupoMateriaJobData {
  grupoMateriaId: string;
  maestroDeOfertaId: string;
  estaActivo?: boolean;
}

export interface FindAllOfertaGrupoMateriaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneOfertaGrupoMateriaJobData {
  id: string;
}

export interface UpdateOfertaGrupoMateriaJobData {
  id: string;
  grupoMateriaId?: string;
  maestroDeOfertaId?: string;
  estaActivo?: boolean;
}

export interface DeleteOfertaGrupoMateriaJobData {
  id: string;
}

export type OfertaGrupoMateriaJobData =
  | CreateOfertaGrupoMateriaJobData
  | FindAllOfertaGrupoMateriaJobData
  | FindOneOfertaGrupoMateriaJobData
  | UpdateOfertaGrupoMateriaJobData
  | DeleteOfertaGrupoMateriaJobData;
