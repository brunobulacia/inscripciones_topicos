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
  constructor(private readonly nivelesService: NivelesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo nivel académico' })
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
    status: 201,
    description: 'Nivel académico creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los niveles académicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de niveles académicos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          semestre: { type: 'number' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.nivelesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener nivel académico por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel académico encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        semestre: { type: 'number' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Nivel académico no encontrado' })
  findOne(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nivel académico' })
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
    status: 200,
    description: 'Nivel académico actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Nivel académico no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateNivelDto: UpdateNivelDto) {
    return this.nivelesService.update(id, updateNivelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar nivel académico' })
  @ApiParam({
    name: 'id',
    description: 'ID del nivel académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel académico eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Nivel académico no encontrado' })
  remove(@Param('id') id: string) {
    return this.nivelesService.remove(id);
  }
}
