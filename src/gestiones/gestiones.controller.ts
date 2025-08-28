import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import type { CreateGestionDto } from './dto/create-gestion.dto';
import type { UpdateGestionDto } from './dto/update-gestion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('gestiones')
@ApiBearerAuth()
@Controller('gestiones')
export class GestionesController {
  constructor(private readonly gestionService: GestionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva gestión' })
  @ApiBody({
    description: 'Datos de la gestión a crear',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Gestión creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createGestionDto: CreateGestionDto) {
    return this.gestionService.create(createGestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las gestiones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gestiones',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          año: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.gestionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gestión por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        año: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  findOne(@Param('id') id: string) {
    return this.gestionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gestión' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la gestión',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Gestión actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateGestionDto: UpdateGestionDto) {
    return this.gestionService.update(id, updateGestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gestión' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Gestión eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  remove(@Param('id') id: string) {
    return this.gestionService.remove(id);
  }
}
