import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CarreraQueueService } from './services/carrera-queue.service';
import type { CreateCarreraDto } from './dto/create-carrera.dto';
import type { UpdateCarreraDto } from './dto/update-carrera.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('carreras')
@ApiBearerAuth()
@Controller('carreras')
export class CarrerasController {
  constructor(
    private readonly carrerasService: CarrerasService,
    private readonly carreraQueueService: CarreraQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todas las carreras (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Carreras obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          codigo: { type: 'number', example: 1 },
          nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
          estaActivo: { type: 'boolean', example: true },
        },
      },
    },
  })
  findAll() {
    return this.carrerasService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener carrera por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrera obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.carrerasService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva carrera (sincrónico)' })
  @ApiBody({
    description: 'Datos de la nueva carrera',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createCarreraDto: CreateCarreraDto) {
    return this.carrerasService.create(createCarreraDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar carrera (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la carrera',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Carrera actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateCarreraDto: UpdateCarreraDto) {
    return this.carrerasService.update(id, updateCarreraDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar carrera (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrera eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Carrera eliminada exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.carrerasService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva carrera (asíncrono)' })
  @ApiBody({
    description: 'Datos de la carrera a crear',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
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
        message: { type: 'string', example: 'Job encolado para crear carrera' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createCarreraDto: CreateCarreraDto) {
    const result =
      await this.carreraQueueService.createCarrera(createCarreraDto);
    return {
      ...result,
      message: 'Job encolado para crear carrera',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todas las carreras (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener carreras',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener carreras',
        },
      },
    },
  })
  async findAllQueue() {
    const result = await this.carreraQueueService.findAllCarreras();
    return {
      ...result,
      message: 'Job encolado para obtener carreras',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener carrera por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener carrera',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.carreraQueueService.findOneCarrera({ id });
    return {
      ...result,
      message: 'Job encolado para obtener carrera',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar carrera (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la carrera',
    schema: {
      type: 'object',
      properties: {
        codigo: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Ingeniería de Sistemas' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar carrera',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateCarreraDto: UpdateCarreraDto,
  ) {
    const result = await this.carreraQueueService.updateCarrera({
      id,
      ...updateCarreraDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar carrera',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar carrera (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la carrera',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar carrera',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar carrera',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result = await this.carreraQueueService.deleteCarrera({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar carrera',
    };
  }
}
