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
import type { CreateMateriaDto } from './dto/create-materia.dto';
import type { UpdateMateriaDto } from './dto/update-materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MateriaQueueService } from './services/materia-queue.service';

@ApiTags('materias')
@ApiBearerAuth()
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiaQueueService: MateriaQueueService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva materia (encolar)' })
  @ApiBody({
    description: 'Datos de la materia a crear',
    schema: {
      type: 'object',
      properties: {
        sigla: { type: 'string', example: 'MAT101' },
        nombre: { type: 'string', example: 'Matemáticas I' },
        creditos: { type: 'number', example: 4 },
        esElectiva: { type: 'boolean', example: false },
        estaActiva: { type: 'boolean', example: true },
        nivelId: { type: 'string', example: 'uuid-nivel' },
        planDeEstudioId: { type: 'string', example: 'uuid-plan' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Materia encolada para creación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaQueueService.createMateria(createMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias (encolar)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de materias encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.materiaQueueService.findAllMaterias({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener materia por ID (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda de materia encolada',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.materiaQueueService.findOneMateria(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la materia',
    schema: {
      type: 'object',
      properties: {
        sigla: { type: 'string', example: 'MAT101' },
        nombre: { type: 'string', example: 'Matemáticas I' },
        creditos: { type: 'number', example: 4 },
        esElectiva: { type: 'boolean', example: false },
        estaActiva: { type: 'boolean', example: true },
        nivelId: { type: 'string', example: 'uuid-nivel' },
        planDeEstudioId: { type: 'string', example: 'uuid-plan' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Materia encolada para actualización',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
  ) {
    return this.materiaQueueService.updateMateria(id, updateMateriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar materia (encolar)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Materia encolada para eliminación',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  async remove(@Param('id') id: string) {
    return this.materiaQueueService.deleteMateria(id);
  }
}
