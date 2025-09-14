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
import { BoletaGrupoMateriaQueueService } from './services/boleta-grupo-materia-queue.service';
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
    private readonly boletaGrupoMateriaQueueService: BoletaGrupoMateriaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todas las boletas grupo materias (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Boletas grupo materias obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
          grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
          nota: { type: 'number', example: 85.5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.boletaGrupoMateriasService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener boleta grupo materia por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta grupo materia obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
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

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva boleta grupo materia (sincrónico)' })
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletaGrupoMateriaDto: CreateBoletaGrupoMateriaDto) {
    return this.boletaGrupoMateriasService.create(createBoletaGrupoMateriaDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar boleta grupo materia (sincrónico)' })
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
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

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar boleta grupo materia (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta grupo materia eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Boleta grupo materia eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.boletaGrupoMateriasService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva boleta grupo materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para crear boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear boleta grupo materia',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createBoletaGrupoMateriaDto: CreateBoletaGrupoMateriaDto,
  ) {
    const result =
      await this.boletaGrupoMateriaQueueService.createBoletaGrupoMateria(
        createBoletaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear boleta grupo materia',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las boletas grupo materias (asíncrono)',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener boletas grupo materias',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener boletas grupo materias',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.boletaGrupoMateriaQueueService.findAllBoletaGrupoMaterias();
    return {
      ...result,
      message: 'Job encolado para obtener boletas grupo materias',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener boleta grupo materia por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener boleta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.boletaGrupoMateriaQueueService.findOneBoletaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para obtener boleta grupo materia',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar boleta grupo materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar boleta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateBoletaGrupoMateriaDto: UpdateBoletaGrupoMateriaDto,
  ) {
    const result =
      await this.boletaGrupoMateriaQueueService.updateBoletaGrupoMateria(
        id,
        updateBoletaGrupoMateriaDto,
      );
    return {
      ...result,
      message: 'Job encolado para actualizar boleta grupo materia',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar boleta grupo materia (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar boleta grupo materia',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.boletaGrupoMateriaQueueService.deleteBoletaGrupoMateria(id);
    return {
      ...result,
      message: 'Job encolado para eliminar boleta grupo materia',
    };
  }
}
