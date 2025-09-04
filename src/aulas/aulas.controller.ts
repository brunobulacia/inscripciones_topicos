import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AulasService } from './aulas.service';
import { AulaQueueService } from './services/aula-queue.service';
import type { CreateAulaDto } from './dto/create-aula.dto';
import type { UpdateAulaDto } from './dto/update-aula.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('aulas')
@ApiBearerAuth()
@Controller('aulas')
export class AulasController {
  constructor(
    private readonly aulaService: AulasService,
    private readonly aulaQueueService: AulaQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva aula' })
  @ApiBody({
    description: 'Datos del aula a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Aula creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El aula ya existe en este módulo' })
  async create(@Body() createAulaDto: CreateAulaDto) {
    const job = await this.aulaQueueService.addCreateAulaJob(createAulaDto);
    return { jobId: job.id, message: 'Aula creation job queued' };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las aulas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aulas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          numero: { type: 'number' },
          capacidad: { type: 'number' },
          aulaGrupoMateriaId: { type: 'string' },
          moduloId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async findAll() {
    const job = await this.aulaQueueService.addFindAllAulasJob();
    return { jobId: job.id, message: 'Find all aulas job queued' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener aula por ID' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiResponse({ status: 200, description: 'Aula encontrada' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  async findOne(@Param('id') id: string) {
    const job = await this.aulaQueueService.addFindOneAulaJob({ id });
    return { jobId: job.id, message: 'Find one aula job queued' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiBody({
    description: 'Datos a actualizar del aula',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Aula actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    const job = await this.aulaQueueService.addUpdateAulaJob({
      id,
      data: updateAulaDto,
    });
    return { jobId: job.id, message: 'Update aula job queued' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiResponse({ status: 200, description: 'Aula eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  async remove(@Param('id') id: string) {
    const job = await this.aulaQueueService.addDeleteAulaJob({ id });
    return { jobId: job.id, message: 'Delete aula job queued' };
  }

  //SEEDER
  @Post('seed')
  @ApiOperation({ summary: 'Crear aulas' })
  @ApiResponse({ status: 201, description: 'Aulas creadas exitosamente' })
  seed() {
    return this.aulaService.seedAulas();
  }

  //CLEAR AULAS
  @Post('clear')
  @ApiOperation({ summary: 'Eliminar todas las aulas' })
  @ApiResponse({
    status: 200,
    description: 'Todas las aulas han sido eliminadas',
  })
  clear() {
    return this.aulaService.clearAulas();
  }
}
