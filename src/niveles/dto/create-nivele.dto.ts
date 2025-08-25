import { Nivel } from '@prisma/client';

export type CreateNivelDto = Omit<Nivel, 'id' | 'updatedAt' | 'createdAt'>;
