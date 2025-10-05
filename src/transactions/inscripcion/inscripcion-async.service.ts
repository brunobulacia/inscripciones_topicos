import { Injectable, Logger } from '@nestjs/common';
import { SeatRequestsService } from '../../seat-requests/seat-requests.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Injectable()
export class InscripcionAsyncService {
  private readonly logger = new Logger(InscripcionAsyncService.name);

  constructor(private readonly seatRequestsService: SeatRequestsService) {}

  /**
   * Nueva función de inscripción que usa SeatRequests
   */
  async solicitarInscripcion(createInscripcionDto: CreateInscripcionDto) {
    const { registro, materiasId, grupoMateriaId } = createInscripcionDto;

    const reservas: any[] = [];
    const errores: any[] = [];

    // Determinar qué formato se está usando
    let gruposMateriasIds: string[] = [];

    if (grupoMateriaId) {
      // Formato nuevo: una sola materia
      gruposMateriasIds = [grupoMateriaId];
    } else if (materiasId && Array.isArray(materiasId)) {
      // Formato anterior: múltiples materias
      gruposMateriasIds = materiasId;
    } else {
      throw new Error('Debe proporcionar grupoMateriaId o materiasId');
    }

    // Crear una reserva temporal para cada materia solicitada
    // Ahora el servicio automáticamente busca el estudiante por registro
    // y encuentra la mejor oferta disponible por grupoMateriaId
    for (const grupoMateriaIdItem of gruposMateriasIds) {
      try {
        const reserva = await this.seatRequestsService.createSeatRequest({
          registro,
          grupoMateriaId: grupoMateriaIdItem,
          // Opcionalmente se pueden agregar preferencias:
          // preferredSchedule: 'morning',
          // preferredTeacher: 'Dr. García'
        });

        reservas.push(reserva);
        this.logger.log(`✅ Reserva creada para materia ${grupoMateriaIdItem}`);
      } catch (error) {
        this.logger.error(
          `❌ Error creando reserva para materia ${grupoMateriaIdItem}:`,
          error.message,
        );
        errores.push({
          grupoMateriaId: grupoMateriaIdItem,
          error: error.message,
        });
      }
    }

    return {
      message:
        'Solicitudes de inscripción procesadas via SeatRequests + BullMQ',
      reservasCreadas: reservas.length,
      errores: errores.length,
      reservas,
      erroresDetalle: errores,
      siguientePaso:
        'Las reservas serán procesadas automáticamente cada 2 minutos por BullMQ. Recibirás una notificación con el resultado.',
      sistemaUsado: 'SeatRequests + BullMQ (Reservas temporales)',
    };
  }

  /**
   * Obtener el estado de las inscripciones de un estudiante por registro
   */
  async getEstadoInscripciones(registro: string) {
    return this.seatRequestsService.getStudentSeatRequestsByRegistro(registro);
  }

  /**
   * Obtener el estado de las inscripciones de un estudiante por ID interno (para compatibilidad)
   */
  async getEstadoInscripcionesPorId(estudianteId: string) {
    return this.seatRequestsService.getStudentSeatRequests(estudianteId);
  }
}
