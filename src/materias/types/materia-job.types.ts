export enum MateriaJobType {
  CREATE = 'CREATE_MATERIA',
  FIND_ALL = 'FIND_ALL_MATERIA',
  FIND_ONE = 'FIND_ONE_MATERIA',
  UPDATE = 'UPDATE_MATERIA',
  DELETE = 'DELETE_MATERIA',
}

export interface CreateMateriaJobData {
  sigla: string;
  nombre: string;
  creditos: number;
  esElectiva?: boolean;
  estaActiva?: boolean;
  nivelId: string;
  planDeEstudioId: string;
}

export interface FindAllMateriaJobData {
  page?: number;
  limit?: number;
}

export interface FindOneMateriaJobData {
  id: string;
}

export interface UpdateMateriaJobData {
  id: string;
  sigla?: string;
  nombre?: string;
  creditos?: number;
  esElectiva?: boolean;
  estaActiva?: boolean;
  nivelId?: string;
  planDeEstudioId?: string;
}

export interface DeleteMateriaJobData {
  id: string;
}
