import { Horario } from '@prisma/client';

export type CreateHorarioDto = Omit<
  Horario,
  'id' | 'createdAt' | 'updatedAt' | 'estaActivo'
>;
