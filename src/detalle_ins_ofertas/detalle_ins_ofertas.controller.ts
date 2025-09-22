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
import { DetalleInsOfertasService } from './detalle_ins_ofertas.service';
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

@ApiTags('detalle-ins-ofertas')
@ApiBearerAuth()
@Controller('detalle-ins-ofertas')
export class DetalleInsOfertasController {
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los detalles ins ofertas',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalles ins ofertas obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          detalleInscripcionId: {
            type: 'string',
            example: 'uuid-detalle-inscripcion',
          },
          ofertaGrupoMateriaId: {
            type: 'string',
            example: 'uuid-oferta-grupo-materia',
          },
          estado: { type: 'string', example: 'PENDIENTE' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.detalleInsOfertasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle ins oferta por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        detalleInscripcionId: {
          type: 'string',
          example: 'uuid-detalle-inscripcion',
        },
        ofertaGrupoMateriaId: {
          type: 'string',
          example: 'uuid-oferta-grupo-materia',
        },
        estado: { type: 'string', example: 'PENDIENTE' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  findOne(@Param('id') id: string) {
    return this.detalleInsOfertasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo detalle ins oferta' })
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
    description: 'Detalle ins oferta creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        detalleInscripcionId: {
          type: 'string',
          example: 'uuid-detalle-inscripcion',
        },
        ofertaGrupoMateriaId: {
          type: 'string',
          example: 'uuid-oferta-grupo-materia',
        },
        estado: { type: 'string', example: 'PENDIENTE' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDetalleInsOfertaDto: CreateDetalleInsOfertaDto) {
    return this.detalleInsOfertasService.create(createDetalleInsOfertaDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle ins oferta' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
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
    description: 'Detalle ins oferta actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        detalleInscripcionId: {
          type: 'string',
          example: 'uuid-detalle-inscripcion',
        },
        ofertaGrupoMateriaId: {
          type: 'string',
          example: 'uuid-oferta-grupo-materia',
        },
        estado: { type: 'string', example: 'APROBADO' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateDetalleInsOfertaDto: UpdateDetalleInsOfertaDto,
  ) {
    return this.detalleInsOfertasService.update(id, updateDetalleInsOfertaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle ins oferta' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Detalle ins oferta eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  remove(@Param('id') id: string) {
    return this.detalleInsOfertasService.remove(id);
  }

  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo detalle ins oferta (asíncrono)' })
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
    description: 'Detalle ins oferta creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createDetalleInsOfertaDto: CreateDetalleInsOfertaDto,
  ) {
    return this.detalleInsOfertasService.create(createDetalleInsOfertaDto);
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todos los detalles ins ofertas (asíncrono)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalles ins ofertas obtenidos exitosamente',
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.detalleInsOfertasService.findAll();
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener detalle ins oferta por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta obtenido exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    return this.detalleInsOfertasService.findOne(id);
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar detalle ins oferta (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
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
    description: 'Detalle ins oferta actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateDetalleInsOfertaDto: UpdateDetalleInsOfertaDto,
  ) {
    return this.detalleInsOfertasService.update(id, updateDetalleInsOfertaDto);
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar detalle ins oferta (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del detalle ins oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle ins oferta eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  async removeQueue(@Param('id') id: string) {
    return this.detalleInsOfertasService.remove(id);
  }
}
