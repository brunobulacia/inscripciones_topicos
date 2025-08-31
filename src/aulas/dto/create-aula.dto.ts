import { Aula } from '@prisma/client';

export type CreateAulaDto = Omit<
  Aula,
  'id' | 'updatedAt' | 'createdAt' | 'estaActivo'
>;
