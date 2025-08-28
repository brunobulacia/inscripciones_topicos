import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanesDeEstudioService } from './planes_de_estudio.service';
import type { CreatePlanDeEstudioDto } from './dto/create-planes_de_estudio.dto';
import type { UpdatePlanDeEstudioDto } from './dto/update-planes_de_estudio.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('planes-de-estudio')
@ApiBearerAuth()
@Controller('planes-de-estudio')
export class PlanesDeEstudioController {
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo plan de estudio' })
  @ApiBody({
    description: 'Datos del plan de estudio a crear',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Plan de estudio creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El plan de estudio ya existe' })
  create(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    return this.planesDeEstudioService.create(createPlanDeEstudioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes de estudio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes de estudio',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          version: { type: 'number' },
          carreraId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.planesDeEstudioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plan de estudio por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        version: { type: 'number' },
        carreraId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Plan de estudio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.planesDeEstudioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar plan de estudio' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del plan de estudio',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Plan de estudio no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    return this.planesDeEstudioService.update(id, updatePlanDeEstudioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plan de estudio' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Plan de estudio no encontrado' })
  remove(@Param('id') id: string) {
    return this.planesDeEstudioService.remove(id);
  }
}
