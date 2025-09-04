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
import { DocenteQueueService } from './services/docente-queue.service';
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
  constructor(
    private readonly docentesService: DocentesService,
    private readonly docenteQueueService: DocenteQueueService,
  ) {}

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
  async create(@Body() createDocenteDto: CreateDocenteDto) {
    const job =
      await this.docenteQueueService.addCreateDocenteJob(createDocenteDto);
    return { jobId: job.id, message: 'Docente creation job queued' };
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
  async findAll() {
    const job = await this.docenteQueueService.addFindAllDocentesJob();
    return { jobId: job.id, message: 'Find all docentes job queued' };
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
  async findOne(@Param('id') id: string) {
    const job = await this.docenteQueueService.addFindOneDocenteJob({ id });
    return { jobId: job.id, message: 'Find one docente job queued' };
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
  async update(
    @Param('id') id: string,
    @Body() updateDocenteDto: UpdateDocenteDto,
  ) {
    const job = await this.docenteQueueService.addUpdateDocenteJob({
      id,
      data: updateDocenteDto,
    });
    return { jobId: job.id, message: 'Update docente job queued' };
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
  async remove(@Param('id') id: string) {
    const job = await this.docenteQueueService.addDeleteDocenteJob({ id });
    return { jobId: job.id, message: 'Delete docente job queued' };
  }
}
