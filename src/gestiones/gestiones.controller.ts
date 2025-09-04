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

  @Post()
  @ApiOperation({ summary: 'Crear nueva gestión' })
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
  @ApiResponse({ status: 201, description: 'Gestión creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createGestionDto: CreateGestionDto) {
    const job = await this.gestionQueueService.enqueueCreateGestion({
      año: createGestionDto.año,
      estaActivo: createGestionDto.estaActivo,
    });
    return { message: 'Gestión encolada para creación', jobId: job.id };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las gestiones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gestiones',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          año: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async findAll() {
    const job = await this.gestionQueueService.enqueueFindAllGestiones();
    return { message: 'Consulta de gestiones encolada', jobId: job.id };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gestión por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Gestión encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        año: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  async findOne(@Param('id') id: string) {
    const job = await this.gestionQueueService.enqueueFindOneGestion({ id });
    return { message: 'Consulta de gestión encolada', jobId: job.id };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gestión' })
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
  @ApiResponse({ status: 200, description: 'Gestión actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateGestionDto: UpdateGestionDto,
  ) {
    const job = await this.gestionQueueService.enqueueUpdateGestion({
      id,
      ...updateGestionDto,
    });
    return { message: 'Actualización de gestión encolada', jobId: job.id };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gestión' })
  @ApiParam({
    name: 'id',
    description: 'ID de la gestión',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Gestión eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Gestión no encontrada' })
  async remove(@Param('id') id: string) {
    const job = await this.gestionQueueService.enqueueDeleteGestion({ id });
    return { message: 'Eliminación de gestión encolada', jobId: job.id };
  }
}
