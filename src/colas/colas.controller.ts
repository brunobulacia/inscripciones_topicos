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
  ApiBody,
} from '@nestjs/swagger';
import { ColasService } from './colas.service';
import {
  CreateColaDto,
  UpdateColaDto,
  ColaResponseDto,
  CreateJobDto,
} from './dto';

@ApiTags('colas')
@ApiBearerAuth()
@Controller('colas')
export class ColasController {
  constructor(private readonly colasService: ColasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva cola',
    description:
      'Crea una nueva cola y opcionalmente crea workers automáticamente. El array workers indica la concurrencia de cada worker a crear.',
  })
  @ApiBody({
    description:
      'Datos para crear la cola. El campo workers es opcional - si se proporciona, se crearán automáticamente workers con las concurrencias especificadas.',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          description: 'Nombre único de la cola',
          example: 'Cola2',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción opcional de la cola',
          example: 'Cola de prueba desde Postman',
        },
        workers: {
          type: 'array',
          description:
            'Array de concurrencias para crear workers automáticamente. La longitud del array = cantidad de workers. Cada valor = concurrencia de ese worker.',
          items: {
            type: 'number',
            minimum: 1,
          },
          example: [2, 2, 4],
        },
      },
      required: ['nombre'],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Cola creada exitosamente con workers automáticos (si se especificaron)',
    type: ColaResponseDto,
    schema: {
      example: {
        id: 'uuid-cola',
        nombre: 'Cola2',
        descripcion: 'Cola de prueba desde Postman',
        estaActiva: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        workers: [
          {
            id: 'uuid-worker-1',
            nombre: 'worker-1',
            concurrencia: 2,
            estaActivo: true,
          },
          {
            id: 'uuid-worker-2',
            nombre: 'worker-2',
            concurrencia: 2,
            estaActivo: true,
          },
          {
            id: 'uuid-worker-3',
            nombre: 'worker-3',
            concurrencia: 4,
            estaActivo: true,
          },
        ],
      },
    },
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
  @ApiOperation({
    summary: 'Actualizar una cola',
    description:
      'Actualiza una cola existente. Puede modificar el nombre, descripción, estado, workers y endpoints. Si se proporcionan workers o endpoints, se reemplazan completamente los existentes.',
  })
  @ApiParam({ name: 'id', description: 'ID de la cola' })
  @ApiBody({
    description:
      'Datos para actualizar la cola. Los campos workers y endpoints son opcionales.',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          description: 'Nuevo nombre de la cola',
          example: 'Cola3',
        },
        descripcion: {
          type: 'string',
          description: 'Nueva descripción de la cola',
          example: 'Segunda cola para load balancing',
        },
        estaActiva: {
          type: 'boolean',
          description: 'Estado de la cola',
          example: true,
        },
        workers: {
          type: 'array',
          description:
            'Array de concurrencias para workers. Reemplaza todos los workers existentes.',
          items: {
            type: 'number',
            minimum: 1,
          },
          example: [1, 2, 4],
        },
        endpoints: {
          type: 'array',
          description:
            'Array de endpoints. Reemplaza todos los endpoints existentes.',
          items: {
            type: 'object',
            properties: {
              ruta: {
                type: 'string',
                example: '/api/horarios/async',
              },
              metodo: {
                type: 'string',
                enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                example: 'GET',
              },
              prioridad: {
                type: 'number',
                minimum: 1,
                example: 1,
              },
            },
            required: ['ruta', 'metodo'],
          },
          example: [
            {
              ruta: '/api/horarios/async',
              metodo: 'GET',
              prioridad: 1,
            },
            {
              ruta: '/api/prerequisitos/async',
              metodo: 'GET',
              prioridad: 1,
            },
            {
              ruta: '/api/prerequisitos/async',
              metodo: 'POST',
              prioridad: 1,
            },
          ],
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Desactivar una cola y eliminar recursos asociados',
    description:
      'Elimina en cascada: 1) Todos los endpoints asociados a la cola, 2) Todos los workers asociados a la cola, 3) Cierra la cola BullMQ, 4) Desactiva la cola en base de datos',
  })
  @ApiParam({ name: 'id', description: 'ID de la cola' })
  @ApiResponse({
    status: 204,
    description: 'Cola y todos sus recursos asociados eliminados exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Cola "MiCola" y todos sus recursos asociados eliminados exitosamente',
        },
        deleted: {
          type: 'object',
          properties: {
            endpoints: {
              type: 'number',
              example: 3,
              description: 'Cantidad de endpoints eliminados',
            },
            workers: {
              type: 'number',
              example: 2,
              description: 'Cantidad de workers eliminados',
            },
          },
        },
      },
    },
  })
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
        state: {
          type: 'string',
          enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
        },
        processedOn: { type: 'number', nullable: true },
        finishedOn: { type: 'number', nullable: true },
        failedReason: { type: 'string', nullable: true },
        returnValue: { type: 'object', nullable: true },
        queueName: { type: 'string' },
        timestamp: { type: 'number' },
        opts: { type: 'object' },
      },
    },
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
        status: {
          type: 'string',
          enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
        },
        progress: { type: 'number' },
        queueName: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        processedAt: { type: 'string', format: 'date-time', nullable: true },
        completedAt: { type: 'string', format: 'date-time', nullable: true },
        result: { type: 'object', nullable: true },
        error: { type: 'string', nullable: true },
      },
    },
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
        kept: { type: 'array', items: { type: 'string' } },
      },
    },
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
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
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
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async fullCleanupAndSync() {
    return this.colasService.fullCleanupAndSync();
  }
}
