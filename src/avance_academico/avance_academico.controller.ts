import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AvanceAcademicoService } from './avance_academico.service';
import type { CreateAvanceAcademicoDto } from './dto/create-avance_academico.dto';
import type { UpdateAvanceAcademicoDto } from './dto/update-avance_academico.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AvanceAcademicoQueueService } from './services/avance-academico-queue.service';

@ApiTags('avance-academico')
@ApiBearerAuth()
@Controller('avances-academicos')
export class AvanceAcademicoController {
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
    private readonly avanceAcademicoQueueService: AvanceAcademicoQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todos los avances académicos (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Avances académicos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          estudianteId: {
            type: 'string',
            example: 'uuid-estudiante',
            nullable: true,
          },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.avanceAcademicoService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener avance académico por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Avance académico obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  findOne(@Param('id') id: string) {
    return this.avanceAcademicoService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo avance académico (sincrónico)' })
  @ApiBody({
    description: 'Datos del avance académico a crear',
    schema: {
      type: 'object',
      properties: {
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avance académico creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAvanceAcademicoDto: CreateAvanceAcademicoDto) {
    return this.avanceAcademicoService.create(createAvanceAcademicoDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar avance académico (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del avance académico',
    schema: {
      type: 'object',
      properties: {
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avance académico actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ) {
    return this.avanceAcademicoService.update(id, updateAvanceAcademicoDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar avance académico (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Avance académico eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Avance académico eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  remove(@Param('id') id: string) {
    return this.avanceAcademicoService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo avance académico (asíncrono)' })
  @ApiBody({
    description: 'Datos del avance académico a crear',
    schema: {
      type: 'object',
      properties: {
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear avance académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear avance académico',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createAvanceAcademicoDto: CreateAvanceAcademicoDto,
  ) {
    const result = await this.avanceAcademicoQueueService.createAvanceAcademico(
      createAvanceAcademicoDto,
    );
    return {
      ...result,
      message: 'Job encolado para crear avance académico',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los avances académicos (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener avances académicos',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener avances académicos',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.avanceAcademicoQueueService.findAllAvanceAcademico();
    return {
      ...result,
      message: 'Job encolado para obtener avances académicos',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener avance académico por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener avance académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener avance académico',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.avanceAcademicoQueueService.findOneAvanceAcademico(id);
    return {
      ...result,
      message: 'Job encolado para obtener avance académico',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar avance académico (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del avance académico',
    schema: {
      type: 'object',
      properties: {
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar avance académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar avance académico',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ) {
    const result = await this.avanceAcademicoQueueService.updateAvanceAcademico(
      id,
      updateAvanceAcademicoDto,
    );
    return {
      ...result,
      message: 'Job encolado para actualizar avance académico',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar avance académico (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar avance académico',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar avance académico',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.avanceAcademicoQueueService.deleteAvanceAcademico(id);
    return {
      ...result,
      message: 'Job encolado para eliminar avance académico',
    };
  }
}
