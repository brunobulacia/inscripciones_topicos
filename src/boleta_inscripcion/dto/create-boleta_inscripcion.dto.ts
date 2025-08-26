import { BoletaInscripcion } from '@prisma/client';

export type CreateBoletaInscripcionDto = Omit<
  BoletaInscripcion,
  'id' | 'updatedAt' | 'createdAt'
>;
