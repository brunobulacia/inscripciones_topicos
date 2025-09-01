import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
} from '@nestjs/swagger';

@ApiTags('detalle-ins-ofertas')
@ApiBearerAuth()
@Controller('detalle-ins-ofertas')
export class DetalleInsOfertasController {
  constructor(
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
  ) {}

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
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDetalleInsOfertaDto: CreateDetalleInsOfertaDto) {
    return this.detalleInsOfertasService.create(createDetalleInsOfertaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles ins ofertas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles ins ofertas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          detalleInscripcionId: { type: 'string' },
          ofertaGrupoMateriaId: { type: 'string' },
          estado: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
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
    description: 'Detalle ins oferta encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        detalleInscripcionId: { type: 'string' },
        ofertaGrupoMateriaId: { type: 'string' },
        estado: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  findOne(@Param('id') id: string) {
    return this.detalleInsOfertasService.findOne(id);
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
  })
  @ApiResponse({ status: 404, description: 'Detalle ins oferta no encontrado' })
  remove(@Param('id') id: string) {
    return this.detalleInsOfertasService.remove(id);
  }
}
