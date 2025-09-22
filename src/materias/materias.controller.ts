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
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('materias')
@ApiBearerAuth()
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias' })
  @ApiResponse({
    status: 200,
    description: 'Materias obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          sigla: { type: 'string', example: 'MAT101' },
          nombre: { type: 'string', example: 'Matemáticas I' },
          creditos: { type: 'number', example: 4 },
          esElectiva: { type: 'boolean', example: false },
          estaActiva: { type: 'boolean', example: true },
          nivelId: { type: 'string', example: 'uuid-nivel' },
          planDeEstudioId: { type: 'string', example: 'uuid-plan' },
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
    description: 'Materia obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        sigla: { type: 'string', example: 'MAT101' },
        nombre: { type: 'string', example: 'Matemáticas I' },
        creditos: { type: 'number', example: 4 },
        esElectiva: { type: 'boolean', example: false },
        estaActiva: { type: 'boolean', example: true },
        nivelId: { type: 'string', example: 'uuid-nivel' },
        planDeEstudioId: { type: 'string', example: 'uuid-plan' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.materiasService.findOne(id);
  }

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
  @ApiResponse({
    status: 201,
    description: 'Materia creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        sigla: { type: 'string', example: 'MAT101' },
        nombre: { type: 'string', example: 'Matemáticas I' },
        creditos: { type: 'number', example: 4 },
        esElectiva: { type: 'boolean', example: false },
        estaActiva: { type: 'boolean', example: true },
        nivelId: { type: 'string', example: 'uuid-nivel' },
        planDeEstudioId: { type: 'string', example: 'uuid-plan' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
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
  @ApiResponse({
    status: 200,
    description: 'Materia actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        sigla: { type: 'string', example: 'MAT101' },
        nombre: { type: 'string', example: 'Matemáticas I' },
        creditos: { type: 'number', example: 4 },
        esElectiva: { type: 'boolean', example: false },
        estaActiva: { type: 'boolean', example: true },
        nivelId: { type: 'string', example: 'uuid-nivel' },
        planDeEstudioId: { type: 'string', example: 'uuid-plan' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Materia eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Materia eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  remove(@Param('id') id: string) {
    return this.materiasService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.materiasService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.materiasService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
  ) {
    return this.materiasService.update(id, updateMateriaDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.materiasService.remove(id);
  }
}
