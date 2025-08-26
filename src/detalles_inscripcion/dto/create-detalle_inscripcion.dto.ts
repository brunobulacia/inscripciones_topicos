import { DetalleInscripcion } from '@prisma/client';

export type CreateDetalleInscripcionDto = Omit<
  DetalleInscripcion,
  'id' | 'updatedAt' | 'createdAt'
>;
