import { BaseJobResult } from '../../common/types/queue.types';

export enum CarreraJobType {
  CREATE = 'CREATE_CARRERA',
  FIND_ALL = 'FIND_ALL_CARRERAS',
  FIND_ONE = 'FIND_ONE_CARRERA',
  UPDATE = 'UPDATE_CARRERA',
  DELETE = 'DELETE_CARRERA',
}

export interface CreateCarreraJobData {
  codigo: number;
  nombre: string;
  estaActivo: boolean;
}

export interface FindOneCarreraJobData {
  id: string;
}

export interface UpdateCarreraJobData {
  id: string;
  codigo?: number;
  nombre?: string;
  estaActivo?: boolean;
}

export interface DeleteCarreraJobData {
  id: string;
}

export type CarreraJobData =
  | CreateCarreraJobData
  | FindOneCarreraJobData
  | UpdateCarreraJobData
  | DeleteCarreraJobData
  | null; // para findAll

export interface CarreraJobResult extends BaseJobResult {}
