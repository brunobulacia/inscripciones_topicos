import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NivelesService } from './niveles.service';
import { NivelQueueService } from './services/nivel-queue.service';
import type { CreateNivelDto } from './dto/create-nivele.dto';
import type { UpdateNivelDto } from './dto/update-nivele.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('niveles')
@ApiBearerAuth()
@Controller('niveles')
export class NivelesController {
  constructor(
    private readonly nivelesService: NivelesService,
    private readonly nivelQueueService: NivelQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo nivel académico (asíncrono)' })
  @ApiBody({
    description: 'Datos del nivel académico a crear',
    schema: {
      type: 'object',
      properties: {
        semestre: { type: 'number', example: 1 },
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
        message: {
          type: 'string',
          example: 'Job encolado para crear nivel académico',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createNivelDto: CreateNivelDto) {
    const result = await this.nivelQueueService.createNivel(createNivelDto);
    return {
      ...result,
      message: 'Job encolado para crear nivel académico',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los niveles académicos (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener niveles académicos',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener niveles académicos',
        },
      },
    },
  })
  async findAll() {
    const result = await this.nivelQueueService.findAllNiveles();
    return {
      ...result,
      message: 'Job encolado para obtener niveles académicos',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener nivel académico por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener nivel académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener nivel académico',
        },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const result = await this.nivelQueueService.findOneNivel({ id });
    return {
      ...result,
      message: 'Job encolado para obtener nivel académico',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nivel académico (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del nivel académico',
    schema: {
      type: 'object',
      properties: {
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar nivel académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar nivel académico',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateNivelDto: UpdateNivelDto,
  ) {
    const result = await this.nivelQueueService.updateNivel({
      id,
      ...updateNivelDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar nivel académico',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar nivel académico (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar nivel académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar nivel académico',
        },
      },
    },
  })
  async remove(@Param('id') id: string) {
    const result = await this.nivelQueueService.deleteNivel({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar nivel académico',
    };
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Ver estadísticas de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de la cola de niveles académicos',
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
    return await this.nivelQueueService.getQueueStats();
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
    return await this.nivelQueueService.clearQueue();
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
    return await this.nivelQueueService.getJobResult(jobId);
  }
}
