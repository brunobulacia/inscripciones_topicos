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
import { OfertaGrupoMateriaQueueService } from './services/oferta-grupo-materia-queue.service';

@ApiTags('oferta-grupo-materias')
@ApiBearerAuth()
@Controller('oferta-grupo-materias')
export class OfertaGrupoMateriasController {
  constructor(
    private readonly ofertaGrupoMateriasService: OfertaGrupoMateriasService,
    private readonly ofertaGrupoMateriaQueueService: OfertaGrupoMateriaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todas las ofertas grupo materias (sincrónico)',
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

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener oferta grupo materia por ID (sincrónico)' })
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

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva oferta grupo materia (sincrónico)' })
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

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar oferta grupo materia (sincrónico)' })
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

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar oferta grupo materia (sincrónico)' })
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

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva oferta grupo materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para crear oferta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear oferta grupo materia',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto,
  ) {
    const result =
      await this.ofertaGrupoMateriaQueueService.createOfertaGrupoMateria(
        createOfertaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear oferta grupo materia',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las ofertas grupo materias (asíncrono)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener ofertas grupo materias',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener ofertas grupo materias',
        },
      },
    },
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result =
      await this.ofertaGrupoMateriaQueueService.findAllOfertaGrupoMaterias({
        page,
        limit,
      });
    return {
      ...result,
      message: 'Job encolado para obtener ofertas grupo materias',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener oferta grupo materia por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener oferta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener oferta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.ofertaGrupoMateriaQueueService.findOneOfertaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para obtener oferta grupo materia',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar oferta grupo materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar oferta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar oferta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateOfertaGrupoMateriaDto: UpdateOfertaGrupoMateriaDto,
  ) {
    const result =
      await this.ofertaGrupoMateriaQueueService.updateOfertaGrupoMateria(
        id,
        updateOfertaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para actualizar oferta grupo materia',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar oferta grupo materia (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la oferta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar oferta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar oferta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Oferta grupo materia no encontrada',
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.ofertaGrupoMateriaQueueService.deleteOfertaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para eliminar oferta grupo materia',
    };
  }
}
