import { FichaInscripcion } from '@prisma/client';

export type CreateFichaInscripcionDto = Omit<
  FichaInscripcion,
  'id' | 'updatedAt' | 'createdAt'
>;
