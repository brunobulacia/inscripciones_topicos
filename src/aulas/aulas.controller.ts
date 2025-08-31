import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AulasService } from './aulas.service';
import type { CreateAulaDto } from './dto/create-aula.dto';
import type { UpdateAulaDto } from './dto/update-aula.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('aulas')
@ApiBearerAuth()
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulaService: AulasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva aula' })
  @ApiBody({
    description: 'Datos del aula a crear',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Aula creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El aula ya existe en este módulo' })
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las aulas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aulas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          numero: { type: 'number' },
          capacidad: { type: 'number' },
          aulaGrupoMateriaId: { type: 'string' },
          moduloId: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener aula por ID' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiResponse({ status: 200, description: 'Aula encontrada' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiBody({
    description: 'Datos a actualizar del aula',
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Aula actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'uuid-example' })
  @ApiResponse({ status: 200, description: 'Aula eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  remove(@Param('id') id: string) {
    return this.aulaService.remove(id);
  }

  //SEEDER
  @Post('seed')
  @ApiOperation({ summary: 'Crear aulas' })
  @ApiResponse({ status: 201, description: 'Aulas creadas exitosamente' })
  seed() {
    return this.aulaService.seedAulas();
  }

  //CLEAR AULAS
  @Post('clear')
  @ApiOperation({ summary: 'Eliminar todas las aulas' })
  @ApiResponse({
    status: 200,
    description: 'Todas las aulas han sido eliminadas',
  })
  clear() {
    return this.aulaService.clearAulas();
  }
}
