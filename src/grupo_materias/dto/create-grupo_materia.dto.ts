import { GrupoMateria } from '@prisma/client';

export type CreateGrupoMateriaDto = Omit<
  GrupoMateria,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
