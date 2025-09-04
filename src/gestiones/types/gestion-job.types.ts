import { BaseJobResult } from '../../common/types/queue.types';

export enum GestionJobType {
  CREATE = 'CREATE_GESTION',
  FIND_ALL = 'FIND_ALL_GESTIONES',
  FIND_ONE = 'FIND_ONE_GESTION',
  UPDATE = 'UPDATE_GESTION',
  DELETE = 'DELETE_GESTION',
}

export interface CreateGestionJobData {
  año: string;
  estaActivo?: boolean;
}

export interface FindOneGestionJobData {
  id: string;
}

export interface UpdateGestionJobData {
  id: string;
  año?: string;
  estaActivo?: boolean;
}

export interface DeleteGestionJobData {
  id: string;
}

export type GestionJobData =
  | CreateGestionJobData
  | FindOneGestionJobData
  | UpdateGestionJobData
  | DeleteGestionJobData
  | null; // para findAll

export interface GestionJobResult extends BaseJobResult {}
