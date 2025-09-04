import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DetallesInscripcionService } from './detalles_inscripcion.service';
import { DetalleInscripcionQueueService } from './services/detalle-inscripcion-queue.service';
import type { CreateDetalleInscripcionDto } from './dto/create-detalle_inscripcion.dto';
import type { UpdateDetalleInscripcionDto } from './dto/update-detalle_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('detalles-inscripcion')
@ApiBearerAuth()
@Controller('detalles-inscripcion')
export class DetallesInscripcionController {
  constructor(
    private readonly detalleInscripcionQueueService: DetalleInscripcionQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo detalle de inscripción' })
  @ApiBody({
    description: 'Datos del detalle de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDetalleInscripcionDto: CreateDetalleInscripcionDto) {
    return this.detalleInscripcionQueueService.createDetalleInscripcion(
      createDetalleInscripcionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de inscripción' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener detalles de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  findAll() {
    return this.detalleInscripcionQueueService.findAllDetalleInscripciones();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de inscripción por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.detalleInscripcionQueueService.findOneDetalleInscripcion(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateDetalleInscripcionDto: UpdateDetalleInscripcionDto,
  ) {
    return this.detalleInscripcionQueueService.updateDetalleInscripcion(
      id,
      updateDetalleInscripcionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.detalleInscripcionQueueService.deleteDetalleInscripcion(id);
  }
}
