import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ColasService } from './colas.service';
import { CreateColaDto, UpdateColaDto, ColaResponseDto, CreateJobDto } from './dto';

@ApiTags('colas')
@ApiBearerAuth()
@Controller('colas')
export class ColasController {
  constructor(private readonly colasService: ColasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cola' })
  @ApiResponse({
    status: 201,
    description: 'Cola creada exitosamente',
    type: ColaResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Cola con ese nombre ya existe' })
  async create(@Body() createColaDto: CreateColaDto): Promise<ColaResponseDto> {
    return this.colasService.create(createColaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las colas activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colas',
    type: [ColaResponseDto],
  })
  async findAll(): Promise<ColaResponseDto[]> {
    return this.colasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cola por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Cola encontrada',
    type: ColaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async findOne(@Param('id') id: string): Promise<ColaResponseDto> {
    return this.colasService.findOne(id);
  }

  @Get('by-name/:nombre')
  @ApiOperation({ summary: 'Obtener una cola por nombre' })
  @ApiParam({ name: 'nombre', description: 'Nombre de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Cola encontrada',
    type: ColaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async findByName(@Param('nombre') nombre: string): Promise<ColaResponseDto> {
    return this.colasService.findByName(nombre);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cola' })
  @ApiParam({ name: 'id', description: 'ID de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Cola actualizada exitosamente',
    type: ColaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  @ApiResponse({ status: 409, description: 'Cola con ese nombre ya existe' })
  async update(
    @Param('id') id: string,
    @Body() updateColaDto: UpdateColaDto,
  ): Promise<ColaResponseDto> {
    return this.colasService.update(id, updateColaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar una cola' })
  @ApiParam({ name: 'id', description: 'ID de la cola' })
  @ApiResponse({ status: 204, description: 'Cola desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.colasService.remove(id);
  }

  // Endpoints dinámicos para manejar jobs en colas específicas
  @Post(':nombre/jobs')
  @ApiOperation({ summary: 'Agregar un job a una cola específica' })
  @ApiParam({ name: 'nombre', description: 'Nombre de la cola' })
  @ApiResponse({ status: 201, description: 'Job agregado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async addJob(
    @Param('nombre') nombre: string,
    @Body() createJobDto: CreateJobDto,
  ): Promise<any> {
    return this.colasService.addJob(nombre, createJobDto);
  }

  @Get(':nombre/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de una cola específica' })
  @ApiParam({ name: 'nombre', description: 'Nombre de la cola' })
  @ApiResponse({ status: 200, description: 'Estadísticas de la cola' })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async getQueueStats(@Param('nombre') nombre: string): Promise<any> {
    return this.colasService.getQueueStats(nombre);
  }

  @Get(':nombre/jobs')
  @ApiOperation({ summary: 'Obtener jobs de una cola específica' })
  @ApiParam({ name: 'nombre', description: 'Nombre de la cola' })
  @ApiQuery({
    name: 'status',
    enum: ['waiting', 'active', 'completed', 'failed'],
    required: false,
    description: 'Estado de los jobs a obtener',
  })
  @ApiResponse({ status: 200, description: 'Lista de jobs' })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async getQueueJobs(
    @Param('nombre') nombre: string,
    @Query('status') status?: 'waiting' | 'active' | 'completed' | 'failed',
  ): Promise<any[]> {
    return this.colasService.getQueueJobs(nombre, status);
  }

  // Endpoints para consultar jobs por ID
  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Obtener información completa de un job por ID' })
  @ApiParam({ name: 'jobId', description: 'UUID del job', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información detallada del job',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        data: { type: 'object' },
        progress: { type: 'number' },
        state: { type: 'string', enum: ['waiting', 'active', 'completed', 'failed', 'delayed'] },
        processedOn: { type: 'number', nullable: true },
        finishedOn: { type: 'number', nullable: true },
        failedReason: { type: 'string', nullable: true },
        returnValue: { type: 'object', nullable: true },
        queueName: { type: 'string' },
        timestamp: { type: 'number' },
        opts: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Job no encontrado' })
  async getJobById(@Param('jobId') jobId: string) {
    return this.colasService.getJobById(jobId);
  }

  @Get('jobs/:jobId/status')
  @ApiOperation({ summary: 'Obtener estado de un job por ID' })
  @ApiParam({ name: 'jobId', description: 'UUID del job', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del job',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', format: 'uuid' },
        status: { type: 'string', enum: ['waiting', 'active', 'completed', 'failed', 'delayed'] },
        progress: { type: 'number' },
        queueName: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        processedAt: { type: 'string', format: 'date-time', nullable: true },
        completedAt: { type: 'string', format: 'date-time', nullable: true },
        result: { type: 'object', nullable: true },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Job no encontrado' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.colasService.getJobStatus(jobId);
  }

  // Endpoints para limpieza y sincronización
  @Post('cleanup-redis')
  @ApiOperation({ summary: 'Limpiar Redis de colas inactivas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Limpieza de Redis completada',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        cleaned: { type: 'array', items: { type: 'string' } },
        kept: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async cleanupRedis() {
    return this.colasService.cleanupRedis();
  }

  @Post('sync-database')
  @ApiOperation({ summary: 'Sincronizar colas con base de datos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sincronización completada',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        synced: { type: 'array', items: { type: 'string' } },
        errors: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async syncWithDatabase() {
    return this.colasService.syncWithDatabase();
  }

  @Post('full-cleanup')
  @ApiOperation({ summary: 'Limpieza completa y sincronización' })
  @ApiResponse({ 
    status: 200, 
    description: 'Limpieza y sincronización completa',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        cleanup: { type: 'object' },
        sync: { type: 'object' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async fullCleanupAndSync() {
    return this.colasService.fullCleanupAndSync();
  }
}