export enum PeriodoJobType {
  CREATE = 'CREATE_PERIODO',
  FIND_ALL = 'FIND_ALL_PERIODOS',
  FIND_ONE = 'FIND_ONE_PERIODO',
  UPDATE = 'UPDATE_PERIODO',
  DELETE = 'DELETE_PERIODO',
}

export interface CreatePeriodoJobData {
  numero: number;
  gestionId: string;
}

export interface FindOnePeriodoJobData {
  id: string;
}

export interface UpdatePeriodoJobData {
  id: string;
  numero?: number;
  gestionId?: string;
  estaActivo?: boolean;
}

export interface DeletePeriodoJobData {
  id: string;
}

export type PeriodoJobData =
  | CreatePeriodoJobData
  | FindOnePeriodoJobData
  | UpdatePeriodoJobData
  | DeletePeriodoJobData;
