import { Periodo } from '@prisma/client';

export type CreatePeriodoDto = Omit<Periodo, 'id' | 'updatedAt' | 'createdAt'>;
