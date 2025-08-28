import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GrupoMateriasService } from './grupo_materias.service';
import type { CreateGrupoMateriaDto } from './dto/create-grupo_materia.dto';
import type { UpdateGrupoMateriaDto } from './dto/update-grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('grupo-materias')
@ApiBearerAuth()
@Controller('grupo-materias')
export class GrupoMateriasController {
  constructor(private readonly grupoMateriasService: GrupoMateriasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo grupo de materia' })
  @ApiBody({
    description: 'Datos del grupo de materia a crear',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Grupo A' },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        detalleInscripcionId: { type: 'string', example: 'uuid-detalle' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo de materia creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    return this.grupoMateriasService.create(createGrupoMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los grupos de materias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos de materias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          materiaId: { type: 'string' },
          docenteId: { type: 'string' },
          detalleInscripcionId: { type: 'string' },
          aulaGrupoMateriaId: { type: 'string' },
          periodoId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.grupoMateriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener grupo de materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo de materia encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        nombre: { type: 'string' },
        materiaId: { type: 'string' },
        docenteId: { type: 'string' },
        detalleInscripcionId: { type: 'string' },
        aulaGrupoMateriaId: { type: 'string' },
        periodoId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  findOne(@Param('id') id: string) {
    return this.grupoMateriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar grupo de materia' })
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
        nombre: { type: 'string', example: 'Grupo A' },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        detalleInscripcionId: { type: 'string', example: 'uuid-detalle' },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo de materia actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ) {
    return this.grupoMateriasService.update(id, updateGrupoMateriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar grupo de materia' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo de materia eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  remove(@Param('id') id: string) {
    return this.grupoMateriasService.remove(id);
  }
}
