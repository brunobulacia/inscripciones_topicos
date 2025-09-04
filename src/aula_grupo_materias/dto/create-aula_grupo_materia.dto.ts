import { AulaGrupoMateria } from '@prisma/client';

export type CreateAulaGrupoMateriaDto = Omit<
  AulaGrupoMateria,
  'id' | 'updatedAt' | 'createdAt' | 'estaActivo'
>;
