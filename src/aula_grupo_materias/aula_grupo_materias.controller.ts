import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import type { CreateAulaGrupoMateriaDto } from './dto/create-aula_grupo_materia.dto';
import type { UpdateAulaGrupoMateriaDto } from './dto/update-aula_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AulaGrupoMateriaQueueService } from './services/aula-grupo-materia-queue.service';

@ApiTags('aula-grupo-materias')
@ApiBearerAuth()
@Controller('aula-grupo-materias')
export class AulaGrupoMateriasController {
  constructor(
    private readonly aulaGrupoMateriaQueueService: AulaGrupoMateriaQueueService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva relación aula-grupo-materia (encolar)',
  })
  @ApiBody({
    description: 'Datos de la relación aula-grupo-materia a crear',
    schema: {
      type: 'object',
      properties: {
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        aulaId: { type: 'string', example: 'uuid-aula' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Relación aula-grupo-materia encolada para creación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto) {
    return this.aulaGrupoMateriaQueueService.createAulaGrupoMateria(
      createAulaGrupoMateriaDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las relaciones aula-grupo-materia (encolar)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de relaciones aula-grupo-materia encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.aulaGrupoMateriaQueueService.findAllAulaGrupoMaterias({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener relación aula-grupo-materia por ID (encolar)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de relación aula-grupo-materia encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  async findOne(@Param('id') id: string) {
    return this.aulaGrupoMateriaQueueService.findOneAulaGrupoMateria(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar relación aula-grupo-materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la relación aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        aulaId: { type: 'string', example: 'uuid-aula' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia encolada para actualización',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateAulaGrupoMateriaDto: UpdateAulaGrupoMateriaDto,
  ) {
    return this.aulaGrupoMateriaQueueService.updateAulaGrupoMateria(
      id,
      updateAulaGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación aula-grupo-materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia encolada para eliminación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  async remove(@Param('id') id: string) {
    return this.aulaGrupoMateriaQueueService.deleteAulaGrupoMateria(id);
  }
}
