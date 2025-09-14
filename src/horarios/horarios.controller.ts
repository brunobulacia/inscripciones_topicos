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
import { HorariosService } from './horarios.service';
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
  constructor(
    private readonly horariosService: HorariosService,
    private readonly horarioQueueService: HorarioQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los horarios (sincrónico)' })
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
    status: 200,
    description: 'Horarios obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          diaSemana: { type: 'string', example: 'Lunes' },
          horaInicio: { type: 'string', example: '08:00' },
          horaFin: { type: 'string', example: '10:00' },
          aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(
    @Query('diaSemana') diaSemana?: string,
    @Query('estaActivo') estaActivo?: boolean,
  ) {
    return this.horariosService.findAll();
  }

  @Get('/sync/aula-grupo/:aulaGrupoMateriaId')
  @ApiOperation({
    summary: 'Obtener horarios por aula grupo materia (sincrónico)',
  })
  @ApiParam({
    name: 'aulaGrupoMateriaId',
    description: 'ID del aula grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Horarios por aula-grupo-materia obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          diaSemana: { type: 'string', example: 'Lunes' },
          horaInicio: { type: 'string', example: '08:00' },
          horaFin: { type: 'string', example: '10:00' },
          aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findByAulaGrupoMateria(
    @Param('aulaGrupoMateriaId') aulaGrupoMateriaId: string,
  ) {
    return this.horariosService.findByAulaGrupoMateria(aulaGrupoMateriaId);
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener horario por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Horario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        diaSemana: { type: 'string', example: 'Lunes' },
        horaInicio: { type: 'string', example: '08:00' },
        horaFin: { type: 'string', example: '10:00' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.horariosService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo horario (sincrónico)' })
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
    status: 201,
    description: 'Horario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        diaSemana: { type: 'string', example: 'Lunes' },
        horaInicio: { type: 'string', example: '08:00' },
        horaFin: { type: 'string', example: '10:00' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar horario (sincrónico)' })
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
    status: 200,
    description: 'Horario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        diaSemana: { type: 'string', example: 'Lunes' },
        horaInicio: { type: 'string', example: '08:00' },
        horaFin: { type: 'string', example: '10:00' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar horario (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Horario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Horario eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
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
    description: 'Job encolado para crear horario',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear horario' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createHorarioDto: CreateHorarioDto) {
    const result =
      await this.horarioQueueService.createHorario(createHorarioDto);
    return {
      ...result,
      message: 'Job encolado para crear horario',
    };
  }

  @Get('/async')
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
    description: 'Job encolado para obtener horarios',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener horarios',
        },
      },
    },
  })
  async findAllQueue(
    @Query('diaSemana') diaSemana?: string,
    @Query('estaActivo') estaActivo?: boolean,
  ) {
    const filters: any = {};
    if (diaSemana) filters.diaSemana = diaSemana;
    if (estaActivo !== undefined) filters.estaActivo = estaActivo;

    const result = await this.horarioQueueService.findAllHorarios(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
    return {
      ...result,
      message: 'Job encolado para obtener horarios',
    };
  }

  @Get('/async/aula-grupo/:aulaGrupoMateriaId')
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
    description: 'Job encolado para obtener horarios por aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener horarios por aula-grupo-materia',
        },
      },
    },
  })
  async findByAulaGrupoMateriaQueue(
    @Param('aulaGrupoMateriaId') aulaGrupoMateriaId: string,
  ) {
    const result =
      await this.horarioQueueService.findHorariosByAulaGrupoMateria(
        aulaGrupoMateriaId,
      );
    return {
      ...result,
      message: 'Job encolado para obtener horarios por aula-grupo-materia',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener horario por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener horario',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener horario',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.horarioQueueService.findOneHorario(id);
    return {
      ...result,
      message: 'Job encolado para obtener horario',
    };
  }

  @Patch('/async/:id')
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
    description: 'Job encolado para actualizar horario',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar horario',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateHorarioDto: UpdateHorarioDto,
  ) {
    const result = await this.horarioQueueService.updateHorario(
      id,
      updateHorarioDto,
    );
    return {
      ...result,
      message: 'Job encolado para actualizar horario',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar horario (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del horario',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar horario',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar horario',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result = await this.horarioQueueService.deleteHorario(id);
    return {
      ...result,
      message: 'Job encolado para eliminar horario',
    };
  }
}
