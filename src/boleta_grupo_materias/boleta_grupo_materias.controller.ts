import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoletaGrupoMateriasService } from './boleta_grupo_materias.service';
import type { CreateBoletaGrupoMateriaDto } from './dto/create-boleta_grupo_materia.dto';
import type { UpdateBoletaGrupoMateriaDto } from './dto/update-boleta_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('boleta-grupo-materias')
@ApiBearerAuth()
@Controller('boleta-grupo-materias')
export class BoletaGrupoMateriasController {
  constructor(
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva boleta grupo materia' })
  @ApiBody({
    description: 'Datos de la boleta grupo materia a crear',
    schema: {
      type: 'object',
      properties: {
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta grupo materia creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletaGrupoMateriaDto: CreateBoletaGrupoMateriaDto) {
    return this.boletaGrupoMateriasService.create(createBoletaGrupoMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las boletas grupo materias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletas grupo materias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          boletaInscripcionId: { type: 'string' },
          grupoMateriaId: { type: 'string' },
          nota: { type: 'number' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.boletaGrupoMateriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener boleta grupo materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta grupo materia encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        boletaInscripcionId: { type: 'string' },
        grupoMateriaId: { type: 'string' },
        nota: { type: 'number' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.boletaGrupoMateriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar boleta grupo materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta grupo materia actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateBoletaGrupoMateriaDto: UpdateBoletaGrupoMateriaDto,
  ) {
    return this.boletaGrupoMateriasService.update(
      id,
      updateBoletaGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar boleta grupo materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta grupo materia eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.boletaGrupoMateriasService.remove(id);
  }
}
