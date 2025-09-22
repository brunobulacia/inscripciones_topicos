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
  constructor(private readonly modulosService: ModulosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({
    status: 200,
    description: 'Módulos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          numero: { type: 'number', example: 1 },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.modulosService.findAll();
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
    description: 'Módulo obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo módulo' })
  @ApiBody({
    description: 'Datos del nuevo módulo',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
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
  @ApiResponse({
    status: 200,
    description: 'Módulo actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Módulo eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.modulosService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync() {
    return this.modulosService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.modulosService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateModuloDto: UpdateModuloDto,
  ) {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.modulosService.remove(id);
  }
}
