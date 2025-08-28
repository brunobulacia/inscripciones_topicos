import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import type { CreateCarreraDto } from './dto/create-carrera.dto';
import type { UpdateCarreraDto } from './dto/update-carrera.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('carreras')
@ApiBearerAuth()
@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva carrera' })
  @ApiBody({
    description: 'Datos de la carrera a crear',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Carrera creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La carrera ya existe' })
  create(@Body() createCarreraDto: CreateCarreraDto) {
    return this.carrerasService.create(createCarreraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las carreras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de carreras',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          codigo: { type: 'number' },
          nombre: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.carrerasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrera por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrera encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        codigo: { type: 'number' },
        nombre: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  findOne(@Param('id') id: string) {
    return this.carrerasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrera' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la carrera',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Carrera actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateCarreraDto: UpdateCarreraDto) {
    return this.carrerasService.update(id, updateCarreraDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrera' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Carrera eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  remove(@Param('id') id: string) {
    return this.carrerasService.remove(id);
  }
}
