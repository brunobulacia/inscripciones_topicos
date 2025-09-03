import { BaseJobResult } from '../../common/types/queue.types';

export enum NivelJobType {
  CREATE = 'CREATE_NIVEL',
  FIND_ALL = 'FIND_ALL_NIVELES',
  FIND_ONE = 'FIND_ONE_NIVEL',
  UPDATE = 'UPDATE_NIVEL',
  DELETE = 'DELETE_NIVEL',
}

export interface CreateNivelJobData {
  semestre: number;
  estaActivo?: boolean;
}

export interface FindOneNivelJobData {
  id: string;
}

export interface UpdateNivelJobData {
  id: string;
  semestre?: number;
  estaActivo?: boolean;
}

export interface DeleteNivelJobData {
  id: string;
}

export type NivelJobData =
  | CreateNivelJobData
  | FindOneNivelJobData
  | UpdateNivelJobData
  | DeleteNivelJobData
  | null; // para findAll

export interface NivelJobResult extends BaseJobResult {}
