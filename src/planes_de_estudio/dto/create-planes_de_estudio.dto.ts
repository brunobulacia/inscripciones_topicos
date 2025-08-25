import { PlanDeEstudio } from '@prisma/client';

export type CreatePlanDeEstudioDto = Omit<
  PlanDeEstudio,
  'id' | 'createdAt' | 'updatedAt'
>;
