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

  @Get()
  @ApiOperation({ summary: 'Obtener todos los niveles académicos' })
  @ApiResponse({
    status: 200,
    description: 'Niveles académicos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          semestre: { type: 'number', example: 1 },
          estaActivo: { type: 'boolean', example: true },
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
    description: 'Nivel académico obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo nivel académico' })
  @ApiBody({
    description: 'Datos del nuevo nivel académico',
    schema: {
      type: 'object',
      properties: {
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        semestre: { type: 'number', example: 1 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
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
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Nivel académico eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.nivelesService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync() {
    return this.nivelesService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
  }

  @Patch('/async/:id')
  updateAsync(@Param('id') id: string, @Body() updateNivelDto: UpdateNivelDto) {
    return this.nivelesService.update(id, updateNivelDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.nivelesService.remove(id);
  }
}
