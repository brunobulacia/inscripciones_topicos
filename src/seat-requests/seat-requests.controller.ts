import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { SeatRequestsService } from './seat-requests.service';
import type { CreateSeatRequestDto } from './dto/create-seat-request.dto';

@Controller('seat-requests')
export class SeatRequestsController {
  constructor(private readonly seatRequestsService: SeatRequestsService) {}

  /**
   * Crear una nueva reserva temporal
   * POST /seat-requests
   */
  @Post()
  async createSeatRequest(@Body() createSeatRequestDto: CreateSeatRequestDto) {
    return this.seatRequestsService.createSeatRequest(createSeatRequestDto);
  }

  /**
   * Obtener el estado de una reserva específica
   * GET /seat-requests/:id
   */
  @Get(':id')
  async getSeatRequestStatus(@Param('id') id: string) {
    return this.seatRequestsService.getSeatRequestStatus(id);
  }

  /**
   * Obtener todas las reservas de un estudiante por ID interno
   * GET /seat-requests/student/:estudianteId
   */
  @Get('student/:estudianteId')
  async getStudentSeatRequests(@Param('estudianteId') estudianteId: string) {
    return this.seatRequestsService.getStudentSeatRequests(estudianteId);
  }

  /**
   * Obtener todas las reservas de un estudiante por registro/matrícula
   * GET /seat-requests/registro/:registro
   */
  @Get('registro/:registro')
  async getStudentSeatRequestsByRegistro(@Param('registro') registro: string) {
    return this.seatRequestsService.getStudentSeatRequestsByRegistro(registro);
  }

  /**
   * Obtener todas las reservas pendientes (admin)
   * GET /seat-requests/admin/pending
   */
  @Get('admin/pending')
  async getPendingSeatRequests() {
    return this.seatRequestsService.getPendingSeatRequests();
  }

  /**
   * Procesar manualmente todas las reservas pendientes (admin)
   * POST /seat-requests/admin/process
   */
  @Post('admin/process')
  async processPendingSeatRequests() {
    return this.seatRequestsService.processPendingSeatRequests();
  }

  /**
   * Confirmar manualmente una reserva específica (admin)
   * POST /seat-requests/:id/confirm
   */
  @Post(':id/confirm')
  async confirmSeatRequest(@Param('id') id: string) {
    return this.seatRequestsService.confirmSeatRequest(id);
  }

  /**
   * Rechazar manualmente una reserva específica (admin)
   * POST /seat-requests/:id/reject
   */
  @Post(':id/reject')
  async rejectSeatRequest(
    @Param('id') id: string,
    @Body('motivo') motivo: string = 'Rechazado manualmente',
  ) {
    return this.seatRequestsService.rejectRequest(id, motivo);
  }

  /**
   * 🚀 BullMQ Testing Endpoints
   */

  /**
   * Procesar usando BullMQ (nuevo sistema)
   * POST /seat-requests/bullmq/process
   */
  @Post('bullmq/process')
  async processBullMQ() {
    return this.seatRequestsService.processSeatsRequestsBatch();
  }

  /**
   * Limpiar expiradas usando BullMQ
   * POST /seat-requests/bullmq/expire
   */
  @Post('bullmq/expire')
  async expireBullMQ() {
    return this.seatRequestsService.expireSeatsRequestsBatch();
  }
}
