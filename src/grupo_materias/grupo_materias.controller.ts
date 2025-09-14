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
import { GrupoMateriaQueueService } from './services/grupo-materia-queue.service';

@ApiTags('grupo-materias')
@ApiBearerAuth()
@Controller('grupo-materias')
export class GrupoMateriasController {
  constructor(
    private readonly grupoMateriasService: GrupoMateriasService,
    private readonly grupoMateriaQueueService: GrupoMateriaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todos los grupos de materias (sincrónico)',
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

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener grupo de materia por ID (sincrónico)' })
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

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo grupo de materia (sincrónico)' })
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

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar grupo de materia (sincrónico)' })
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

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar grupo de materia (sincrónico)' })
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

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo grupo de materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para crear grupo de materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear grupo de materia',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    const result = await this.grupoMateriaQueueService.createGrupoMateria(
      createGrupoMateriaDto,
    );
    return {
      ...result,
      message: 'Job encolado para crear grupo de materia',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los grupos de materias (asíncrono)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener grupos de materias',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener grupos de materias',
        },
      },
    },
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.grupoMateriaQueueService.findAllGrupoMaterias({
      page,
      limit,
    });
    return {
      ...result,
      message: 'Job encolado para obtener grupos de materias',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener grupo de materia por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener grupo de materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener grupo de materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.grupoMateriaQueueService.findOneGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para obtener grupo de materia',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar grupo de materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar grupo de materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar grupo de materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ) {
    const result = await this.grupoMateriaQueueService.updateGrupoMateria(
      id,
      updateGrupoMateriaDto,
    );
    return {
      ...result,
      message: 'Job encolado para actualizar grupo de materia',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar grupo de materia (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo de materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar grupo de materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar grupo de materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Grupo de materia no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result = await this.grupoMateriaQueueService.deleteGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para eliminar grupo de materia',
    };
  }
}
