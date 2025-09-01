import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfertaGrupoMateriasService } from './oferta_grupo_materias.service';
import type { CreateOfertaGrupoMateriaDto } from './dto/create-oferta_grupo_materia.dto';
import type { UpdateOfertaGrupoMateriaDto } from './dto/update-oferta_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('oferta-grupo-materias')
@ApiBearerAuth()
@Controller('oferta-grupo-materias')
export class OfertaGrupoMateriasController {
  constructor(
    private readonly ofertaGrupoMateriasService: OfertaGrupoMateriasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva oferta grupo materia' })
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
    description: 'Oferta grupo materia creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto) {
    return this.ofertaGrupoMateriasService.create(createOfertaGrupoMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ofertas grupo materias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas grupo materias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          grupoMateriaId: { type: 'string' },
          maestroDeOfertaId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.ofertaGrupoMateriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener oferta grupo materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta grupo materia encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        grupoMateriaId: { type: 'string' },
        maestroDeOfertaId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.ofertaGrupoMateriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar oferta grupo materia' })
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
    description: 'Oferta grupo materia actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateOfertaGrupoMateriaDto: UpdateOfertaGrupoMateriaDto,
  ) {
    return this.ofertaGrupoMateriasService.update(
      id,
      updateOfertaGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar oferta grupo materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta grupo materia eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.ofertaGrupoMateriasService.remove(id);
  }
}
