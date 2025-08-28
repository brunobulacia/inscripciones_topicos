import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MateriasService } from './materias.service';
import type { CreateMateriaDto } from './dto/create-materia.dto';
import type { UpdateMateriaDto } from './dto/update-materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('materias')
@ApiBearerAuth()
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva materia' })
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
  @ApiResponse({ status: 201, description: 'Materia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La materia ya existe' })
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de materias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          sigla: { type: 'string' },
          nombre: { type: 'string' },
          creditos: { type: 'number' },
          esElectiva: { type: 'boolean' },
          estaActiva: { type: 'boolean' },
          nivelId: { type: 'string' },
          planDeEstudioId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.materiasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Materia encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        sigla: { type: 'string' },
        nombre: { type: 'string' },
        creditos: { type: 'number' },
        esElectiva: { type: 'boolean' },
        estaActiva: { type: 'boolean' },
        nivelId: { type: 'string' },
        planDeEstudioId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.materiasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar materia' })
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
  @ApiResponse({ status: 200, description: 'Materia actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiasService.update(id, updateMateriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Materia eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  remove(@Param('id') id: string) {
    return this.materiasService.remove(id);
  }
}
