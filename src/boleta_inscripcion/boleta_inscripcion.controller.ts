import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BoletaInscripcionService } from './boleta_inscripcion.service';
import type { CreateBoletaInscripcionDto } from './dto/create-boleta_inscripcion.dto';
import type { UpdateBoletaInscripcionDto } from './dto/update-boleta_inscripcion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('boleta-inscripcion')
@ApiBearerAuth()
@Controller('boletas-inscripcion')
export class BoletaInscripcionController {
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las boletas de inscripción',
  })
  @ApiResponse({
    status: 200,
    description: 'Boletas de inscripción obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
          avanceAcademicoId: {
            type: 'string',
            example: 'uuid-avance',
            nullable: true,
          },
          estudianteId: {
            type: 'string',
            example: 'uuid-estudiante',
            nullable: true,
          },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.boletaInscripcionService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener boleta de inscripción por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.boletaInscripcionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva boleta de inscripción' })
  @ApiBody({
    description: 'Datos de la boleta de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta de inscripción creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletaInscripcionDto: CreateBoletaInscripcionDto) {
    return this.boletaInscripcionService.create(createBoletaInscripcionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar boleta de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la boleta de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateBoletaInscripcionDto: UpdateBoletaInscripcionDto,
  ) {
    return this.boletaInscripcionService.update(id, updateBoletaInscripcionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar boleta de inscripción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Boleta de inscripción eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.boletaInscripcionService.remove(id);
  }

  @Post('/async')
  @ApiOperation({ summary: 'Crear nueva boleta de inscripción (asíncrono)' })
  @ApiBody({
    description: 'Datos de la boleta de inscripción a crear',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta de inscripción creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(
    @Body() createBoletaInscripcionDto: CreateBoletaInscripcionDto,
  ) {
    return this.boletaInscripcionService.create(createBoletaInscripcionDto);
  }

  @Get('/async')
  @ApiOperation({
    summary: 'Obtener todas las boletas de inscripción (asíncrono)',
  })
  @ApiResponse({
    status: 200,
    description: 'Boletas de inscripción obtenidas exitosamente',
  })
  async findAllQueue() {
    return this.boletaInscripcionService.findAll();
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener boleta de inscripción por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  async findOneQueue(@Param('id') id: string) {
    return this.boletaInscripcionService.findOne(id);
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar boleta de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la boleta de inscripción',
    schema: {
      type: 'object',
      properties: {
        fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
        avanceAcademicoId: {
          type: 'string',
          example: 'uuid-avance',
          nullable: true,
        },
        estudianteId: {
          type: 'string',
          example: 'uuid-estudiante',
          nullable: true,
        },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateBoletaInscripcionDto: UpdateBoletaInscripcionDto,
  ) {
    return this.boletaInscripcionService.update(id, updateBoletaInscripcionDto);
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar boleta de inscripción (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta de inscripción',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta de inscripción eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta de inscripción no encontrada',
  })
  async removeQueue(@Param('id') id: string) {
    return this.boletaInscripcionService.remove(id);
  }
}
