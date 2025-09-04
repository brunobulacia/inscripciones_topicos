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
import type { CreateGrupoMateriaDto } from './dto/create-grupo_materia.dto';
import type { UpdateGrupoMateriaDto } from './dto/update-grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { GrupoMateriaQueueService } from './services/grupo-materia-queue.service';

@ApiTags('grupo-materias')
@ApiBearerAuth()
@Controller('grupo-materias')
export class GrupoMateriasController {
  constructor(
    private readonly grupoMateriaQueueService: GrupoMateriaQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo grupo de materia (encolar)' })
  @ApiBody({
    description: 'Datos del grupo de materia a crear',
    schema: {
      type: 'object',
      properties: {
        grupo: { type: 'string', example: 'A' },
        inscritos: { type: 'number', example: 0 },
        cupos: { type: 'number', example: 20 },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo de materia encolado para creación',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    return this.grupoMateriaQueueService.createGrupoMateria(
      createGrupoMateriaDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los grupos de materias (encolar)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de grupos de materias encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.grupoMateriaQueueService.findAllGrupoMaterias({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener grupo de materia por ID (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de grupo de materia encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.grupoMateriaQueueService.findOneGrupoMateria(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar grupo de materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del grupo de materia',
    schema: {
      type: 'object',
      properties: {
        grupo: { type: 'string', example: 'B' },
        inscritos: { type: 'number', example: 5 },
        cupos: { type: 'number', example: 25 },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo de materia encolado para actualización',
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ) {
    return this.grupoMateriaQueueService.updateGrupoMateria(
      id,
      updateGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar grupo de materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo de materia encolado para eliminación',
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  async remove(@Param('id') id: string) {
    return this.grupoMateriaQueueService.deleteGrupoMateria(id);
  }
}
