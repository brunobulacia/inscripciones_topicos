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
}
