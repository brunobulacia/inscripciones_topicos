export enum PlanDeEstudioJobType {
  CREATE = 'CREATE_PLAN_DE_ESTUDIO',
  FIND_ALL = 'FIND_ALL_PLANES_DE_ESTUDIO',
  FIND_ONE = 'FIND_ONE_PLAN_DE_ESTUDIO',
  UPDATE = 'UPDATE_PLAN_DE_ESTUDIO',
  DELETE = 'DELETE_PLAN_DE_ESTUDIO',
}

export interface CreatePlanDeEstudioJobData {
  version: number;
  carreraId: string;
  estaActivo?: boolean;
}

export interface FindOnePlanDeEstudioJobData {
  id: string;
}

export interface UpdatePlanDeEstudioJobData {
  id: string;
  version?: number;
  carreraId?: string;
  estaActivo?: boolean;
}

export interface DeletePlanDeEstudioJobData {
  id: string;
}

export type PlanDeEstudioJobData =
  | CreatePlanDeEstudioJobData
  | FindOnePlanDeEstudioJobData
  | UpdatePlanDeEstudioJobData
  | DeletePlanDeEstudioJobData;
