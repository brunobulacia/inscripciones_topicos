import { BoletaGrupoMateria } from '@prisma/client';

export type CreateBoletaGrupoMateriaDto = Omit<
  BoletaGrupoMateria,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
