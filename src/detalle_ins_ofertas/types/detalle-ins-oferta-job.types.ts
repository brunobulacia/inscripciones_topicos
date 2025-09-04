export enum DetalleInsOfertaJobType {
  CREATE = 'CREATE_DETALLE_INS_OFERTA',
  FIND_ALL = 'FIND_ALL_DETALLE_INS_OFERTA',
  FIND_ONE = 'FIND_ONE_DETALLE_INS_OFERTA',
  UPDATE = 'UPDATE_DETALLE_INS_OFERTA',
  DELETE = 'DELETE_DETALLE_INS_OFERTA',
}

export interface CreateDetalleInsOfertaJobData {
  detalleInscripcionId: string;
  ofertaGrupoMateriaId: string;
  estado: string;
  estaActivo?: boolean;
}

export interface FindAllDetalleInsOfertaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneDetalleInsOfertaJobData {
  id: string;
}

export interface UpdateDetalleInsOfertaJobData {
  id: string;
  detalleInscripcionId?: string;
  ofertaGrupoMateriaId?: string;
  estado?: string;
  estaActivo?: boolean;
}

export interface DeleteDetalleInsOfertaJobData {
  id: string;
}

export type DetalleInsOfertaJobData =
  | CreateDetalleInsOfertaJobData
  | FindAllDetalleInsOfertaJobData
  | FindOneDetalleInsOfertaJobData
  | UpdateDetalleInsOfertaJobData
  | DeleteDetalleInsOfertaJobData;
