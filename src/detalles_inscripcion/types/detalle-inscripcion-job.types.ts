export enum DetalleInscripcionJobType {
  CREATE = 'CREATE_DETALLE_INSCRIPCION',
  FIND_ALL = 'FIND_ALL_DETALLE_INSCRIPCION',
  FIND_ONE = 'FIND_ONE_DETALLE_INSCRIPCION',
  UPDATE = 'UPDATE_DETALLE_INSCRIPCION',
  DELETE = 'DELETE_DETALLE_INSCRIPCION',
}

export interface CreateDetalleInscripcionJobData {
  fichaInscripcionId: string;
  tipo: string;
  estaActivo?: boolean;
}

export interface FindAllDetalleInscripcionJobData {
  page?: number;
  limit?: number;
}

export interface FindOneDetalleInscripcionJobData {
  id: string;
}

export interface UpdateDetalleInscripcionJobData {
  id: string;
  fichaInscripcionId?: string;
  tipo?: string;
  estaActivo?: boolean;
}

export interface DeleteDetalleInscripcionJobData {
  id: string;
}

export type DetalleInscripcionJobData =
  | CreateDetalleInscripcionJobData
  | FindAllDetalleInscripcionJobData
  | FindOneDetalleInscripcionJobData
  | UpdateDetalleInscripcionJobData
  | DeleteDetalleInscripcionJobData;
