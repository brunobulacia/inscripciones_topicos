export enum PrerequisitJobType {
  CREATE = 'CREATE_PREREQUISITO',
  FIND_ALL = 'FIND_ALL_PREREQUISITO',
  FIND_ONE = 'FIND_ONE_PREREQUISITO',
  UPDATE = 'UPDATE_PREREQUISITO',
  DELETE = 'DELETE_PREREQUISITO',
}

export interface CreatePrerequisitJobData {
  siglaMateria: string;
  siglaPrerequisito: string;
}

export interface FindOnePrerequisitJobData {
  id: string;
}

export interface UpdatePrerequisitJobData {
  id: string;
  siglaMateria?: string;
  siglaPrerequisito?: string;
  esActivo?: boolean;
}

export interface DeletePrerequisitJobData {
  id: string;
}

export interface FindAllPrerequisitJobData {
  page?: number;
  limit?: number;
}
