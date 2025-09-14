import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PeriodosService } from './periodos.service';
import { PeriodoQueueService } from './services/periodo-queue.service';
import type { CreatePeriodoDto } from './dto/create-periodo.dto';
import type { UpdatePeriodoDto } from './dto/update-periodo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('periodos')
@ApiBearerAuth()
@Controller('periodos')
export class PeriodosController {
  constructor(
    private readonly periodoService: PeriodosService,
    private readonly periodoQueueService: PeriodoQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los periodos (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de periodos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          numero: { type: 'string', example: 'I-2024' },
          fechaInicio: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-01T00:00:00Z',
          },
          fechaFin: {
            type: 'string',
            format: 'date-time',
            example: '2024-07-31T23:59:59Z',
          },
          gestionId: { type: 'string', example: 'uuid-gestion' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.periodoService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener periodo por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Periodo obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo periodo (sincrónico)' })
  @ApiBody({
    description: 'Datos del periodo a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Periodo creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'El periodo ya existe para esta gestión',
  })
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar periodo (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del periodo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Periodo actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoService.update(id, updatePeriodoDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar periodo (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Periodo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Periodo eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  remove(@Param('id') id: string) {
    return this.periodoService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo periodo (asíncrono)' })
  @ApiBody({
    description: 'Datos del periodo a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear periodo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear periodo' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'El periodo ya existe para esta gestión',
  })
  async createQueue(@Body() createPeriodoDto: CreatePeriodoDto) {
    const result =
      await this.periodoQueueService.enqueueCreatePeriodo(createPeriodoDto);
    return {
      ...result,
      message: 'Job encolado para crear periodo',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los periodos (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener periodos',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener periodos',
        },
      },
    },
  })
  async findAllQueue() {
    const result = await this.periodoQueueService.enqueueFindAllPeriodos();
    return {
      ...result,
      message: 'Job encolado para obtener periodos',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener periodo por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener periodo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener periodo',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.periodoQueueService.enqueueFindOnePeriodo({ id });
    return {
      ...result,
      message: 'Job encolado para obtener periodo',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar periodo (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del periodo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'string', example: 'I-2024' },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-01T00:00:00Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-31T23:59:59Z',
        },
        gestionId: { type: 'string', example: 'uuid-gestion' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar periodo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar periodo',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updatePeriodoDto: UpdatePeriodoDto,
  ) {
    const result = await this.periodoQueueService.enqueueUpdatePeriodo({
      id,
      ...updatePeriodoDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar periodo',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar periodo (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar periodo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar periodo',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result = await this.periodoQueueService.enqueueDeletePeriodo({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar periodo',
    };
  }
}
