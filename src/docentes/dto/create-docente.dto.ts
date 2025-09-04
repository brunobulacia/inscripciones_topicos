import { Docente } from '@prisma/client';

export type CreateDocenteDto = Omit<
  Docente,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
