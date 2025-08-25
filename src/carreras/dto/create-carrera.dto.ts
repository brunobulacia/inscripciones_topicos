import { Carrera } from '@prisma/client';

export type CreateCarreraDto = Omit<Carrera, 'id' | 'createdAt' | 'updatedAt'>;
