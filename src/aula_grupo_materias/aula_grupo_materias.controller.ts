import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AulaGrupoMateriasService } from './aula_grupo_materias.service';
import type { CreateAulaGrupoMateriaDto } from './dto/create-aula_grupo_materia.dto';
import type { UpdateAulaGrupoMateriaDto } from './dto/update-aula_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('aula-grupo-materias')
@ApiBearerAuth()
@Controller('aula-grupo-materias')
export class AulaGrupoMateriasController {
  constructor(
    private readonly aulaGrupoMateriaService: AulaGrupoMateriasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva relación aula-grupo-materia' })
  @ApiBody({
    description: 'Datos de la relación aula-grupo-materia a crear',
    schema: {
      type: 'object',
      properties: {
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Relación aula-grupo-materia creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto) {
    return this.aulaGrupoMateriaService.create(createAulaGrupoMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones aula-grupo-materias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones aula-grupo-materias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.aulaGrupoMateriaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener relación aula-grupo-materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.aulaGrupoMateriaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar relación aula-grupo-materia' })
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
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateAulaGrupoMateriaDto: UpdateAulaGrupoMateriaDto,
  ) {
    return this.aulaGrupoMateriaService.update(id, updateAulaGrupoMateriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación aula-grupo-materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.aulaGrupoMateriaService.remove(id);
  }
}
