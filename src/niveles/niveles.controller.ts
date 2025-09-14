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

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todos los niveles académicos (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Niveles académicos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          semestre: { type: 'number', example: 1 },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.nivelesService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener nivel académico por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel académico obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo nivel académico (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo nivel académico',
    schema: {
      type: 'object',
      properties: {
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar nivel académico (sincrónico)' })
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
    status: 200,
    description: 'Nivel académico actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateNivelDto: UpdateNivelDto) {
    return this.nivelesService.update(id, updateNivelDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar nivel académico (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel académico eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Nivel académico eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.nivelesService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
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
  async createQueue(@Body() createNivelDto: CreateNivelDto) {
    const result = await this.nivelQueueService.createNivel(createNivelDto);
    return {
      ...result,
      message: 'Job encolado para crear nivel académico',
    };
  }

  @Get('/async')
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
  async findAllQueue() {
    const result = await this.nivelQueueService.findAllNiveles();
    return {
      ...result,
      message: 'Job encolado para obtener niveles académicos',
    };
  }

  @Get('/async/:id')
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
  async findOneQueue(@Param('id') id: string) {
    const result = await this.nivelQueueService.findOneNivel({ id });
    return {
      ...result,
      message: 'Job encolado para obtener nivel académico',
    };
  }

  @Patch('/async/:id')
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
  async updateQueue(
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

  @Delete('/async/:id')
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
  async removeQueue(@Param('id') id: string) {
    const result = await this.nivelQueueService.deleteNivel({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar nivel académico',
    };
  }
}
