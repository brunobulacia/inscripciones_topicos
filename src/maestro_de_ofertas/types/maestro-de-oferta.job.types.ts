export enum MaestroDeOfertaJobType {
  CREATE = 'CREATE_MAESTRO_DE_OFERTA',
  FIND_ALL = 'FIND_ALL_MAESTRO_DE_OFERTA',
  FIND_ONE = 'FIND_ONE_MAESTRO_DE_OFERTA',
  UPDATE = 'UPDATE_MAESTRO_DE_OFERTA',
  DELETE = 'DELETE_MAESTRO_DE_OFERTA',
}

export interface CreateMaestroDeOfertaJobData {
  periodoId: string;
  estudianteId: string;
}

export interface FindAllMaestroDeOfertaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneMaestroDeOfertaJobData {
  id: string;
}

export interface UpdateMaestroDeOfertaJobData {
  id: string;
  periodoId?: string;
  estudianteId?: string;
}

export interface DeleteMaestroDeOfertaJobData {
  id: string;
}

export type MaestroDeOfertaJobData =
  | CreateMaestroDeOfertaJobData
  | FindAllMaestroDeOfertaJobData
  | FindOneMaestroDeOfertaJobData
  | UpdateMaestroDeOfertaJobData
  | DeleteMaestroDeOfertaJobData;
