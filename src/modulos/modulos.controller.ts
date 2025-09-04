import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { ModuloQueueService } from './services/modulo-queue.service';
import type { CreateModuloDto } from './dto/create-modulo.dto';
import type { UpdateModuloDto } from './dto/update-modulo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('modulos')
@ApiBearerAuth()
@Controller('modulos')
export class ModulosController {
  constructor(
    private readonly modulosService: ModulosService,
    private readonly moduloQueueService: ModuloQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo módulo' })
  @ApiBody({
    description: 'Datos del módulo a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Módulo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createModuloDto: CreateModuloDto) {
    const job = await this.moduloQueueService.enqueueCreateModulo({
      numero: createModuloDto.numero,
    });
    return { message: 'Módulo encolado para creación', jobId: job.id };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          numero: { type: 'number' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async findAll() {
    const job = await this.moduloQueueService.enqueueFindAllModulos();
    return { message: 'Consulta de módulos encolada', jobId: job.id };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener módulo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        numero: { type: 'number' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  async findOne(@Param('id') id: string) {
    const job = await this.moduloQueueService.enqueueFindOneModulo({ id });
    return { message: 'Consulta de módulo encolada', jobId: job.id };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del módulo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Módulo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateModuloDto: UpdateModuloDto,
  ) {
    const job = await this.moduloQueueService.enqueueUpdateModulo({
      id,
      ...updateModuloDto,
    });
    return { message: 'Actualización de módulo encolada', jobId: job.id };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Módulo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  async remove(@Param('id') id: string) {
    const job = await this.moduloQueueService.enqueueDeleteModulo({ id });
    return { message: 'Eliminación de módulo encolada', jobId: job.id };
  }
}
