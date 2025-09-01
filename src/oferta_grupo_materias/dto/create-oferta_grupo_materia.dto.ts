import { OfertaGrupoMateria } from '@prisma/client';

export type CreateOfertaGrupoMateriaDto = Omit<
  OfertaGrupoMateria,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
