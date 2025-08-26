import { Gestion } from '@prisma/client';

export type CreateGestionDto = Omit<Gestion, 'id' | 'updatedAt' | 'createdAt'>;
