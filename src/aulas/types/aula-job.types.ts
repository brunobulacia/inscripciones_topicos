import { UpdateAulaDto } from '../dto/update-aula.dto';

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
