import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MaestroDeOfertasService } from './maestro_de_ofertas.service';
import type { CreateMaestroDeOfertaDto } from './dto/create-maestro_de_oferta.dto';
import type { UpdateMaestroDeOfertaDto } from './dto/update-maestro_de_oferta.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MaestroDeOfertaQueueService } from './services/maestro-de-oferta-queue.service';

@ApiTags('maestro-de-ofertas')
@ApiBearerAuth()
@Controller('maestro-de-ofertas')
export class MaestroDeOfertasController {
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
    private readonly maestroDeOfertaQueueService: MaestroDeOfertaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({
    summary: 'Obtener todos los maestros de ofertas (sincrónico)',
  })
  @ApiResponse({
    status: 200,
    description: 'Maestros de ofertas obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          periodoId: { type: 'string', example: 'uuid-periodo' },
          estudianteId: { type: 'string', example: 'uuid-estudiante' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.maestroDeOfertasService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener maestro de oferta por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  findOne(@Param('id') id: string) {
    return this.maestroDeOfertasService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo maestro de oferta (sincrónico)' })
  @ApiBody({
    description: 'Datos del maestro de oferta a crear',
    schema: {
      type: 'object',
      properties: {
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Maestro de oferta creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createMaestroDeOfertaDto: CreateMaestroDeOfertaDto) {
    return this.maestroDeOfertasService.create(createMaestroDeOfertaDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar maestro de oferta (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateMaestroDeOfertaDto: UpdateMaestroDeOfertaDto,
  ) {
    return this.maestroDeOfertasService.update(id, updateMaestroDeOfertaDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar maestro de oferta (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Maestro de oferta eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  remove(@Param('id') id: string) {
    return this.maestroDeOfertasService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo maestro de oferta (asíncrono)' })
  @ApiBody({
    description: 'Datos del maestro de oferta a crear',
    schema: {
      type: 'object',
      properties: {
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear maestro de oferta',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createMaestroDeOfertaDto: CreateMaestroDeOfertaDto,
  ) {
    const result = await this.maestroDeOfertaQueueService.createMaestroDeOferta(
      createMaestroDeOfertaDto,
    );
    return {
      ...result,
      message: 'Job encolado para crear maestro de oferta',
    };
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todos los maestros de ofertas (asíncrono)',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener maestros de ofertas',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener maestros de ofertas',
        },
      },
    },
  })
  async findAllQueue() {
    const result =
      await this.maestroDeOfertaQueueService.findAllMaestroDeOfertas();
    return {
      ...result,
      message: 'Job encolado para obtener maestros de ofertas',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener maestro de oferta por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener maestro de oferta',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result =
      await this.maestroDeOfertaQueueService.findOneMaestroDeOferta(id);
    return {
      ...result,
      message: 'Job encolado para obtener maestro de oferta',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar maestro de oferta (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        periodoId: { type: 'string', example: 'uuid-periodo' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar maestro de oferta',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateMaestroDeOfertaDto: UpdateMaestroDeOfertaDto,
  ) {
    const result = await this.maestroDeOfertaQueueService.updateMaestroDeOferta(
      id,
      updateMaestroDeOfertaDto,
    );
    return {
      ...result,
      message: 'Job encolado para actualizar maestro de oferta',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar maestro de oferta (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar maestro de oferta',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar maestro de oferta',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result =
      await this.maestroDeOfertaQueueService.deleteMaestroDeOferta(id);
    return {
      ...result,
      message: 'Job encolado para eliminar maestro de oferta',
    };
  }
}
