import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import type { CreateEstudianteDto } from './dto/create-estudiante.dto';
import type { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('estudiantes')
@ApiBearerAuth()
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo estudiante' })
  @ApiBody({
    description: 'Datos del estudiante a crear',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Juan' },
        apellido_paterno: { type: 'string', example: 'Pérez' },
        apellido_materno: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '70123456' },
        ci: { type: 'string', example: '12345678' },
        email: { type: 'string', example: 'juan.perez@email.com' },
        matricula: { type: 'string', example: 'EST001' },
        password: { type: 'string', example: 'miPassword123' },
        ppac: { type: 'number', example: 0 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El estudiante ya existe' })
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estudiantes',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          apellido_paterno: { type: 'string' },
          apellido_materno: { type: 'string' },
          telefono: { type: 'string' },
          ci: { type: 'string' },
          email: { type: 'string' },
          matricula: { type: 'string' },
          ppac: { type: 'number' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estudiante por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        nombre: { type: 'string' },
        apellido_paterno: { type: 'string' },
        apellido_materno: { type: 'string' },
        telefono: { type: 'string' },
        ci: { type: 'string' },
        email: { type: 'string' },
        matricula: { type: 'string' },
        ppac: { type: 'number' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estudiante' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del estudiante',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Juan' },
        apellido_paterno: { type: 'string', example: 'Pérez' },
        apellido_materno: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '70123456' },
        ci: { type: 'string', example: '12345678' },
        email: { type: 'string', example: 'juan.perez@email.com' },
        matricula: { type: 'string', example: 'EST001' },
        password: { type: 'string', example: 'miPassword123' },
        ppac: { type: 'number', example: 0 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar estudiante' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
}
