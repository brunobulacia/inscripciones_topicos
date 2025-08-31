import { CreateAulaDto } from '../dto/create-aula.dto';
export const Aulas: CreateAulaDto[] = [...Array(37).keys()].map((i) => ({
  numero: i + 10,
  capacidad: 80,
  moduloId: '4e9e7f2d-6d8a-41d3-9d2a-b5a1b6b60236',
}));
