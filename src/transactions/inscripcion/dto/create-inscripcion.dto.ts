// Para compatibilidad con ambos formatos
export type CreateInscripcionDto = {
  registro: string;
  // Para inscripción de una sola materia (nuevo sistema)
  grupoMateriaId?: string;
  // Para inscripción de múltiples materias (compatibilidad)
  materiasId?: string[];
};

// DTO específico para SeatRequests (una materia a la vez)
export type CreateSeatRequestFromInscripcionDto = {
  registro: string;
  grupoMateriaId: string;
};
