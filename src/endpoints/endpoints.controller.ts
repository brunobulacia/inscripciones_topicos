import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EndpointsService } from './endpoints.service';
import { AutoQueueService } from './services/auto-queue.service';
import { LoadBalancerService } from './services/load-balancer.service';
import { ColasService } from '../colas/colas.service';
import {
  CreateEndpointDto,
  UpdateEndpointDto,
  EndpointResponseDto,
  AssignEndpointToColaDto,
  CreateAndAssignEndpointDto,
  TestLoadBalancerDto,
} from './dto';

@ApiTags('endpoints')
@ApiBearerAuth()
@Controller('endpoints')
export class EndpointsController {
  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly autoQueueService: AutoQueueService,
    private readonly loadBalancerService: LoadBalancerService,
    private readonly colasService: ColasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo endpoint' })
  @ApiResponse({
    status: 201,
    description: 'Endpoint creado exitosamente',
    type: EndpointResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Endpoint ya está asignado' })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  async create(
    @Body() createEndpointDto: CreateEndpointDto,
  ): Promise<EndpointResponseDto> {
    return this.endpointsService.create(createEndpointDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los endpoints activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de endpoints',
    type: [EndpointResponseDto],
  })
  async findAll(): Promise<EndpointResponseDto[]> {
    return this.endpointsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de endpoints' })
  @ApiResponse({ status: 200, description: 'Estadísticas de endpoints' })
  async getEndpointStats(): Promise<any> {
    // TODO: Implementar estadísticas para la nueva estructura many-to-many
    return { message: 'Estadísticas no implementadas aún' };
  }

  @Get('queue-stats')
  @ApiOperation({
    summary: 'Obtener estadísticas del sistema de encolado automático',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del encolado automático',
  })
  async getQueuingStats(): Promise<any> {
    return this.autoQueueService.getQueuingStats();
  }

  @Get('check-route')
  @ApiOperation({
    summary: 'Verificar si una ruta está asignada a alguna cola',
  })
  @ApiQuery({
    name: 'path',
    description: 'Ruta a verificar',
    example: '/api/carreras',
  })
  @ApiQuery({ name: 'method', description: 'Método HTTP', example: 'GET' })
  @ApiResponse({ status: 200, description: 'Información sobre la ruta' })
  async checkRoute(
    @Query('path') path: string,
    @Query('method') method: string,
  ): Promise<any> {
    const isManaged = await this.autoQueueService.isRouteManaged(method, path);
    const queueInfo = await this.autoQueueService.getQueueInfo(method, path);

    return {
      path,
      method,
      isManaged,
      ...queueInfo,
    };
  }

  @Get('by-cola/:colaId')
  @ApiOperation({ summary: 'Obtener endpoints por ID de cola' })
  @ApiParam({ name: 'colaId', description: 'ID de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Lista de endpoints para la cola',
    type: [EndpointResponseDto],
  })
  async findByColaId(@Param('colaId') colaId: string): Promise<any> {
    // TODO: Implementar para nueva estructura many-to-many
    return { message: 'Método no implementado para nueva estructura' };
  }

  @Get('by-cola-name/:nombreCola')
  @ApiOperation({ summary: 'Obtener endpoints por nombre de cola' })
  @ApiParam({ name: 'nombreCola', description: 'Nombre de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Lista de endpoints para la cola',
    type: [EndpointResponseDto],
  })
  async findByColaNombre(
    @Param('nombreCola') nombreCola: string,
  ): Promise<any> {
    // TODO: Implementar para nueva estructura many-to-many
    return { message: 'Método no implementado para nueva estructura' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un endpoint por ID' })
  @ApiParam({ name: 'id', description: 'ID del endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Endpoint encontrado',
    type: EndpointResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Endpoint no encontrado' })
  async findOne(@Param('id') id: string): Promise<EndpointResponseDto> {
    return this.endpointsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un endpoint' })
  @ApiParam({ name: 'id', description: 'ID del endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Endpoint actualizado exitosamente',
    type: EndpointResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Endpoint no encontrado' })
  @ApiResponse({ status: 409, description: 'Endpoint ya está asignado' })
  async update(
    @Param('id') id: string,
    @Body() updateEndpointDto: UpdateEndpointDto,
  ): Promise<EndpointResponseDto> {
    return this.endpointsService.update(id, updateEndpointDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar un endpoint' })
  @ApiParam({ name: 'id', description: 'ID del endpoint' })
  @ApiResponse({
    status: 204,
    description: 'Endpoint desactivado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Endpoint no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.endpointsService.remove(id);
  }

  // Endpoints específicos para gestión de colas
  @Post('colas/:colaId/assign')
  @ApiOperation({ summary: 'Asignar un endpoint a una cola específica' })
  @ApiParam({ name: 'colaId', description: 'ID de la cola' })
  @ApiResponse({
    status: 201,
    description: 'Endpoint asignado exitosamente',
    type: EndpointResponseDto,
  })
  async assignToCola(
    @Param('colaId') colaId: string,
    @Body() assignEndpointDto: AssignEndpointToColaDto,
  ): Promise<any> {
    return this.endpointsService.assignToQueue(colaId, assignEndpointDto);
  }

  @Delete('colas/:colaId/unassign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desasignar un endpoint de una cola específica' })
  @ApiParam({ name: 'colaId', description: 'ID de la cola' })
  @ApiResponse({
    status: 204,
    description: 'Endpoint desasignado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Endpoint no encontrado en la cola',
  })
  async unassignFromCola(
    @Param('colaId') colaId: string,
    @Body() unassignEndpointDto: { endpointId: string },
  ): Promise<void> {
    return this.endpointsService.unassignFromQueue(
      colaId,
      unassignEndpointDto.endpointId,
    );
  }

  // Endpoints para métricas de balanceador de carga
  @Get('load-balancer/stats')
  @ApiOperation({ summary: 'Obtener estadísticas del balanceador de carga' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de balanceo de carga',
    schema: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        totalEndpoints: { type: 'number' },
        endpointsWithMultipleQueues: { type: 'number' },
        statistics: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              endpoint: { type: 'string' },
              queuesCount: { type: 'number' },
              totalLoad: { type: 'number' },
              queues: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string' },
                    load: { type: 'number' },
                    workers: { type: 'number' },
                    concurrencia: { type: 'number' },
                    waiting: { type: 'number' },
                    active: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getLoadBalancerStats() {
    // Inyectar las colas dinámicas en el load balancer
    this.loadBalancerService.setDynamicQueues(
      this.colasService.getDinamicQueues(),
    );
    return this.loadBalancerService.getLoadBalancingStats();
  }

  @Post('load-balancer/test')
  @ApiOperation({
    summary: 'Probar el balanceador de carga para un endpoint específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la prueba del balanceador',
    schema: {
      type: 'object',
      properties: {
        selectedQueue: {
          type: 'object',
          properties: {
            colaId: { type: 'string' },
            nombre: { type: 'string' },
            load: { type: 'number' },
          },
        },
        allQueues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              colaId: { type: 'string' },
              nombre: { type: 'string' },
              waitingJobs: { type: 'number' },
              activeJobs: { type: 'number' },
              totalLoad: { type: 'number' },
              workersCount: { type: 'number' },
              concurrencia: { type: 'number' },
            },
          },
        },
        strategy: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async testLoadBalancer(@Body() testDto: TestLoadBalancerDto) {
    // Inyectar las colas dinámicas en el load balancer
    this.loadBalancerService.setDynamicQueues(
      this.colasService.getDinamicQueues(),
    );
    return this.loadBalancerService.selectBestQueue(
      testDto.ruta,
      testDto.metodo,
      testDto.strategy,
    );
  }

  @Post('load-balancer/reset-counters')
  @ApiOperation({ summary: 'Resetear contadores de round-robin' })
  @ApiResponse({
    status: 200,
    description: 'Contadores reseteados exitosamente',
  })
  async resetRoundRobinCounters() {
    this.loadBalancerService.resetRoundRobinCounters();
    return { message: 'Contadores de round-robin reseteados exitosamente' };
  }
}
