export class EndpointResponseDto {
  id: string;
  ruta: string;
  metodo: string;
  descripcion?: string;
  colaId: string;
  estaActivo: boolean;
  createdAt: Date;
  updatedAt: Date;
}