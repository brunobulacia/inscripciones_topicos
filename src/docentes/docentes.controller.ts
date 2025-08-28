import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocentesService } from './docentes.service';
import type { CreateDocenteDto } from './dto/create-docente.dto';
import type { UpdateDocenteDto } from './dto/update-docente.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('docentes')
@ApiBearerAuth()
@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo docente' })
  @ApiBody({
    description: 'Datos del docente a crear',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'María' },
        apellido_paterno: { type: 'string', example: 'López' },
        apellido_materno: { type: 'string', example: 'Fernández' },
        ci: { type: 'string', example: '87654321' },
        registro: { type: 'string', example: 'DOC001' },
        email: { type: 'string', example: 'maria.lopez@universidad.edu' },
        telefono: { type: 'string', example: '71234567' },
        password: { type: 'string', example: 'docPassword123' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Docente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El docente ya existe' })
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los docentes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de docentes',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          apellido_paterno: { type: 'string' },
          apellido_materno: { type: 'string' },
          ci: { type: 'string' },
          registro: { type: 'string' },
          email: { type: 'string' },
          telefono: { type: 'string' },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.docentesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener docente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Docente encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        nombre: { type: 'string' },
        apellido_paterno: { type: 'string' },
        apellido_materno: { type: 'string' },
        ci: { type: 'string' },
        registro: { type: 'string' },
        email: { type: 'string' },
        telefono: { type: 'string' },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Docente no encontrado' })
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar docente' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del docente',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'María' },
        apellido_paterno: { type: 'string', example: 'López' },
        apellido_materno: { type: 'string', example: 'Fernández' },
        ci: { type: 'string', example: '87654321' },
        registro: { type: 'string', example: 'DOC001' },
        email: { type: 'string', example: 'maria.lopez@universidad.edu' },
        telefono: { type: 'string', example: '71234567' },
        password: { type: 'string', example: 'docPassword123' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Docente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Docente no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docentesService.update(id, updateDocenteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar docente' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({ status: 200, description: 'Docente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Docente no encontrado' })
  remove(@Param('id') id: string) {
    return this.docentesService.remove(id);
  }
}
