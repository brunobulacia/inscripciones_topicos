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
import { MateriaQueueService } from './services/materia-queue.service';
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
  constructor(
    private readonly materiasService: MateriasService,
    private readonly materiaQueueService: MateriaQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todas las materias (sincrónico)' })
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

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener materia por ID (sincrónico)' })
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

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nueva materia (sincrónico)' })
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

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar materia (sincrónico)' })
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

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar materia (sincrónico)' })
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

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para crear materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear materia' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createMateriaDto: CreateMateriaDto) {
    const result =
      await this.materiaQueueService.createMateria(createMateriaDto);
    return {
      ...result,
      message: 'Job encolado para crear materia',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todas las materias (asíncrono)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener materias',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener materias',
        },
      },
    },
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.materiaQueueService.findAllMaterias({
      page,
      limit,
    });
    return {
      ...result,
      message: 'Job encolado para obtener materias',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener materia por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.materiaQueueService.findOneMateria(id);
    return {
      ...result,
      message: 'Job encolado para obtener materia',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar materia (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
  ) {
    const result = await this.materiaQueueService.updateMateria(
      id,
      updateMateriaDto,
    );
    return {
      ...result,
      message: 'Job encolado para actualizar materia',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar materia (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar materia',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  async removeQueue(@Param('id') id: string) {
    const result = await this.materiaQueueService.deleteMateria(id);
    return {
      ...result,
      message: 'Job encolado para eliminar materia',
    };
  }
}
