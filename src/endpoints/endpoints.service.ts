import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateEndpointDto, 
  UpdateEndpointDto, 
  EndpointResponseDto,
  AssignEndpointDto,
  UnassignEndpointDto 
} from './dto';

@Injectable()
export class EndpointsService {
  private readonly logger = new Logger(EndpointsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createEndpointDto: CreateEndpointDto): Promise<EndpointResponseDto> {
    // Verificar si ya existe un endpoint con esa ruta y método
    const existingEndpoint = await this.prisma.endpoint.findFirst({
      where: { 
        ruta: createEndpointDto.ruta,
        metodo: createEndpointDto.metodo,
        estaActivo: true,
      },
    });

    if (existingEndpoint) {
      throw new ConflictException(
        `Endpoint ${createEndpointDto.metodo} ${createEndpointDto.ruta} ya está asignado`
      );
    }

    // Verificar que la cola existe
    const cola = await this.prisma.cola.findUnique({
      where: { id: createEndpointDto.colaId },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${createEndpointDto.colaId}" no encontrada`);
    }

    const endpoint = await this.prisma.endpoint.create({
      data: createEndpointDto,
    });

    this.logger.log(
      `Endpoint ${endpoint.metodo} ${endpoint.ruta} asignado a la cola "${cola.nombre}"`
    );

    return this.mapToResponseDto(endpoint);
  }

  async findAll(): Promise<EndpointResponseDto[]> {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { estaActivo: true },
      include: {
        cola: true,
      },
    });

    return endpoints.map(endpoint => this.mapToResponseDto(endpoint));
  }

  async findByColaId(colaId: string): Promise<EndpointResponseDto[]> {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { 
        colaId,
        estaActivo: true 
      },
      include: {
        cola: true,
      },
    });

    return endpoints.map(endpoint => this.mapToResponseDto(endpoint));
  }

  async findByColaNombre(nombreCola: string): Promise<EndpointResponseDto[]> {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { 
        cola: {
          nombre: nombreCola
        },
        estaActivo: true 
      },
      include: {
        cola: true,
      },
    });

    return endpoints.map(endpoint => this.mapToResponseDto(endpoint));
  }

  async findOne(id: string): Promise<EndpointResponseDto> {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
      include: {
        cola: true,
      },
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    return this.mapToResponseDto(endpoint);
  }

  async findByRoute(ruta: string, metodo: string): Promise<EndpointResponseDto | null> {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: { 
        ruta,
        metodo,
        estaActivo: true
      },
      include: {
        cola: true,
      },
    });

    return endpoint ? this.mapToResponseDto(endpoint) : null;
  }

  async update(id: string, updateEndpointDto: UpdateEndpointDto): Promise<EndpointResponseDto> {
    const existingEndpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    });

    if (!existingEndpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    // Si se está cambiando la ruta o método, verificar que no exista otra combinación igual
    if ((updateEndpointDto.ruta && updateEndpointDto.ruta !== existingEndpoint.ruta) ||
        (updateEndpointDto.metodo && updateEndpointDto.metodo !== existingEndpoint.metodo)) {
      
      const ruta = updateEndpointDto.ruta || existingEndpoint.ruta;
      const metodo = updateEndpointDto.metodo || existingEndpoint.metodo;
      
      const endpointWithSameRoute = await this.prisma.endpoint.findFirst({
        where: { 
          ruta,
          metodo,
          estaActivo: true,
        },
      });

      if (endpointWithSameRoute && endpointWithSameRoute.id !== id) {
        throw new ConflictException(`Endpoint ${metodo} ${ruta} ya está asignado`);
      }
    }

    const updatedEndpoint = await this.prisma.endpoint.update({
      where: { id },
      data: updateEndpointDto,
    });

    this.logger.log(`Endpoint ${updatedEndpoint.metodo} ${updatedEndpoint.ruta} actualizado`);

    return this.mapToResponseDto(updatedEndpoint);
  }

  async remove(id: string): Promise<void> {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    // Desactivar el endpoint en lugar de eliminarlo
    await this.prisma.endpoint.update({
      where: { id },
      data: { estaActivo: false },
    });

    this.logger.log(`Endpoint ${endpoint.metodo} ${endpoint.ruta} desactivado`);
  }

  // Métodos específicos para asignar/desasignar endpoints a colas
  async assignToCola(colaId: string, assignEndpointDto: AssignEndpointDto): Promise<EndpointResponseDto> {
    const createDto: CreateEndpointDto = {
      ...assignEndpointDto,
      colaId,
    };

    return this.create(createDto);
  }

  async unassignFromCola(colaId: string, unassignEndpointDto: UnassignEndpointDto): Promise<void> {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: {
        ruta: unassignEndpointDto.ruta,
        metodo: unassignEndpointDto.metodo,
        colaId,
        estaActivo: true,
      },
    });

    if (!endpoint) {
      throw new NotFoundException(
        `Endpoint ${unassignEndpointDto.metodo} ${unassignEndpointDto.ruta} no encontrado en la cola especificada`
      );
    }

    await this.remove(endpoint.id);
  }

  // Método para obtener estadísticas de endpoints
  async getEndpointStats(): Promise<any> {
    const totalEndpoints = await this.prisma.endpoint.count({
      where: { estaActivo: true },
    });

    const endpointsByMethod = await this.prisma.endpoint.groupBy({
      by: ['metodo'],
      where: { estaActivo: true },
      _count: true,
    });

    const endpointsByQueue = await this.prisma.endpoint.groupBy({
      by: ['colaId'],
      where: { estaActivo: true },
      _count: true,
    });

    return {
      total: totalEndpoints,
      byMethod: endpointsByMethod.map(item => ({
        method: item.metodo,
        count: item._count,
      })),
      byQueue: endpointsByQueue.length,
    };
  }

  // Método para verificar si una ruta está asignada a alguna cola
  async isRouteAssigned(ruta: string, metodo: string): Promise<boolean> {
    const endpoint = await this.findByRoute(ruta, metodo);
    return endpoint !== null;
  }

  // Método para obtener la cola asignada a una ruta específica
  async getColaForRoute(ruta: string, metodo: string): Promise<string | null> {
    const endpoint = await this.findByRoute(ruta, metodo);
    return endpoint ? endpoint.colaId : null;
  }

  private mapToResponseDto(endpoint: any): EndpointResponseDto {
    return {
      id: endpoint.id,
      ruta: endpoint.ruta,
      metodo: endpoint.metodo,
      descripcion: endpoint.descripcion,
      colaId: endpoint.colaId,
      estaActivo: endpoint.estaActivo,
      createdAt: endpoint.createdAt,
      updatedAt: endpoint.updatedAt,
    };
  }
}