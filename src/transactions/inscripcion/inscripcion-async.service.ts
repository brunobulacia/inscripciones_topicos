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

    // Información detallada de las materias solicitadas
    const materiasDetalle = await Promise.all(
      gruposMateriasIds.map(async (grupoMateriaId) => {
        try {
          const grupoMateria =
            await this.seatRequestsService.prisma.grupoMateria.findUnique({
              where: { id: grupoMateriaId },
              include: {
                materia: {
                  select: { nombre: true, sigla: true },
                },
              },
            });
          return grupoMateria
            ? {
                grupoMateriaId,
                nombre: grupoMateria.materia.nombre,
                sigla: grupoMateria.materia.sigla,
                grupo: grupoMateria.grupo,
                cuposDisponibles: grupoMateria.cupos,
              }
            : null;
        } catch {
          return null;
        }
      }),
    ).then((results) => results.filter(Boolean));

    return {
      success: true,
      message:
        'Solicitudes de inscripción procesadas via SeatRequests + BullMQ',
      estudiante: {
        registro,
      },
      solicitudes: {
        total: reservas.length,
        exitosas: reservas.length,
        fallidas: errores.length,
      },
      materiassolicitadas: materiasDetalle,
      reservasCreadas: reservas,
      erroresDetalle: errores,
      siguientePaso: {
        mensaje:
          'Las reservas serán procesadas automáticamente cada 2 minutos por BullMQ',
        consultar: `Para ver el estado: GET /api/inscripcion-async/estado/${registro}`,
        dashboard: 'Monitorea en: http://localhost:3000/admin/queues',
      },
      sistemaUsado: 'SeatRequests + BullMQ (Reservas temporales)',
      procesamiento: {
        automatico: 'Cada 2 minutos',
        inmediato: 'POST /api/seat-requests/bullmq/process',
      },
    };
  }

  /**
   * Obtener el estado de las inscripciones de un estudiante por registro
   */
  async getEstadoInscripciones(registro: string) {
    const reservas =
      await this.seatRequestsService.getStudentSeatRequestsByRegistro(registro);

    const resumen = {
      estudiante: { registro },
      totalSolicitudes: reservas.length,
      pendientes: reservas.filter((r) => r.estado === 'REQUESTED').length,
      confirmadas: reservas.filter((r) => r.estado === 'CONFIRMED').length,
      rechazadas: reservas.filter((r) => r.estado === 'REJECTED').length,
      expiradas: reservas.filter((r) => r.estado === 'EXPIRED').length,
    };

    const inscripcionesConfirmadas = reservas
      .filter((r) => r.estado === 'CONFIRMED')
      .map((r) => ({
        id: r.id,
        materia: {
          nombre: r.ofertaGrupoMateria.GrupoMateria.materia.nombre,
          sigla: r.ofertaGrupoMateria.GrupoMateria.materia.sigla,
          grupo: r.ofertaGrupoMateria.GrupoMateria.grupo,
        },
        fechaInscripcion: r.processedAt,
        estado: 'INSCRITO',
      }));

    const solicitudesPendientes = reservas
      .filter((r) => r.estado === 'REQUESTED')
      .map((r) => ({
        id: r.id,
        materia: {
          nombre: r.ofertaGrupoMateria.GrupoMateria.materia.nombre,
          sigla: r.ofertaGrupoMateria.GrupoMateria.materia.sigla,
          grupo: r.ofertaGrupoMateria.GrupoMateria.grupo,
        },
        fechaSolicitud: r.requestedAt,
        expiraEn: r.expiresAt,
        estado: 'PENDIENTE',
      }));

    return {
      resumen,
      inscripcionesConfirmadas,
      solicitudesPendientes,
      todasLasReservas: reservas,
      ultimaActualizacion: new Date().toISOString(),
    };
  }

  /**
   * Obtener el estado de las inscripciones de un estudiante por ID interno (para compatibilidad)
   */
  async getEstadoInscripcionesPorId(estudianteId: string) {
    return this.seatRequestsService.getStudentSeatRequests(estudianteId);
  }
}
