import { UpdateDocenteDto } from '../dto/update-docente.dto';

export enum DocenteJobName {
  CREATE = 'DOCENTES_CREATE',
  FIND_ALL = 'DOCENTES_FIND_ALL',
  FIND_ONE = 'DOCENTES_FIND_ONE',
  UPDATE = 'DOCENTES_UPDATE',
  DELETE = 'DOCENTES_DELETE',
}

export interface CreateDocenteJobData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  ci: string;
  registro: string;
  email: string;
  telefono: string;
  password: string;
}

export interface UpdateDocenteJobData {
  id: string;
  data: UpdateDocenteDto;
}

export interface FindOneDocenteJobData {
  id: string;
}

export interface DeleteDocenteJobData {
  id: string;
}

export type DocenteJobData =
  | CreateDocenteJobData
  | UpdateDocenteJobData
  | FindOneDocenteJobData
  | DeleteDocenteJobData
  | Record<string, never>; // Para find_all

export type DocenteJobResult = any;
