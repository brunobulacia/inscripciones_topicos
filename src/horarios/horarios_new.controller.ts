import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HorarioQueueService } from './services/horario-queue.service';
import type { CreateHorarioDto } from './dto/create-horario.dto';
import type { UpdateHorarioDto } from './dto/update-horario.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('horarios')
@ApiBearerAuth()
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horarioQueueService: HorarioQueueService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo horario (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Horario encolado para creación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioQueueService.createHorario(createHorarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios (asíncrono)' })
  @ApiQuery({
    name: 'diaSemana',
    required: false,
    description: 'Filtrar por día de la semana',
    example: 'Lunes',
  })
  @ApiQuery({
    name: 'estaActivo',
    required: false,
    description: 'Filtrar por estado activo',
    example: true,
  })
  @ApiResponse({
    status: 202,
    description: 'Búsqueda de horarios encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  findAll(
    @Query('diaSemana') diaSemana?: string,
    @Query('estaActivo') estaActivo?: boolean,
  ) {
    const filters: any = {};
    if (diaSemana) filters.diaSemana = diaSemana;
    if (estaActivo !== undefined) filters.estaActivo = estaActivo;

    return this.horarioQueueService.findAllHorarios(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Get('aula-grupo/:aulaGrupoMateriaId')
  @ApiOperation({
    summary: 'Obtener horarios por aula grupo materia (asíncrono)',
  })
  @ApiParam({
    name: 'aulaGrupoMateriaId',
    description: 'ID del aula grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Búsqueda de horarios por aula-grupo-materia encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  findByAulaGrupoMateria(
    @Param('aulaGrupoMateriaId') aulaGrupoMateriaId: string,
  ) {
    return this.horarioQueueService.findHorariosByAulaGrupoMateria(
      aulaGrupoMateriaId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener horario por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Búsqueda de horario encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.horarioQueueService.findOneHorario(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar horario (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Horario encolado para actualización',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horarioQueueService.updateHorario(id, updateHorarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar horario (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Horario encolado para eliminación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id') id: string) {
    return this.horarioQueueService.deleteHorario(id);
  }
}
