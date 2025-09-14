import { UpdateAulaDto } from '../dto/update-aula.dto';

export enum AulasJobType {
  CREATE = 'CREATE_AULA',
  FIND_ALL = 'FIND_ALL_AULAS',
  FIND_ONE = 'FIND_ONE_AULA',
  UPDATE = 'UPDATE_AULA',
  DELETE = 'DELETE_AULA',
}

export interface CreateAulaJobData {
  numero: number;
  capacidad: number;
  moduloId: string;
}

export interface UpdateAulaJobData {
  id: string;
  data: UpdateAulaDto;
}

export interface FindOneAulaJobData {
  id: string;
}

export interface DeleteAulaJobData {
  id: string;
}

export type AulaJobData =
  | CreateAulaJobData
  | UpdateAulaJobData
  | FindOneAulaJobData
  | DeleteAulaJobData
  | Record<string, never>; // Para find_all

export type AulaJobResult = any;
