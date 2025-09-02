import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CarreraQueueService } from './services/carrera-queue.service';
import type { CreateCarreraDto } from './dto/create-carrera.dto';
import type { UpdateCarreraDto } from './dto/update-carrera.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('carreras')
@ApiBearerAuth()
@Controller('carreras')
export class CarrerasController {
  constructor(
    private readonly carrerasService: CarrerasService,
    private readonly carreraQueueService: CarreraQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva carrera (asíncrono)' })
  @ApiBody({
    description: 'Datos de la carrera a crear',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
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
        message: { type: 'string', example: 'Job encolado para crear carrera' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createCarreraDto: CreateCarreraDto) {
    const result =
      await this.carreraQueueService.createCarrera(createCarreraDto);
    return {
      ...result,
      message: 'Job encolado para crear carrera',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las carreras (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener carreras',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener carreras',
        },
      },
    },
  })
  async findAll() {
    const result = await this.carreraQueueService.findAllCarreras();
    return {
      ...result,
      message: 'Job encolado para obtener carreras',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrera por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener carrera',
        },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const result = await this.carreraQueueService.findOneCarrera({ id });
    return {
      ...result,
      message: 'Job encolado para obtener carrera',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrera (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la carrera',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar carrera',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateCarreraDto: UpdateCarreraDto,
  ) {
    const result = await this.carreraQueueService.updateCarrera({
      id,
      ...updateCarreraDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar carrera',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrera (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar carrera',
        },
      },
    },
  })
  async remove(@Param('id') id: string) {
    const result = await this.carreraQueueService.deleteCarrera({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar carrera',
    };
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Ver estadísticas de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de la cola de carreras',
    schema: {
      type: 'object',
      properties: {
        stats: {
          type: 'object',
          properties: {
            waiting: { type: 'number', example: 5 },
            active: { type: 'number', example: 2 },
            completed: { type: 'number', example: 15 },
            failed: { type: 'number', example: 1 },
          },
        },
        jobs: {
          type: 'object',
          properties: {
            waiting: { type: 'array', items: { type: 'object' } },
            active: { type: 'array', items: { type: 'object' } },
            recent_completed: { type: 'array', items: { type: 'object' } },
            recent_failed: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  })
  async getQueueStats() {
    return await this.carreraQueueService.getQueueStats();
  }

  @Post('queue/clear')
  @ApiOperation({ summary: 'Limpiar la cola' })
  @ApiResponse({
    status: 200,
    description: 'Cola limpiada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cola limpiada exitosamente' },
      },
    },
  })
  async clearQueue() {
    return await this.carreraQueueService.clearQueue();
  }

  // Endpoint para consultar el estado de un job
  @Get('jobs/:jobId/status')
  @ApiOperation({ summary: 'Consultar estado de un job' })
  @ApiParam({
    name: 'jobId',
    description: 'ID del job',
    example: 'job-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del job',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['waiting', 'processing', 'completed', 'failed', 'not_found'],
          example: 'completed',
        },
        data: {
          type: 'object',
          description: 'Resultado del job (si está completado)',
        },
        error: { type: 'string', description: 'Error del job (si falló)' },
      },
    },
  })
  async getJobStatus(@Param('jobId') jobId: string) {
    return await this.carreraQueueService.getJobResult(jobId);
  }
}
