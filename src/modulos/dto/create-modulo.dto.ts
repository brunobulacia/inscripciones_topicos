import { Modulo } from '@prisma/client';

export type CreateModuloDto = Omit<
  Modulo,
  'id' | 'updatedAt' | 'createdAt' | 'estaActivo'
>;
