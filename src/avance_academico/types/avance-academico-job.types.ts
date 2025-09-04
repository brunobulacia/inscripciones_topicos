export enum AvanceAcademicoJobType {
  CREATE = 'CREATE_AVANCE_ACADEMICO',
  FIND_ALL = 'FIND_ALL_AVANCE_ACADEMICO',
  FIND_ONE = 'FIND_ONE_AVANCE_ACADEMICO',
  UPDATE = 'UPDATE_AVANCE_ACADEMICO',
  DELETE = 'DELETE_AVANCE_ACADEMICO',
}

export interface CreateAvanceAcademicoJobData {
  estudianteId: string;
}

export interface FindAllAvanceAcademicoJobData {
  page?: number;
  limit?: number;
}

export interface FindOneAvanceAcademicoJobData {
  id: string;
}

export interface UpdateAvanceAcademicoJobData {
  id: string;
  estaActivo?: boolean;
  estudianteId?: string;
}

export interface DeleteAvanceAcademicoJobData {
  id: string;
}

export type AvanceAcademicoJobData =
  | CreateAvanceAcademicoJobData
  | FindAllAvanceAcademicoJobData
  | FindOneAvanceAcademicoJobData
  | UpdateAvanceAcademicoJobData
  | DeleteAvanceAcademicoJobData;
