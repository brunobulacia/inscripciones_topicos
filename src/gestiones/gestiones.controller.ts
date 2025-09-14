import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import { GestionQueueService } from './services/gestion-queue.service';
import type { CreateGestionDto } from './dto/create-gestion.dto';
import type { UpdateGestionDto } from './dto/update-gestion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('gestiones')
@ApiBearerAuth()
@Controller('gestiones')
export class GestionesController {
  constructor(
    private readonly gestionService: GestionesService,
    private readonly gestionQueueService: GestionQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todas las gestiones (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Gestiones obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          año: { type: 'string', example: '2024' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.gestionService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener gestión por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.gestionService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva gestión (sincrónico)' })
  @ApiBody({
    description: 'Datos de la nueva gestión',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createGestionDto: CreateGestionDto) {
    return this.gestionService.create(createGestionDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar gestión (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la gestión',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateGestionDto: UpdateGestionDto) {
    return this.gestionService.update(id, updateGestionDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar gestión (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Gestión eliminada exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.gestionService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva gestión (asíncrono)' })
  @ApiBody({
    description: 'Datos de la gestión a crear',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear gestión' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createGestionDto: CreateGestionDto) {
    const result = await this.gestionQueueService.enqueueCreateGestion({
      año: createGestionDto.año,
      estaActivo: createGestionDto.estaActivo,
    });
    return {
      jobId: result.jobId,
      message: 'Job encolado para crear gestión',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todas las gestiones (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener gestiones',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener gestiones',
        },
      },
    },
  })
  async findAllQueue() {
    const result = await this.gestionQueueService.enqueueFindAllGestiones();
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener gestiones',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener gestión por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener gestión',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener gestión',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.gestionQueueService.enqueueFindOneGestion({ id });
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener gestión',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar gestión (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la gestión',
    schema: {
      type: 'object',
      properties: {
        año: { type: 'string', example: '2024' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar gestión',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar gestión',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateGestionDto: UpdateGestionDto,
  ) {
    const result = await this.gestionQueueService.enqueueUpdateGestion({
      id,
      ...updateGestionDto,
    });
    return {
      jobId: result.jobId,
      message: 'Job encolado para actualizar gestión',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar gestión (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar gestión',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar gestión',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result = await this.gestionQueueService.enqueueDeleteGestion({ id });
    return {
      jobId: result.jobId,
      message: 'Job encolado para eliminar gestión',
    };
  }
}
