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
import type { CreateOfertaGrupoMateriaDto } from './dto/create-oferta_grupo_materia.dto';
import type { UpdateOfertaGrupoMateriaDto } from './dto/update-oferta_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OfertaGrupoMateriaQueueService } from './services/oferta-grupo-materia-queue.service';

@ApiTags('oferta-grupo-materias')
@ApiBearerAuth()
@Controller('oferta-grupo-materias')
export class OfertaGrupoMateriasController {
  constructor(
    private readonly ofertaGrupoMateriaQueueService: OfertaGrupoMateriaQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva oferta grupo materia (encolar)' })
  @ApiBody({
    description: 'Datos de la oferta grupo materia a crear',
    schema: {
      type: 'object',
      properties: {
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Oferta grupo materia encolada para creación',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body() createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto,
  ) {
    return this.ofertaGrupoMateriaQueueService.createOfertaGrupoMateria(
      createOfertaGrupoMateriaDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las ofertas grupo materias (encolar)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de ofertas grupo materias encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ofertaGrupoMateriaQueueService.findAllOfertaGrupoMaterias({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener oferta grupo materia por ID (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de oferta grupo materia encolada',
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
    description: 'Oferta grupo materia no encontrada',
  })
  async findOne(@Param('id') id: string) {
    return this.ofertaGrupoMateriaQueueService.findOneOfertaGrupoMateria(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar oferta grupo materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la oferta grupo materia',
    schema: {
      type: 'object',
      properties: {
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta grupo materia encolada para actualización',
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateOfertaGrupoMateriaDto: UpdateOfertaGrupoMateriaDto,
  ) {
    return this.ofertaGrupoMateriaQueueService.updateOfertaGrupoMateria(
      id,
      updateOfertaGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar oferta grupo materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta grupo materia encolada para eliminación',
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  async remove(@Param('id') id: string) {
    return this.ofertaGrupoMateriaQueueService.deleteOfertaGrupoMateria(id);
  }
}
