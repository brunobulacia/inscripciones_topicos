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

  //METODOS DIRECTOS
  @Get()
  @ApiOperation({ summary: 'Obtener todas las aulas' })
  @ApiResponse({
    status: 200,
    description: 'Aulas obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          numero: { type: 'number', example: 101 },
          capacidad: { type: 'number', example: 30 },
          aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
          moduloId: { type: 'string', example: 'uuid-modulo' },
          estaActivo: { type: 'boolean', example: true },
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
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva aula' })
  @ApiBody({
    description: 'Datos de la nueva aula',
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
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar aula' })
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Aula actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        numero: { type: 'number', example: 101 },
        capacidad: { type: 'number', example: 30 },
        aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
        moduloId: { type: 'string', example: 'uuid-modulo' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar aula' })
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Aula eliminada exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.aulaService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva aula (asíncrono)' })
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
  @ApiResponse({
    status: 201,
    description: 'Aula creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todas las aulas (asíncrono)' })
  @ApiResponse({
    status: 200,
    description: 'Aulas obtenidas exitosamente',
  })
  async findAllQueue() {
    return this.aulaService.findAll();
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener aula por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula obtenida exitosamente',
  })
  async findOneQueue(@Param('id') id: string) {
    return this.aulaService.findOne(id);
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar aula (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Aula actualizada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateAulaDto: UpdateAulaDto,
  ) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar aula (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula eliminada exitosamente',
  })
  async removeQueue(@Param('id') id: string) {
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
