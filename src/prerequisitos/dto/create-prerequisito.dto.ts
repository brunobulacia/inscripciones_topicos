import { Prerequisito } from '@prisma/client';

export type CreatePrerequisitoDto = Omit<
  Prerequisito,
  'id' | 'createdAt' | 'updatedAt'
>;
