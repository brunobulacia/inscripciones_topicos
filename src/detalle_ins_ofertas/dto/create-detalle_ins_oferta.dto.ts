import { DetalleInsOferta } from '@prisma/client';

export type CreateDetalleInsOfertaDto = Omit<
  DetalleInsOferta,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
