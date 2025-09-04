import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AvanceAcademicoService } from './avance_academico.service';
import type { CreateAvanceAcademicoDto } from './dto/create-avance_academico.dto';
import type { UpdateAvanceAcademicoDto } from './dto/update-avance_academico.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AvanceAcademicoQueueService } from './services/avance-academico-queue.service';

@ApiTags('avance-academico')
@ApiBearerAuth()
@Controller('avances-academicos')
export class AvanceAcademicoController {
  constructor(
    private readonly avanceAcademicoQueueService: AvanceAcademicoQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo avance académico' })
  @ApiBody({
    description: 'Datos del avance académico a crear',
    schema: {
      type: 'object',
      properties: {
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
    description: 'Avance académico creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAvanceAcademicoDto: CreateAvanceAcademicoDto) {
    return this.avanceAcademicoQueueService.createAvanceAcademico(
      createAvanceAcademicoDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los avances académicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avances académicos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          estudianteId: { type: 'string', nullable: true },
          estaActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.avanceAcademicoQueueService.findAllAvanceAcademico();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener avance académico por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Avance académico encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        estudianteId: { type: 'string', nullable: true },
        estaActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  findOne(@Param('id') id: string) {
    return this.avanceAcademicoQueueService.findOneAvanceAcademico(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar avance académico' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del avance académico',
    schema: {
      type: 'object',
      properties: {
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
    description: 'Avance académico actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ) {
    return this.avanceAcademicoQueueService.updateAvanceAcademico(
      id,
      updateAvanceAcademicoDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar avance académico' })
  @ApiParam({
    name: 'id',
    description: 'ID del avance académico',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Avance académico eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Avance académico no encontrado' })
  remove(@Param('id') id: string) {
    return this.avanceAcademicoQueueService.deleteAvanceAcademico(id);
  }
}
