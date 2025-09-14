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
import { PaginationDto } from './dto/pagination.dto';
import { EstudianteQueueService } from './services/estudiante-queue.service';

@ApiTags('estudiantes')
@ApiBearerAuth()
@Controller('estudiantes')
export class EstudiantesController {
  constructor(
    private readonly estudiantesService: EstudiantesService,
    private readonly estudianteQueueService: EstudianteQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los estudiantes (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Estudiantes obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          nombre: { type: 'string', example: 'Juan' },
          apellido_paterno: { type: 'string', example: 'Pérez' },
          apellido_materno: { type: 'string', example: 'García' },
          telefono: { type: 'string', example: '70123456' },
          ci: { type: 'string', example: '12345678' },
          email: { type: 'string', example: 'juan.perez@email.com' },
          matricula: { type: 'string', example: 'EST001' },
          ppac: { type: 'number', example: 0 },
          estaActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.estudiantesService.findAll(paginationDto);
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener estudiante por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        nombre: { type: 'string', example: 'Juan' },
        apellido_paterno: { type: 'string', example: 'Pérez' },
        apellido_materno: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '70123456' },
        ci: { type: 'string', example: '12345678' },
        email: { type: 'string', example: 'juan.perez@email.com' },
        matricula: { type: 'string', example: 'EST001' },
        ppac: { type: 'number', example: 0 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo estudiante (sincrónico)' })
  @ApiBody({
    description: 'Datos del nuevo estudiante',
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
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar estudiante (sincrónico)' })
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        nombre: { type: 'string', example: 'Juan' },
        apellido_paterno: { type: 'string', example: 'Pérez' },
        apellido_materno: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '70123456' },
        ci: { type: 'string', example: '12345678' },
        email: { type: 'string', example: 'juan.perez@email.com' },
        matricula: { type: 'string', example: 'EST001' },
        ppac: { type: 'number', example: 0 },
        estaActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar estudiante (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Estudiante eliminado exitosamente',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo estudiante (asíncrono)' })
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
  @ApiResponse({
    status: 202,
    description: 'Job encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear estudiante',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createEstudianteDto: CreateEstudianteDto) {
    const result =
      await this.estudianteQueueService.createEstudiante(createEstudianteDto);
    return {
      jobId: result.jobId,
      message: 'Job encolado para crear estudiante',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los estudiantes (asíncrono)' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener estudiantes',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener estudiantes',
        },
      },
    },
  })
  async findAllQueue(@Query() paginationDto: PaginationDto) {
    const result =
      await this.estudianteQueueService.findAllEstudiantes(paginationDto);
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener estudiantes',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener estudiante por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener estudiante',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener estudiante',
        },
      },
    },
  })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.estudianteQueueService.findOneEstudiante(id);
    return {
      jobId: result.jobId,
      message: 'Job encolado para obtener estudiante',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar estudiante (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar estudiante',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar estudiante',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    const result = await this.estudianteQueueService.updateEstudiante(
      id,
      updateEstudianteDto,
    );
    return {
      jobId: result.jobId,
      message: 'Job encolado para actualizar estudiante',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar estudiante (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar estudiante',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar estudiante',
        },
      },
    },
  })
  async removeQueue(@Param('id') id: string) {
    const result = await this.estudianteQueueService.deleteEstudiante(id);
    return {
      jobId: result.jobId,
      message: 'Job encolado para eliminar estudiante',
    };
  }
}
