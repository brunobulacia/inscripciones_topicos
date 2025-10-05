import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SeatRequestStatus } from '@prisma/client';
import { CreateSeatRequestDto } from './dto/create-seat-request.dto';
import { BullMQDashboardService } from '../bullmq-dashboard/bullmq-dashboard.service';

@Injectable()
export class SeatRequestsService implements OnModuleInit {
  private readonly logger = new Logger(SeatRequestsService.name);
  private readonly TTL_MINUTES = 15; // Tiempo de vida de la reserva temporal

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('seat-processing') private readonly seatQueue: Queue,
    private readonly dashboardService: BullMQDashboardService,
  ) {}

  async onModuleInit() {
    // Registrar la cola en el dashboard cuando se inicializa el módulo
    this.dashboardService.addQueue(this.seatQueue);
    this.logger.log('✅ Cola seat-processing registrada en el dashboard BullMQ');
  }

  /**
   * Crear una nueva reserva temporal (SeatRequested)
   */
  async createSeatRequest(createSeatRequestDto: CreateSeatRequestDto) {
    const { registro, grupoMateriaId, preferredSchedule, preferredTeacher } =
      createSeatRequestDto;

    // 1. Buscar estudiante por registro (matrícula)
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { matricula: registro },
    });

    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con registro ${registro} no encontrado`,
      );
    }

    // 2. Buscar la mejor oferta disponible para este grupo de materia
    const bestOferta = await this.findBestAvailableOferta({
      grupoMateriaId,
      estudianteId: estudiante.id,
      preferredSchedule,
      preferredTeacher,
    });

    if (!bestOferta) {
      throw new NotFoundException(
        'No hay ofertas disponibles para esta materia',
      );
    }

    // 3. Verificar que no existe una reserva activa previa para este estudiante y grupo
    const existingRequest = await this.prisma.seatRequest.findFirst({
      where: {
        estudianteId: estudiante.id,
        ofertaGrupoMateria: {
          grupoMateriaId: grupoMateriaId,
        },
        estado: 'REQUESTED',
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'Ya tienes una solicitud pendiente para esta materia',
      );
    }

    // Calcular tiempo de expiración
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.TTL_MINUTES);

    // Crear la reserva temporal
    const seatRequest = await this.prisma.seatRequest.create({
      data: {
        estudianteId: estudiante.id,
        ofertaGrupoMateriaId: bestOferta.id,
        expiresAt,
        estado: 'REQUESTED',
      },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido_paterno: true,
            matricula: true,
          },
        },
        ofertaGrupoMateria: {
          include: {
            GrupoMateria: {
              include: {
                materia: {
                  select: {
                    nombre: true,
                    sigla: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    this.logger.log(
      `🎫 Reserva temporal creada: ${seatRequest.id} para ${estudiante.matricula}`,
    );

    // Programar jobs en BullMQ para procesamiento
    await this.scheduleSeatProcessingJobs(seatRequest.id);

    return {
      id: seatRequest.id,
      estado: seatRequest.estado,
      expiresAt: seatRequest.expiresAt,
      estudiante: seatRequest.estudiante,
      materia: seatRequest.ofertaGrupoMateria.GrupoMateria.materia,
      message: `Reserva temporal creada. Expira en ${this.TTL_MINUTES} minutos.`,
    };
  }

  /**
   * Obtener todas las reservas pendientes de procesamiento
   */
  async getPendingSeatRequests() {
    return this.prisma.seatRequest.findMany({
      where: {
        estado: 'REQUESTED',
        expiresAt: { gte: new Date() }, // No expiradas
      },
      include: {
        estudiante: true,
        ofertaGrupoMateria: {
          include: {
            GrupoMateria: {
              include: {
                materia: true,
              },
            },
          },
        },
      },
      orderBy: {
        requestedAt: 'asc', // First-come, first-served
      },
    });
  }

  /**
   * Procesar reservas pendientes (Batch Processing)
   */
  async processPendingSeatRequests() {
    this.logger.log('🔄 Iniciando procesamiento de reservas pendientes...');

    // Primero, marcar como expiradas las que pasaron el TTL
    await this.expireOldRequests();

    // Obtener todas las reservas pendientes agrupadas por oferta
    const pendingRequests = await this.getPendingSeatRequests();

    if (pendingRequests.length === 0) {
      this.logger.log('✅ No hay reservas pendientes para procesar');
      return { processed: 0, confirmed: 0, rejected: 0 };
    }

    // Agrupar por ofertaGrupoMateriaId
    const requestsByOferta = pendingRequests.reduce(
      (acc, request) => {
        const key = request.ofertaGrupoMateriaId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(request);
        return acc;
      },
      {} as Record<string, typeof pendingRequests>,
    );

    let totalConfirmed = 0;
    let totalRejected = 0;

    // Procesar cada oferta
    for (const [ofertaId, requests] of Object.entries(requestsByOferta)) {
      const result = await this.processRequestsForOferta(ofertaId, requests);
      totalConfirmed += result.confirmed;
      totalRejected += result.rejected;
    }

    this.logger.log(
      `✅ Procesamiento completado: ${totalConfirmed} confirmadas, ${totalRejected} rechazadas`,
    );

    return {
      processed: pendingRequests.length,
      confirmed: totalConfirmed,
      rejected: totalRejected,
    };
  }

  /**
   * Procesar reservas para una oferta específica
   */
  private async processRequestsForOferta(ofertaId: string, requests: any[]) {
    // Obtener cupos disponibles actuales
    const oferta = await this.prisma.ofertaGrupoMateria.findUnique({
      where: { id: ofertaId },
      include: { GrupoMateria: true },
    });

    if (!oferta) {
      // Marcar todas como rechazadas si la oferta no existe
      await this.rejectRequests(
        requests.map((r) => r.id),
        'Oferta no disponible',
      );
      return { confirmed: 0, rejected: requests.length };
    }

    const cuposDisponibles = oferta.GrupoMateria.cupos;
    const requestsToConfirm = requests.slice(0, cuposDisponibles);
    const requestsToReject = requests.slice(cuposDisponibles);

    // Confirmar las primeras N solicitudes
    let confirmed = 0;
    for (const request of requestsToConfirm) {
      try {
        await this.confirmSeatRequest(request.id);
        confirmed++;
      } catch (error) {
        this.logger.error(
          `Error confirmando reserva ${request.id}:`,
          error.message,
        );
        await this.rejectRequest(request.id, 'Error interno');
      }
    }

    // Rechazar el resto
    if (requestsToReject.length > 0) {
      await this.rejectRequests(
        requestsToReject.map((r) => r.id),
        'No hay cupos suficientes',
      );
    }

    return {
      confirmed,
      rejected: requestsToReject.length,
    };
  }

  /**
   * Confirmar una reserva y crear la inscripción definitiva
   */
  async confirmSeatRequest(seatRequestId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Obtener la reserva
      const seatRequest = await tx.seatRequest.findUnique({
        where: { id: seatRequestId },
        include: {
          estudiante: true,
          ofertaGrupoMateria: {
            include: { GrupoMateria: true },
          },
        },
      });

      if (!seatRequest || seatRequest.estado !== 'REQUESTED') {
        throw new BadRequestException('Reserva no válida para confirmación');
      }

      // Verificar que aún hay cupos (double-check por concurrencia)
      if (seatRequest.ofertaGrupoMateria.GrupoMateria.cupos <= 0) {
        throw new BadRequestException('No hay cupos disponibles');
      }

      // Marcar reserva como confirmada
      await tx.seatRequest.update({
        where: { id: seatRequestId },
        data: {
          estado: 'CONFIRMED',
          processedAt: new Date(),
        },
      });

      // Decrementar cupos
      await tx.grupoMateria.update({
        where: { id: seatRequest.ofertaGrupoMateria.GrupoMateria.id },
        data: {
          cupos: { decrement: 1 },
          inscritos: { increment: 1 },
        },
      });

      // Aquí podrías crear la inscripción definitiva si es necesario
      // Por ahora, la reserva confirmada representa la inscripción

      this.logger.log(`✅ Reserva confirmada: ${seatRequestId}`);

      return seatRequest;
    });
  }

  /**
   * Rechazar una reserva individual
   */
  async rejectRequest(seatRequestId: string, motivo: string) {
    await this.prisma.seatRequest.update({
      where: { id: seatRequestId },
      data: {
        estado: 'REJECTED',
        processedAt: new Date(),
        motivo,
      },
    });

    this.logger.log(`❌ Reserva rechazada: ${seatRequestId} - ${motivo}`);
  }

  /**
   * Rechazar múltiples reservas
   */
  async rejectRequests(seatRequestIds: string[], motivo: string) {
    await this.prisma.seatRequest.updateMany({
      where: { id: { in: seatRequestIds } },
      data: {
        estado: 'REJECTED',
        processedAt: new Date(),
        motivo,
      },
    });

    this.logger.log(
      `❌ ${seatRequestIds.length} reservas rechazadas: ${motivo}`,
    );
  }

  /**
   * Marcar como expiradas las reservas que pasaron el TTL
   */
  async expireOldRequests() {
    const expiredCount = await this.prisma.seatRequest.updateMany({
      where: {
        estado: 'REQUESTED',
        expiresAt: { lt: new Date() },
      },
      data: {
        estado: 'EXPIRED',
        processedAt: new Date(),
        motivo: 'Reserva expirada por tiempo límite',
      },
    });

    if (expiredCount.count > 0) {
      this.logger.log(
        `⏰ ${expiredCount.count} reservas marcadas como expiradas`,
      );
    }

    return expiredCount.count;
  }

  /**
   * Obtener el estado de una reserva por ID
   */
  async getSeatRequestStatus(seatRequestId: string) {
    const seatRequest = await this.prisma.seatRequest.findUnique({
      where: { id: seatRequestId },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido_paterno: true,
            matricula: true,
          },
        },
        ofertaGrupoMateria: {
          include: {
            GrupoMateria: {
              include: {
                materia: {
                  select: {
                    nombre: true,
                    sigla: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!seatRequest) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return seatRequest;
  }

  /**
   * Obtener todas las reservas de un estudiante por ID interno
   */
  async getStudentSeatRequests(estudianteId: string) {
    return this.prisma.seatRequest.findMany({
      where: { estudianteId },
      include: {
        ofertaGrupoMateria: {
          include: {
            GrupoMateria: {
              include: {
                materia: {
                  select: {
                    nombre: true,
                    sigla: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  /**
   * Obtener todas las reservas de un estudiante por registro/matrícula
   */
  async getStudentSeatRequestsByRegistro(registro: string) {
    // Primero buscar el estudiante
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { matricula: registro },
    });

    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con registro ${registro} no encontrado`,
      );
    }

    return this.getStudentSeatRequests(estudiante.id);
  }

  /**
   * Buscar la mejor oferta disponible para un grupo de materia
   * Aplica lógica inteligente de selección basada en preferencias y disponibilidad
   */
  private async findBestAvailableOferta(params: {
    grupoMateriaId: string;
    estudianteId: string;
    preferredSchedule?: 'morning' | 'afternoon';
    preferredTeacher?: string;
  }) {
    const {
      grupoMateriaId,
      estudianteId,
      preferredSchedule,
      preferredTeacher,
    } = params;

    // Buscar todas las ofertas disponibles para este grupo de materia
    const availableOfertas = await this.prisma.ofertaGrupoMateria.findMany({
      where: {
        grupoMateriaId: grupoMateriaId,
        GrupoMateria: {
          cupos: { gt: 0 }, // Solo ofertas con cupos disponibles
        },
      },
      include: {
        GrupoMateria: {
          include: {
            materia: true,
            docente: true,
          },
        },
      },
    });

    if (availableOfertas.length === 0) {
      return null;
    }

    // Si solo hay una opción, devolverla
    if (availableOfertas.length === 1) {
      return availableOfertas[0];
    }

    // Aplicar lógica de selección inteligente
    let bestOferta = availableOfertas[0];
    let bestScore = 0;

    for (const oferta of availableOfertas) {
      let score = 0;

      // Puntos por cupos disponibles (más cupos = más probable confirmación)
      score += oferta.GrupoMateria.cupos * 2;

      // Puntos por preferencia de horario (simplificado por ahora)
      if (preferredSchedule) {
        // En producción, aquí consultarías la tabla Horarios relacionada
        // y verificarías si coincide con preferredSchedule
        score += 10;
      }

      // Puntos por preferencia de docente
      if (
        preferredTeacher &&
        oferta.GrupoMateria.docente?.nombre === preferredTeacher
      ) {
        score += 15;
      }

      // Verificar conflictos de horario del estudiante (simplificado)
      // En producción, aquí verificarías conflictos reales con otras materias inscritas
      const hasConflicts = await this.checkScheduleConflicts(
        estudianteId,
        oferta.id,
      );
      if (!hasConflicts) {
        score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestOferta = oferta;
      }
    }

    this.logger.log(
      `🎯 Mejor oferta seleccionada para grupoMateria ${grupoMateriaId}: ${bestOferta.id} (score: ${bestScore})`,
    );

    return bestOferta;
  }

  /**
   * Verificar si hay conflictos de horario para un estudiante
   * Versión simplificada - en producción sería más compleja
   */
  private async checkScheduleConflicts(
    estudianteId: string,
    ofertaGrupoMateriaId: string,
  ): Promise<boolean> {
    // Por ahora, asumimos que no hay conflictos
    // En producción, aquí verificarías:
    // 1. Horarios de materias ya confirmadas del estudiante
    // 2. Solapamiento de horarios con la nueva oferta
    // 3. Reglas de negocio específicas (ej: no más de X materias por día)

    return false; // No conflicts
  }

  /**
   * Programar jobs de procesamiento para una reserva específica
   */
  private async scheduleSeatProcessingJobs(seatRequestId: string) {
    // Job para procesamiento inmediato (por si hay cupos disponibles)
    await this.seatQueue.add(
      'process-seat-requests',
      {
        triggerType: 'immediate',
        seatRequestId,
      },
      {
        delay: 30000, // 30 segundos de delay para dar chance a más reservas
        priority: 10,
      },
    );

    // Job para procesamiento batch (cada 2 minutos)
    await this.seatQueue.add(
      'process-seat-requests',
      {
        triggerType: 'batch',
        timestamp: new Date().toISOString(),
      },
      {
        delay: 120000, // 2 minutos
        priority: 5,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    // Job para expiración automática
    await this.seatQueue.add(
      'expire-seat-requests',
      {
        seatRequestId,
        createdAt: new Date().toISOString(),
      },
      {
        delay: this.TTL_MINUTES * 60 * 1000, // 15 minutos
        priority: 1,
      },
    );

    this.logger.log(`📋 Jobs programados para reserva ${seatRequestId}`);
  }

  /**
   * Método para ser llamado desde BullMQ Worker - Procesar batch de reservas
   */
  async processSeatsRequestsBatch() {
    this.logger.log('🔄 [BullMQ] Procesando reservas pendientes...');
    return this.processPendingSeatRequests();
  }

  /**
   * Método para ser llamado desde BullMQ Worker - Limpiar reservas expiradas
   */
  async expireSeatsRequestsBatch() {
    this.logger.log('🧹 [BullMQ] Limpiando reservas expiradas...');
    return this.expireOldRequests();
  }
}
