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
  constructor(private readonly gestionesService: GestionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las gestiones' })
  @ApiResponse({
    status: 200,
    description: 'Gestiones obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          año: { type: 'string', example: '2024' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.gestionesService.findAll();
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
    description: 'Gestión obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  findOne(@Param('id') id: string) {
    return this.gestionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva gestión' })
  @ApiBody({
    description: 'Datos de la nueva gestión',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Gestión creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createGestionDto: CreateGestionDto) {
    return this.gestionesService.create(createGestionDto);
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
  @ApiResponse({
    status: 200,
    description: 'Gestión actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateGestionDto: UpdateGestionDto) {
    return this.gestionesService.update(id, updateGestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gestión' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Gestión eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  remove(@Param('id') id: string) {
    return this.gestionesService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync() {
    return this.gestionesService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.gestionesService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createGestionDto: CreateGestionDto) {
    return this.gestionesService.create(createGestionDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateGestionDto: UpdateGestionDto,
  ) {
    return this.gestionesService.update(id, updateGestionDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.gestionesService.remove(id);
  }
}
