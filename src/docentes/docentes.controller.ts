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

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los docentes (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Docentes obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          nombre: { type: 'string', example: 'María' },
          apellido_paterno: { type: 'string', example: 'López' },
          apellido_materno: { type: 'string', example: 'Fernández' },
          ci: { type: 'string', example: '87654321' },
          registro: { type: 'string', example: 'DOC001' },
          email: { type: 'string', example: 'maria.lopez@universidad.edu' },
          telefono: { type: 'string', example: '71234567' },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.docentesService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener docente por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Docente obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        nombre: { type: 'string', example: 'María' },
        apellido_paterno: { type: 'string', example: 'López' },
        apellido_materno: { type: 'string', example: 'Fernández' },
        ci: { type: 'string', example: '87654321' },
        registro: { type: 'string', example: 'DOC001' },
        email: { type: 'string', example: 'maria.lopez@universidad.edu' },
        telefono: { type: 'string', example: '71234567' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo docente (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo docente',
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
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar docente (sincrónico)' })
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
  @ApiResponse({
    status: 200,
    description: 'Docente actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        nombre: { type: 'string', example: 'María' },
        apellido_paterno: { type: 'string', example: 'López' },
        apellido_materno: { type: 'string', example: 'Fernández' },
        ci: { type: 'string', example: '87654321' },
        registro: { type: 'string', example: 'DOC001' },
        email: { type: 'string', example: 'maria.lopez@universidad.edu' },
        telefono: { type: 'string', example: '71234567' },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docentesService.update(id, updateDocenteDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar docente (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Docente eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Docente eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.docentesService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo docente (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Job encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: { type: 'string', example: 'Job encolado para crear docente' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createDocenteDto: CreateDocenteDto) {
    const result =
      await this.docenteQueueService.addCreateDocenteJob(createDocenteDto);
    return {
      jobId: result.jobId,
      message: 'Job encolado para crear docente',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los docentes (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener docentes',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener docentes',
        },
      },
    },
  })
  async findAllQueue() {
    const result = await this.docenteQueueService.addFindAllDocentesJob();
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener docentes',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener docente por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener docente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener docente',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.docenteQueueService.addFindOneDocenteJob({ id });
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener docente',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar docente (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar docente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar docente',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateDocenteDto: UpdateDocenteDto,
  ) {
    const result = await this.docenteQueueService.addUpdateDocenteJob({
      id,
      data: updateDocenteDto,
    });
    return {
      jobId: result.jobId,
      message: 'Job encolado para actualizar docente',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar docente (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del docente',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar docente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar docente',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result = await this.docenteQueueService.addDeleteDocenteJob({ id });
    return {
      jobId: result.jobId,
      message: 'Job encolado para eliminar docente',
    };
  }
}
