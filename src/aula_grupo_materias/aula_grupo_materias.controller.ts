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
import { AulaGrupoMateriaQueueService } from './services/aula-grupo-materia-queue.service';
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
    private readonly aulaGrupoMateriaQueueService: AulaGrupoMateriaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todas las relaciones aula-grupo-materia (sincrónico)',
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

  @Get('/sync/:id')
  @ApiOperation({
    summary: 'Obtener relación aula-grupo-materia por ID (sincrónico)',
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

  @Post('/sync')
  @ApiOperation({
    summary: 'Crear nueva relación aula-grupo-materia (sincrónico)',
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

  @Patch('/sync/:id')
  @ApiOperation({
    summary: 'Actualizar relación aula-grupo-materia (sincrónico)',
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

  @Delete('/sync/:id')
  @ApiOperation({
    summary: 'Eliminar relación aula-grupo-materia (sincrónico)',
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
    status: 202,
    description: 'Job encolado para crear relación aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear relación aula-grupo-materia',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto,
  ) {
    const result =
      await this.aulaGrupoMateriaQueueService.createAulaGrupoMateria(
        createAulaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear relación aula-grupo-materia',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las relaciones aula-grupo-materia (asíncrono)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener relaciones aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener relaciones aula-grupo-materia',
        },
      },
    },
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result =
      await this.aulaGrupoMateriaQueueService.findAllAulaGrupoMaterias({
        page,
        limit,
      });
    return {
      ...result,
      message: 'Job encolado para obtener relaciones aula-grupo-materia',
    };
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
    status: 202,
    description: 'Job encolado para obtener relación aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener relación aula-grupo-materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.aulaGrupoMateriaQueueService.findOneAulaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para obtener relación aula-grupo-materia',
    };
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
    status: 202,
    description: 'Job encolado para actualizar relación aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar relación aula-grupo-materia',
        },
      },
    },
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
    const result =
      await this.aulaGrupoMateriaQueueService.updateAulaGrupoMateria(
        id,
        updateAulaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para actualizar relación aula-grupo-materia',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar relación aula-grupo-materia (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación aula-grupo-materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar relación aula-grupo-materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar relación aula-grupo-materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación aula-grupo-materia no encontrada',
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.aulaGrupoMateriaQueueService.deleteAulaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para eliminar relación aula-grupo-materia',
    };
  }
}
