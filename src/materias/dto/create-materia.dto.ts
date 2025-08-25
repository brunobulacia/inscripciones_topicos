import { Materia } from '@prisma/client';
export type CreateMateriaDto = Omit<Materia, 'id'>;
