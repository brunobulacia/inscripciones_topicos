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
    private readonly detalleInscripcionService: DetallesInscripcionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo detalle de inscripción' })
  @ApiBody({
    description: 'Datos del detalle de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle de inscripción creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDetalleInscripcionDto: CreateDetalleInscripcionDto) {
    return this.detalleInscripcionService.create(createDetalleInscripcionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de inscripción' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles de inscripción',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fichaInscripcionId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.detalleInscripcionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de inscripción por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de inscripción encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        fichaInscripcionId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.detalleInscripcionService.findOne(id);
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
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de inscripción actualizado exitosamente',
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
    return this.detalleInscripcionService.update(
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
    status: 200,
    description: 'Detalle de inscripción eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.detalleInscripcionService.remove(id);
  }
}
