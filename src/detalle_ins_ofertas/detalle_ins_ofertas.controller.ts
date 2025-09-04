import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import type { CreateDetalleInsOfertaDto } from './dto/create-detalle_ins_oferta.dto';
import type { UpdateDetalleInsOfertaDto } from './dto/update-detalle_ins_oferta.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { DetalleInsOfertaQueueService } from './services/detalle-ins-oferta-queue.service';

@ApiTags('detalle-ins-ofertas')
@ApiBearerAuth()
@Controller('detalle-ins-ofertas')
export class DetalleInsOfertasController {
  constructor(
    private readonly detalleInsOfertaQueueService: DetalleInsOfertaQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo detalle ins oferta (encolar)' })
  @ApiBody({
    description: 'Datos del detalle ins oferta a crear',
    schema: {
      type: 'object',
      properties: {
        detalleInscripcionId: {
          type: 'string',
          example: 'uuid-detalle-inscripcion',
        },
        ofertaGrupoMateriaId: {
          type: 'string',
          example: 'uuid-oferta-grupo-materia',
        },
        estado: { type: 'string', example: 'PENDIENTE' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle ins oferta encolado para creación',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createDetalleInsOfertaDto: CreateDetalleInsOfertaDto) {
    return this.detalleInsOfertaQueueService.createDetalleInsOferta(
      createDetalleInsOfertaDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles ins ofertas (encolar)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de detalles ins ofertas encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.detalleInsOfertaQueueService.findAllDetalleInsOfertas({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle ins oferta por ID (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de detalle ins oferta encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.detalleInsOfertaQueueService.findOneDetalleInsOferta(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle ins oferta (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: '1',
  })
  @ApiBody({
    description: 'Datos a actualizar del detalle ins oferta',
    schema: {
      type: 'object',
      properties: {
        detalleInscripcionId: {
          type: 'string',
          example: 'uuid-detalle-inscripcion',
        },
        ofertaGrupoMateriaId: {
          type: 'string',
          example: 'uuid-oferta-grupo-materia',
        },
        estado: { type: 'string', example: 'APROBADO' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta encolado para actualización',
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateDetalleInsOfertaDto: UpdateDetalleInsOfertaDto,
  ) {
    return this.detalleInsOfertaQueueService.updateDetalleInsOferta(
      id,
      updateDetalleInsOfertaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle ins oferta (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta encolado para eliminación',
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  async remove(@Param('id') id: string) {
    return this.detalleInsOfertaQueueService.deleteDetalleInsOferta(id);
  }
}
