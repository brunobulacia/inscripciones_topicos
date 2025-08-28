import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ModulosService } from './modulos.service';
import type { CreateModuloDto } from './dto/create-modulo.dto';
import type { UpdateModuloDto } from './dto/update-modulo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('modulos')
@ApiBearerAuth()
@Controller('modulos')
export class ModulosController {
  constructor(private readonly moduloService: ModulosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo módulo' })
  @ApiBody({
    description: 'Datos del módulo a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Módulo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.moduloService.create(createModuloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          numero: { type: 'number' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.moduloService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener módulo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        numero: { type: 'number' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.moduloService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del módulo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Módulo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.moduloService.update(id, updateModuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Módulo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  remove(@Param('id') id: string) {
    return this.moduloService.remove(id);
  }
}
