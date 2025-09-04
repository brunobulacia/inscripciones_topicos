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

  @Post()
  @ApiOperation({ summary: 'Crear nuevo periodo' })
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
  @ApiResponse({ status: 201, description: 'Periodo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'El periodo ya existe para esta gestión',
  })
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoQueueService.enqueueCreatePeriodo(createPeriodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los periodos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de periodos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          numero: { type: 'string' },
          fechaInicio: { type: 'string', format: 'date-time' },
          fechaFin: { type: 'string', format: 'date-time' },
          gestionId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.periodoQueueService.enqueueFindAllPeriodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener periodo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Periodo encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        numero: { type: 'string' },
        fechaInicio: { type: 'string', format: 'date-time' },
        fechaFin: { type: 'string', format: 'date-time' },
        gestionId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.periodoQueueService.enqueueFindOnePeriodo({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar periodo' })
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
  @ApiResponse({ status: 200, description: 'Periodo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoQueueService.enqueueUpdatePeriodo({
      id,
      ...updatePeriodoDto,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar periodo' })
  @ApiParam({
    name: 'id',
    description: 'ID del periodo',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Periodo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  remove(@Param('id') id: string) {
    return this.periodoQueueService.enqueueDeletePeriodo({ id });
  }
}
