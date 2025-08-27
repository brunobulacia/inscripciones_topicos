import { Estudiante } from '@prisma/client';

export type loginDto = Omit<Estudiante, 'id' | 'username'>;
