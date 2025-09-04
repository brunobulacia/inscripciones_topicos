export enum EstudianteJobType {
  CREATE = 'CREATE_ESTUDIANTE',
  FIND_ALL = 'FIND_ALL_ESTUDIANTES',
  FIND_ONE = 'FIND_ONE_ESTUDIANTE',
  UPDATE = 'UPDATE_ESTUDIANTE',
  DELETE = 'DELETE_ESTUDIANTE',
}

export interface CreateEstudianteJobData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  ci: string;
  email: string;
  matricula: string;
  password: string;
  ppac?: number;
  avanceAcademicoId: string;
  estaActivo?: boolean;
}

export interface FindAllEstudiantesJobData {
  page?: number;
  limit?: number;
}

export interface FindOneEstudianteJobData {
  id: string;
}

export interface UpdateEstudianteJobData {
  id: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  ci?: string;
  email?: string;
  matricula?: string;
  password?: string;
  ppac?: number;
  avanceAcademicoId?: string;
  estaActivo?: boolean;
}

export interface DeleteEstudianteJobData {
  id: string;
}

export type EstudianteJobData =
  | CreateEstudianteJobData
  | FindAllEstudiantesJobData
  | FindOneEstudianteJobData
  | UpdateEstudianteJobData
  | DeleteEstudianteJobData;
