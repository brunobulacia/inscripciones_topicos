import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InscripcionAsyncService } from './inscripcion-async.service';
import type { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Controller('inscripcion-async')
export class InscripcionAsyncController {
  constructor(
    private readonly inscripcionAsyncService: InscripcionAsyncService,
  ) {}

  /**
   * Solicitar inscripción usando SeatRequests
   * POST /inscripcion-async/solicitar
   */
  @Post('solicitar')
  async solicitarInscripcion(
    @Body() createInscripcionDto: CreateInscripcionDto,
  ) {
    return this.inscripcionAsyncService.solicitarInscripcion(
      createInscripcionDto,
    );
  }

  /**
   * Obtener estado de inscripciones de un estudiante por registro
   * POST /inscripcion-async/estado
   */
  @Post('estado')
  async getEstadoInscripciones(@Body('registro') registro: string) {
    return this.inscripcionAsyncService.getEstadoInscripciones(registro);
  }

  /**
   * Obtener estado de inscripciones por ID interno (para compatibilidad)
   * POST /inscripcion-async/estado-por-id
   */
  @Post('estado-por-id')
  async getEstadoInscripcionesPorId(
    @Body('estudianteId') estudianteId: string,
  ) {
    return this.inscripcionAsyncService.getEstadoInscripcionesPorId(
      estudianteId,
    );
  }

  /**
   * Obtener estado de inscripciones por registro (GET más user-friendly)
   * GET /inscripcion-async/estado/:registro
   */
  @Get('estado/:registro')
  async getEstadoInscripcionesGet(@Param('registro') registro: string) {
    return this.inscripcionAsyncService.getEstadoInscripciones(registro);
  }
}
