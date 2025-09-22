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

  //METODOS SINCRONOS
  @Get('')
  @ApiOperation({ summary: 'Obtener todos los planes de estudio (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Planes de estudio obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          version: { type: 'number', example: 1 },
          carreraId: { type: 'string', example: 'uuid-carrera' },
          estaActivo: { type: 'boolean', example: true },
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
  @ApiOperation({ summary: 'Obtener plan de estudio por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.planesDeEstudioService.findOne(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Crear nuevo plan de estudio (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo plan de estudio',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    return this.planesDeEstudioService.create(createPlanDeEstudioDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar plan de estudio (sincrónico)' })
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    return this.planesDeEstudioService.update(id, updatePlanDeEstudioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plan de estudio (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Plan de estudio eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.planesDeEstudioService.remove(id);
  }

  //METODOS ASINCRONOS
  @Get('')
  findAllAsync() {
    return this.planesDeEstudioService.findAll();
  }

  @Get(':id')
  findOneAsync(@Param('id') id: string) {
    return this.planesDeEstudioService.findOne(id);
  }

  @Post('')
  createAsync(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    return this.planesDeEstudioService.create(createPlanDeEstudioDto);
  }

  @Patch(':id')
  updateAsync(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    return this.planesDeEstudioService.update(id, updatePlanDeEstudioDto);
  }

  @Delete(':id')
  removeAsync(@Param('id') id: string) {
    return this.planesDeEstudioService.remove(id);
  }
}
