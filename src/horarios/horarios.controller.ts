import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import type { CreateHorarioDto } from './dto/create-horario.dto';
import type { UpdateHorarioDto } from './dto/update-horario.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('horarios')
@ApiBearerAuth()
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo horario' })
  @ApiBody({
    description: 'Datos del horario a crear',
    schema: {
      type: 'object',
      properties: {
        diaSemana: { type: 'string', example: 'Lunes' },
        horaInicio: { type: 'string', example: '08:00' },
        horaFin: { type: 'string', example: '10:00' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto de horario' })
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          diaSemana: { type: 'string' },
          horaInicio: { type: 'string' },
          horaFin: { type: 'string' },
          aulaGrupoMateriaId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.horariosService.findAll();
  }

  @Get('aula-grupo/:aulaGrupoMateriaId')
  @ApiOperation({ summary: 'Obtener horarios por aula grupo materia' })
  @ApiParam({
    name: 'aulaGrupoMateriaId',
    description: 'ID del aula grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Horarios del aula grupo materia',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          diaSemana: { type: 'string' },
          horaInicio: { type: 'string' },
          horaFin: { type: 'string' },
          aulaGrupoMateriaId: { type: 'string' },
          estaActivo: { type: 'boolean' },
        },
      },
    },
  })
  findByAulaGrupoMateria(
    @Param('aulaGrupoMateriaId') aulaGrupoMateriaId: string,
  ) {
    return this.horariosService.findByAulaGrupoMateria(aulaGrupoMateriaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener horario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Horario encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        diaSemana: { type: 'string' },
        horaInicio: { type: 'string' },
        horaFin: { type: 'string' },
        aulaGrupoMateriaId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.horariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar horario' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del horario',
    schema: {
      type: 'object',
      properties: {
        diaSemana: { type: 'string', example: 'Lunes' },
        horaInicio: { type: 'string', example: '08:00' },
        horaFin: { type: 'string', example: '10:00' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Horario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar horario' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Horario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }
}
