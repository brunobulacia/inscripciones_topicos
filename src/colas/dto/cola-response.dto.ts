export class ColaResponseDto {
  id: string;
  nombre: string;
  descripcion?: string;
  estaActiva: boolean;
  createdAt: Date;
  updatedAt: Date;
  endpoints?: {
    id: string;
    endpointId: string;
    ruta: string;
    metodo: string;
    prioridad: number;
    estaActivo: boolean;
  }[];
}
