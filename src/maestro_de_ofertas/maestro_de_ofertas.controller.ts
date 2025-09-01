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

@ApiTags('maestro-de-ofertas')
@ApiBearerAuth()
@Controller('maestro-de-ofertas')
export class MaestroDeOfertasController {
  constructor(
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo maestro de oferta' })
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
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createMaestroDeOfertaDto: CreateMaestroDeOfertaDto) {
    return this.maestroDeOfertasService.create(createMaestroDeOfertaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los maestros de ofertas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de maestros de ofertas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          periodoId: { type: 'string' },
          estudianteId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.maestroDeOfertasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener maestro de oferta por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        periodoId: { type: 'string' },
        estudianteId: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  findOne(@Param('id') id: string) {
    return this.maestroDeOfertasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar maestro de oferta' })
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
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateMaestroDeOfertaDto: UpdateMaestroDeOfertaDto,
  ) {
    return this.maestroDeOfertasService.update(id, updateMaestroDeOfertaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar maestro de oferta' })
  @ApiParam({
    name: 'id',
    description: 'ID del maestro de oferta',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Maestro de oferta eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Maestro de oferta no encontrado' })
  remove(@Param('id') id: string) {
    return this.maestroDeOfertasService.remove(id);
  }
}
