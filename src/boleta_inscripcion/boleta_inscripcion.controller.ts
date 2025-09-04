import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BoletaInscripcionService } from './boleta_inscripcion.service';
import type { CreateBoletaInscripcionDto } from './dto/create-boleta_inscripcion.dto';
import type { UpdateBoletaInscripcionDto } from './dto/update-boleta_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BoletaInscripcionQueueService } from './services/boleta-inscripcion-queue.service';

@ApiTags('boleta-inscripcion')
@ApiBearerAuth()
@Controller('boletas-inscripcion')
export class BoletaInscripcionController {
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
    private readonly boletaInscripcionQueueService: BoletaInscripcionQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva boleta de inscripción' })
  @ApiBody({
    description: 'Datos de la boleta de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta de inscripción creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletaInscripcionDto: CreateBoletaInscripcionDto) {
    return this.boletaInscripcionQueueService.createBoletaInscripcion(
      createBoletaInscripcionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las boletas de inscripción' })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletas de inscripción',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fichaInscripcionId: { type: 'string' },
          avanceAcademicoId: { type: 'string', nullable: true },
          estudianteId: { type: 'string', nullable: true },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.boletaInscripcionQueueService.findAllBoletaInscripcion();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener boleta de inscripción por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        fichaInscripcionId: { type: 'string' },
        avanceAcademicoId: { type: 'string', nullable: true },
        estudianteId: { type: 'string', nullable: true },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.boletaInscripcionQueueService.findOneBoletaInscripcion(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar boleta de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la boleta de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateBoletaInscripcionDto: UpdateBoletaInscripcionDto,
  ) {
    return this.boletaInscripcionQueueService.updateBoletaInscripcion(
      id,
      updateBoletaInscripcionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar boleta de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.boletaInscripcionQueueService.deleteBoletaInscripcion(id);
  }
}
