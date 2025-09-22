export class EndpointResponseDto {
  id: string;
  ruta: string;
  metodo: string;
  estaActivo: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Incluir las colas asignadas con su información
  colas?: {
    id: string;
    colaId: string;
    colaNombre: string;
    prioridad: number;
    estaActivo: boolean;
  }[];
}
