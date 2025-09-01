import { MaestroDeOferta } from '@prisma/client';

export type CreateMaestroDeOfertaDto = Omit<
  MaestroDeOferta,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
