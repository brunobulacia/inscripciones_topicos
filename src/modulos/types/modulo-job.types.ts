import { BaseJobResult } from '../../common/types/queue.types';

export enum ModuloJobType {
  CREATE = 'CREATE_MODULO',
  FIND_ALL = 'FIND_ALL_MODULOS',
  FIND_ONE = 'FIND_ONE_MODULO',
  UPDATE = 'UPDATE_MODULO',
  DELETE = 'DELETE_MODULO',
}

export interface CreateModuloJobData {
  numero: number;
  estaActivo?: boolean;
}

export interface FindOneModuloJobData {
  id: string;
}

export interface UpdateModuloJobData {
  id: string;
  numero?: number;
  estaActivo?: boolean;
}

export interface DeleteModuloJobData {
  id: string;
}

export interface CreateModuloJobResult extends BaseJobResult {
  data?: any;
}

export interface FindAllModulosJobResult extends BaseJobResult {
  data?: any[];
}

export interface FindOneModuloJobResult extends BaseJobResult {
  data?: any;
}

export interface UpdateModuloJobResult extends BaseJobResult {
  data?: any;
}

export interface DeleteModuloJobResult extends BaseJobResult {
  data?: any;
}
