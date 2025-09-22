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
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('oferta-grupo-materias')
@ApiBearerAuth()
@Controller('oferta-grupo-materias')
export class OfertaGrupoMateriasController {
  constructor(
    private readonly ofertaGrupoMateriasService: OfertaGrupoMateriasService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las ofertas grupo materias',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ofertas grupo materias obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
          maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
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
    description: 'Oferta grupo materia obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto) {
    return this.ofertaGrupoMateriasService.create(createOfertaGrupoMateriaDto);
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        maestroDeOfertaId: { type: 'string', example: 'uuid-maestro-oferta' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
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
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Oferta grupo materia eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.ofertaGrupoMateriasService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ofertaGrupoMateriasService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.ofertaGrupoMateriasService.findOne(id);
  }

  @Post('/async/')
  createAsync(
    @Body() createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto,
  ) {
    return this.ofertaGrupoMateriasService.create(createOfertaGrupoMateriaDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateOfertaGrupoMateriaDto: UpdateOfertaGrupoMateriaDto,
  ) {
    return this.ofertaGrupoMateriasService.update(
      id,
      updateOfertaGrupoMateriaDto,
    );
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.ofertaGrupoMateriasService.remove(id);
  }
}
