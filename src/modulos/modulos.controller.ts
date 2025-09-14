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

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los módulos (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Módulos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          numero: { type: 'number', example: 1 },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.modulosService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener módulo por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo módulo (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo módulo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar módulo (sincrónico)' })
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
  @ApiResponse({
    status: 200,
    description: 'Módulo actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar módulo (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Módulo eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.modulosService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo módulo (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Job encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear módulo' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createModuloDto: CreateModuloDto) {
    const result = await this.moduloQueueService.enqueueCreateModulo({
      numero: createModuloDto.numero,
    });
    return {
      ...result,
      message: 'Job encolado para crear módulo',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los módulos (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener módulos',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener módulos',
        },
      },
    },
  })
  async findAllQueue() {
    const result = await this.moduloQueueService.enqueueFindAllModulos();
    return {
      ...result,
      message: 'Job encolado para obtener módulos',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener módulo por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener módulo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener módulo',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.moduloQueueService.enqueueFindOneModulo({ id });
    return {
      ...result,
      message: 'Job encolado para obtener módulo',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar módulo (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar módulo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar módulo',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateModuloDto: UpdateModuloDto,
  ) {
    const result = await this.moduloQueueService.enqueueUpdateModulo({
      id,
      ...updateModuloDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar módulo',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar módulo (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar módulo',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar módulo',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result = await this.moduloQueueService.enqueueDeleteModulo({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar módulo',
    };
  }
}
