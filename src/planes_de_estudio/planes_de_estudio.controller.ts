import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanesDeEstudioService } from './planes_de_estudio.service';
import { PlanDeEstudioQueueService } from './services/plan-de-estudio-queue.service';
import type { CreatePlanDeEstudioDto } from './dto/create-planes_de_estudio.dto';
import type { UpdatePlanDeEstudioDto } from './dto/update-planes_de_estudio.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('planes-de-estudio')
@ApiBearerAuth()
@Controller('planes-de-estudio')
export class PlanesDeEstudioController {
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
    private readonly planDeEstudioQueueService: PlanDeEstudioQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los planes de estudio (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Planes de estudio obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          version: { type: 'number', example: 1 },
          carreraId: { type: 'string', example: 'uuid-carrera' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.planesDeEstudioService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener plan de estudio por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.planesDeEstudioService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo plan de estudio (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo plan de estudio',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    return this.planesDeEstudioService.create(createPlanDeEstudioDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar plan de estudio (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del plan de estudio',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    return this.planesDeEstudioService.update(id, updatePlanDeEstudioDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar plan de estudio (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de estudio eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Plan de estudio eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.planesDeEstudioService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo plan de estudio (asíncrono)' })
  @ApiBody({
    description: 'Datos del plan de estudio a crear',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
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
          example: 'Job encolado para crear plan de estudio',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    const result =
      await this.planDeEstudioQueueService.enqueueCreatePlanDeEstudio(
        createPlanDeEstudioDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear plan de estudio',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los planes de estudio (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener planes de estudio',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener planes de estudio',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.planDeEstudioQueueService.enqueueFindAllPlanesDeEstudio();
    return {
      ...result,
      message: 'Job encolado para obtener planes de estudio',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener plan de estudio por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener plan de estudio',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener plan de estudio',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.planDeEstudioQueueService.enqueueFindOnePlanDeEstudio({ id });
    return {
      ...result,
      message: 'Job encolado para obtener plan de estudio',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar plan de estudio (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del plan de estudio',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'number', example: 1 },
        carreraId: { type: 'string', example: 'uuid-carrera' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar plan de estudio',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar plan de estudio',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    const result =
      await this.planDeEstudioQueueService.enqueueUpdatePlanDeEstudio({
        id,
        ...updatePlanDeEstudioDto,
      });
    return {
      ...result,
      message: 'Job encolado para actualizar plan de estudio',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar plan de estudio (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del plan de estudio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar plan de estudio',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar plan de estudio',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.planDeEstudioQueueService.enqueueDeletePlanDeEstudio({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar plan de estudio',
    };
  }
}
