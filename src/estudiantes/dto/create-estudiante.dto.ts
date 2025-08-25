import { Estudiante } from '@prisma/client';

export type CreateEstudianteDto = Omit<
  Estudiante,
  'id' | 'createdAt' | 'updatedAt'
>;
