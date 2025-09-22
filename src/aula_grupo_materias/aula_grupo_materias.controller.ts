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
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('aula-grupo-materias')
@ApiBearerAuth()
@Controller('aula-grupo-materias')
export class AulaGrupoMateriasController {
  constructor(
    private readonly aulaGrupoMateriasService: AulaGrupoMateriasService,
  ) {}

  //METODOS DIRECTOS
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las relaciones aula-grupo-materia',
  })
  @ApiResponse({
    status: 200,
    description: 'Relaciones aula-grupo-materia obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
          aulaId: { type: 'string', example: 'uuid-aula' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.aulaGrupoMateriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener relación aula-grupo-materia por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        aulaId: { type: 'string', example: 'uuid-aula' },
        estaActivo: { type: 'boolean', example: true },
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
    return this.aulaGrupoMateriasService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear nueva relación aula-grupo-materia',
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
    description: 'Relación aula-grupo-materia creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        aulaId: { type: 'string', example: 'uuid-aula' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto) {
    return this.aulaGrupoMateriasService.create(createAulaGrupoMateriaDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar relación aula-grupo-materia',
  })
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
    description: 'Relación aula-grupo-materia actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        aulaId: { type: 'string', example: 'uuid-aula' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
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
    return this.aulaGrupoMateriasService.update(id, updateAulaGrupoMateriaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar relación aula-grupo-materia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Relación aula-grupo-materia eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.aulaGrupoMateriasService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({
    summary: 'Crear nueva relación aula-grupo-materia (asíncrono)',
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
    description: 'Relación aula-grupo-materia creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto,
  ) {
    return this.aulaGrupoMateriasService.create(createAulaGrupoMateriaDto);
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las relaciones aula-grupo-materia (asíncrono)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Relaciones aula-grupo-materia obtenidas exitosamente',
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.aulaGrupoMateriasService.findAll();
  }

  @Get('/async/:id')
  @ApiOperation({
    summary: 'Obtener relación aula-grupo-materia por ID (asíncrono)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación aula-grupo-materia obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    return this.aulaGrupoMateriasService.findOne(id);
  }

  @Patch('/async/:id')
  @ApiOperation({
    summary: 'Actualizar relación aula-grupo-materia (asíncrono)',
  })
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
    description: 'Relación aula-grupo-materia actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateAulaGrupoMateriaDto: UpdateAulaGrupoMateriaDto,
  ) {
    return this.aulaGrupoMateriasService.update(id, updateAulaGrupoMateriaDto);
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar relación aula-grupo-materia (asíncrono)' })
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
  async removeQueue(@Param('id') id: string) {
    return this.aulaGrupoMateriasService.remove(id);
  }
}
