import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DetallesInscripcionService } from './detalles_inscripcion.service';
import { DetalleInscripcionQueueService } from './services/detalle-inscripcion-queue.service';
import type { CreateDetalleInscripcionDto } from './dto/create-detalle_inscripcion.dto';
import type { UpdateDetalleInscripcionDto } from './dto/update-detalle_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('detalles-inscripcion')
@ApiBearerAuth()
@Controller('detalles-inscripcion')
export class DetallesInscripcionController {
  constructor(
    private readonly detallesInscripcionService: DetallesInscripcionService,
    private readonly detalleInscripcionQueueService: DetalleInscripcionQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todos los detalles de inscripción (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de inscripción obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
          tipo: { type: 'string', example: 'regular' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.detallesInscripcionService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({
    summary: 'Obtener detalle de inscripción por ID (sincrónico)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de inscripción obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.detallesInscripcionService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo detalle de inscripción (sincrónico)' })
  @ApiBody({
    description: 'Datos del detalle de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle de inscripción creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDetalleInscripcionDto: CreateDetalleInscripcionDto) {
    return this.detallesInscripcionService.create(createDetalleInscripcionDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar detalle de inscripción (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de inscripción actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateDetalleInscripcionDto: UpdateDetalleInscripcionDto,
  ) {
    return this.detallesInscripcionService.update(
      id,
      updateDetalleInscripcionDto,
    );
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar detalle de inscripción (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de inscripción eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Detalle de inscripción eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.detallesInscripcionService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo detalle de inscripción (asíncrono)' })
  @ApiBody({
    description: 'Datos del detalle de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear detalle de inscripción',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createDetalleInscripcionDto: CreateDetalleInscripcionDto,
  ) {
    const result =
      await this.detalleInscripcionQueueService.createDetalleInscripcion(
        createDetalleInscripcionDto,
      );
    return {
      ...result,
      message: 'Job encolado para crear detalle de inscripción',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todos los detalles de inscripción (asíncrono)',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener detalles de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener detalles de inscripción',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.detalleInscripcionQueueService.findAllDetalleInscripciones();
    return {
      ...result,
      message: 'Job encolado para obtener detalles de inscripción',
    };
  }

  @Get('/async/:id')
  @ApiOperation({
    summary: 'Obtener detalle de inscripción por ID (asíncrono)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener detalle de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.detalleInscripcionQueueService.findOneDetalleInscripcion(id);
    return {
      ...result,
      message: 'Job encolado para obtener detalle de inscripción',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar detalle de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        tipo: { type: 'string', example: 'regular' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar detalle de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateDetalleInscripcionDto: UpdateDetalleInscripcionDto,
  ) {
    const result =
      await this.detalleInscripcionQueueService.updateDetalleInscripcion(
        id,
        updateDetalleInscripcionDto,
      );
    return {
      ...result,
      message: 'Job encolado para actualizar detalle de inscripción',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar detalle de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar detalle de inscripción',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar detalle de inscripción',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle de inscripción no encontrado',
  })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.detalleInscripcionQueueService.deleteDetalleInscripcion(id);
    return {
      ...result,
      message: 'Job encolado para eliminar detalle de inscripción',
    };
  }
}
