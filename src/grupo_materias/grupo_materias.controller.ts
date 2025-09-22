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
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('grupo-materias')
@ApiBearerAuth()
@Controller('grupo-materias')
export class GrupoMateriasController {
  constructor(private readonly grupoMateriasService: GrupoMateriasService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los grupos de materias',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Grupos de materias obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          grupo: { type: 'string', example: 'A' },
          inscritos: { type: 'number', example: 0 },
          cupos: { type: 'number', example: 20 },
          materiaId: { type: 'string', example: 'uuid-materia' },
          docenteId: { type: 'string', example: 'uuid-docente' },
          periodoId: { type: 'string', example: 'uuid-periodo' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
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
    description: 'Grupo de materia obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupo: { type: 'string', example: 'A' },
        inscritos: { type: 'number', example: 0 },
        cupos: { type: 'number', example: 20 },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  findOne(@Param('id') id: string) {
    return this.grupoMateriasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo grupo de materia' })
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
    description: 'Grupo de materia creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupo: { type: 'string', example: 'A' },
        inscritos: { type: 'number', example: 0 },
        cupos: { type: 'number', example: 20 },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    return this.grupoMateriasService.create(createGrupoMateriaDto);
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
    description: 'Grupo de materia actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupo: { type: 'string', example: 'B' },
        inscritos: { type: 'number', example: 5 },
        cupos: { type: 'number', example: 25 },
        materiaId: { type: 'string', example: 'uuid-materia' },
        docenteId: { type: 'string', example: 'uuid-docente' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
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
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Grupo de materia eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  remove(@Param('id') id: string) {
    return this.grupoMateriasService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.grupoMateriasService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.grupoMateriasService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    return this.grupoMateriasService.create(createGrupoMateriaDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ) {
    return this.grupoMateriasService.update(id, updateGrupoMateriaDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.grupoMateriasService.remove(id);
  }
}
