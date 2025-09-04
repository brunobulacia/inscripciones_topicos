export enum BoletaInscripcionJobType {
  CREATE = 'CREATE_BOLETA_INSCRIPCION',
  FIND_ALL = 'FIND_ALL_BOLETA_INSCRIPCION',
  FIND_ONE = 'FIND_ONE_BOLETA_INSCRIPCION',
  UPDATE = 'UPDATE_BOLETA_INSCRIPCION',
  DELETE = 'DELETE_BOLETA_INSCRIPCION',
}

export interface CreateBoletaInscripcionJobData {
  estudianteId: string;
  avanceAcademicoId: string;
  estaActivo?: boolean;
}

export interface FindAllBoletaInscripcionJobData {
  page?: number;
  limit?: number;
}

export interface FindOneBoletaInscripcionJobData {
  id: string;
}

export interface UpdateBoletaInscripcionJobData {
  id: string;
  estudianteId?: string;
  avanceAcademicoId?: string;
  estaActivo?: boolean;
}

export interface DeleteBoletaInscripcionJobData {
  id: string;
}

export type BoletaInscripcionJobData =
  | CreateBoletaInscripcionJobData
  | FindAllBoletaInscripcionJobData
  | FindOneBoletaInscripcionJobData
  | UpdateBoletaInscripcionJobData
  | DeleteBoletaInscripcionJobData;
