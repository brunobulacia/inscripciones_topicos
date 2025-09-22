import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FichasInscripcionService } from './fichas_inscripcion.service';
import type { CreateFichaInscripcionDto } from './dto/create-ficha_inscripcion.dto';
import type { UpdateFichaInscripcionDto } from './dto/update-ficha_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('fichas-inscripcion')
@ApiBearerAuth()
@Controller('fichas-inscripcion')
export class FichasInscripcionController {
  constructor(
    private readonly fichasInscripcionService: FichasInscripcionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las fichas de inscripción',
  })
  @ApiResponse({
    status: 200,
    description: 'Fichas de inscripción obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          estudianteId: { type: 'string', example: 'uuid-estudiante' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.fichasInscripcionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ficha de inscripción por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.fichasInscripcionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva ficha de inscripción' })
  @ApiBody({
    description: 'Datos de la ficha de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ficha de inscripción creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 409,
    description: 'La ficha de inscripción ya existe',
  })
  create(@Body() createFichaInscripcionDto: CreateFichaInscripcionDto) {
    return this.fichasInscripcionService.create(createFichaInscripcionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ficha de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la ficha de inscripción',
    schema: {
      type: 'object',
      properties: {
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        estudianteId: { type: 'string', example: 'uuid-estudiante' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ) {
    return this.fichasInscripcionService.update(id, updateFichaInscripcionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ficha de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la ficha de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha de inscripción eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ficha de inscripción eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha de inscripción no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.fichasInscripcionService.remove(id);
  }

  // METODOS ASINCRONOS VIA COLAS (BULLMQ)
  @Get('/async/')
  findAllAsync() {
    return this.fichasInscripcionService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.fichasInscripcionService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createFichaInscripcionDto: CreateFichaInscripcionDto) {
    return this.fichasInscripcionService.create(createFichaInscripcionDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ) {
    return this.fichasInscripcionService.update(id, updateFichaInscripcionDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.fichasInscripcionService.remove(id);
  }
}
