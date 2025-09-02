export const QUEUE_NAMES = {
  CARRERAS: 'carreras',
  ESTUDIANTES: 'estudiantes',
  DOCENTES: 'docentes',
  MATERIAS: 'materias',
  // Agregar más colas según sea necesario
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export interface BaseJobResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface JobStatusResponse {
  status: 'waiting' | 'processing' | 'completed' | 'failed' | 'not_found';
  data?: any;
  error?: string;
  message?: string;
}
