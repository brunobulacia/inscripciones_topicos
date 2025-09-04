import { AvanceAcademico } from '@prisma/client';

export type CreateAvanceAcademicoDto = Omit<
  AvanceAcademico,
  'id' | 'updatedAt' | 'createdAt' | 'estaActivo'
>;
