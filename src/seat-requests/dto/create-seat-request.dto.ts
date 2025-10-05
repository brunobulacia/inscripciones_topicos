export interface CreateSeatRequestDto {
  registro: string; // Matrícula del estudiante
  grupoMateriaId: string; // ID del grupo de materia que quiere
  // Opcional: preferencias para auto-asignación inteligente
  preferredSchedule?: 'morning' | 'afternoon';
  preferredTeacher?: string;
}
