export enum FichaInscripcionJobType {
  CREATE = 'CREATE_FICHA_INSCRIPCION',
  FIND_ALL = 'FIND_ALL_FICHA_INSCRIPCION',
  FIND_ONE = 'FIND_ONE_FICHA_INSCRIPCION',
  UPDATE = 'UPDATE_FICHA_INSCRIPCION',
  DELETE = 'DELETE_FICHA_INSCRIPCION',
}

export interface CreateFichaInscripcionJobData {
  estudianteId: string;
  estaActivo?: boolean;
}

export interface FindAllFichaInscripcionJobData {
  page?: number;
  limit?: number;
}

export interface FindOneFichaInscripcionJobData {
  id: string;
}

export interface UpdateFichaInscripcionJobData {
  id: string;
  estudianteId?: string;
  estaActivo?: boolean;
}

export interface DeleteFichaInscripcionJobData {
  id: string;
}

export type FichaInscripcionJobData =
  | CreateFichaInscripcionJobData
  | FindAllFichaInscripcionJobData
  | FindOneFichaInscripcionJobData
  | UpdateFichaInscripcionJobData
  | DeleteFichaInscripcionJobData;
