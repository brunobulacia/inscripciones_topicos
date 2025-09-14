import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FichasInscripcionService } from './fichas_inscripcion.service';
import type { CreateFichaInscripcionDto } from './dto/create-ficha_inscripcion.dto';
import type { UpdateFichaInscripcionDto } from './dto/update-ficha_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FichaInscripcionQueueService } from './services/ficha-inscripcion-queue.service';

@ApiTags('fichas-inscripcion')
@ApiBearerAuth()
@Controller('fichas-inscripcion')
export class FichasInscripcionController {
  constructor(
    private readonly fichaInscripcionService: FichasInscripcionService,
    private readonly fichaInscripcionQueueService: FichaInscripcionQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todas las fichas de inscripción (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Fichas de inscripción obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          estudianteId: { type: 'string', example: 'uuid-estudiante' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.fichaInscripcionService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener ficha de inscripción por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.fichaInscripcionService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva ficha de inscripción (sincrónico)' })
  @ApiBody({
    description: 'Datos de la ficha de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ficha de inscripción creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'La ficha de inscripción ya existe',
  })
  create(@Body() createFichaInscripcionDto: CreateFichaInscripcionDto) {
    return this.fichaInscripcionService.create(createFichaInscripcionDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar ficha de inscripción (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ) {
    return this.fichaInscripcionService.update(id, updateFichaInscripcionDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar ficha de inscripción (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ficha de inscripción eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.fichaInscripcionService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva ficha de inscripción (asíncrono)' })
  @ApiBody({
    description: 'Datos de la ficha de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear ficha de inscripción',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'La ficha de inscripción ya existe',
  })
  async createQueue(
    @Body() createFichaInscripcionDto: CreateFichaInscripcionDto,
  ) {
    const result =
      await this.fichaInscripcionQueueService.createFichaInscripcion(
        createFichaInscripcionDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear ficha de inscripción',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las fichas de inscripción (asíncrono)',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener fichas de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener fichas de inscripción',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.fichaInscripcionQueueService.findAllFichaInscripcion();
    return {
      ...result,
      message: 'Job encolado para obtener fichas de inscripción',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener ficha de inscripción por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener ficha de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.fichaInscripcionQueueService.findOneFichaInscripcion(id);
    return {
      ...result,
      message: 'Job encolado para obtener ficha de inscripción',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar ficha de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar ficha de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ) {
    const result =
      await this.fichaInscripcionQueueService.updateFichaInscripcion(
        id,
        updateFichaInscripcionDto,
      );
    return {
      ...result,
      message: 'Job encolado para actualizar ficha de inscripción',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar ficha de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar ficha de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.fichaInscripcionQueueService.deleteFichaInscripcion(id);
    return {
      ...result,
      message: 'Job encolado para eliminar ficha de inscripción',
    };
  }
}
