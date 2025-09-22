import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEndpointDto,
  UpdateEndpointDto,
  EndpointResponseDto,
  AssignEndpointToColaDto,
  CreateAndAssignEndpointDto,
} from './dto';

@Injectable()
export class EndpointsService {
  private readonly logger = new Logger(EndpointsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEndpointDto: CreateEndpointDto,
  ): Promise<EndpointResponseDto> {
    // Verificar si ya existe un endpoint con esa ruta y método
    const existingEndpoint = await this.prisma.endpoint.findFirst({
      where: {
        ruta: createEndpointDto.ruta,
        metodo: createEndpointDto.metodo.toUpperCase(),
        estaActivo: true,
      },
    });

    if (existingEndpoint) {
      throw new ConflictException(
        `Endpoint ${createEndpointDto.metodo} ${createEndpointDto.ruta} ya existe`,
      );
    }

    const endpoint = await this.prisma.endpoint.create({
      data: {
        ...createEndpointDto,
        metodo: createEndpointDto.metodo.toUpperCase(),
      },
      include: {
        colaEndpoints: {
          include: {
            cola: true,
          },
        },
      },
    });

    this.logger.log(
      `Endpoint "${endpoint.metodo} ${endpoint.ruta}" creado exitosamente`,
    );

    return this.mapToResponseDto(endpoint);
  }

  async findAll(): Promise<EndpointResponseDto[]> {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { estaActivo: true },
      include: {
        colaEndpoints: {
          where: { estaActivo: true },
          include: {
            cola: true,
          },
          orderBy: { prioridad: 'asc' },
        },
      },
    });

    return endpoints.map((endpoint) => this.mapToResponseDto(endpoint));
  }

  async findOne(id: string): Promise<EndpointResponseDto> {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
      include: {
        colaEndpoints: {
          where: { estaActivo: true },
          include: {
            cola: true,
          },
          orderBy: { prioridad: 'asc' },
        },
      },
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    return this.mapToResponseDto(endpoint);
  }

  async findByRoute(
    ruta: string,
    metodo: string,
  ): Promise<EndpointResponseDto | null> {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: {
        ruta,
        metodo: metodo.toUpperCase(),
        estaActivo: true,
      },
      include: {
        colaEndpoints: {
          where: { estaActivo: true },
          include: {
            cola: true,
          },
          orderBy: { prioridad: 'asc' },
        },
      },
    });

    return endpoint ? this.mapToResponseDto(endpoint) : null;
  }

  async hasActiveEndpoint(ruta: string, metodo: string): Promise<boolean> {
    const count = await this.prisma.colaEndpoint.count({
      where: {
        endpoint: {
          ruta,
          metodo: metodo.toUpperCase(),
          estaActivo: true,
        },
        cola: {
          estaActiva: true,
        },
        estaActivo: true,
      },
    });

    return count > 0;
  }

  async update(
    id: string,
    updateEndpointDto: UpdateEndpointDto,
  ): Promise<EndpointResponseDto> {
    const existingEndpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    });

    if (!existingEndpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    // Si se está cambiando la ruta o método, verificar que no exista otro igual
    if (updateEndpointDto.ruta || updateEndpointDto.metodo) {
      const ruta = updateEndpointDto.ruta || existingEndpoint.ruta;
      const metodo = (
        updateEndpointDto.metodo || existingEndpoint.metodo
      ).toUpperCase();

      const conflictEndpoint = await this.prisma.endpoint.findFirst({
        where: {
          ruta,
          metodo,
          estaActivo: true,
          NOT: { id },
        },
      });

      if (conflictEndpoint) {
        throw new ConflictException(
          `Ya existe un endpoint con ${metodo} ${ruta}`,
        );
      }
    }

    const updatedEndpoint = await this.prisma.endpoint.update({
      where: { id },
      data: {
        ...updateEndpointDto,
        metodo: updateEndpointDto.metodo
          ? updateEndpointDto.metodo.toUpperCase()
          : undefined,
      },
      include: {
        colaEndpoints: {
          where: { estaActivo: true },
          include: {
            cola: true,
          },
          orderBy: { prioridad: 'asc' },
        },
      },
    });

    this.logger.log(
      `Endpoint "${updatedEndpoint.metodo} ${updatedEndpoint.ruta}" actualizado exitosamente`,
    );

    return this.mapToResponseDto(updatedEndpoint);
  }

  async remove(id: string): Promise<void> {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id },
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint con ID "${id}" no encontrado`);
    }

    // Desactivar el endpoint (soft delete)
    await this.prisma.endpoint.update({
      where: { id },
      data: { estaActivo: false },
    });

    // También desactivar todas las asignaciones
    await this.prisma.colaEndpoint.updateMany({
      where: { endpointId: id },
      data: { estaActivo: false },
    });

    this.logger.log(
      `Endpoint "${endpoint.metodo} ${endpoint.ruta}" desactivado exitosamente`,
    );
  }

  // Nuevos métodos para manejar la relación many-to-many

  async assignToQueue(
    colaId: string,
    assignDto: AssignEndpointToColaDto,
  ): Promise<any> {
    // Verificar que la cola existe
    const cola = await this.prisma.cola.findUnique({
      where: { id: colaId, estaActiva: true },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${colaId}" no encontrada`);
    }

    // Verificar que el endpoint existe
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id: assignDto.endpointId, estaActivo: true },
    });

    if (!endpoint) {
      throw new NotFoundException(
        `Endpoint con ID "${assignDto.endpointId}" no encontrado`,
      );
    }

    // Verificar si ya existe la asignación
    const existingAssignment = await this.prisma.colaEndpoint.findUnique({
      where: {
        colaId_endpointId: {
          colaId,
          endpointId: assignDto.endpointId,
        },
      },
    });

    if (existingAssignment) {
      if (existingAssignment.estaActivo) {
        throw new ConflictException(
          `El endpoint "${endpoint.metodo} ${endpoint.ruta}" ya está asignado a la cola "${cola.nombre}"`,
        );
      } else {
        // Reactivar la asignación existente
        const reactivated = await this.prisma.colaEndpoint.update({
          where: { id: existingAssignment.id },
          data: {
            estaActivo: true,
            prioridad: assignDto.prioridad || 1,
            updatedAt: new Date(),
          },
          include: {
            cola: true,
            endpoint: true,
          },
        });

        this.logger.log(
          `Endpoint "${endpoint.metodo} ${endpoint.ruta}" reasignado a cola "${cola.nombre}"`,
        );
        return reactivated;
      }
    }

    // Crear nueva asignación
    const assignment = await this.prisma.colaEndpoint.create({
      data: {
        colaId,
        endpointId: assignDto.endpointId,
        prioridad: assignDto.prioridad || 1,
      },
      include: {
        cola: true,
        endpoint: true,
      },
    });

    this.logger.log(
      `Endpoint "${endpoint.metodo} ${endpoint.ruta}" asignado a cola "${cola.nombre}"`,
    );

    return assignment;
  }

  async unassignFromQueue(colaId: string, endpointId: string): Promise<void> {
    const assignment = await this.prisma.colaEndpoint.findUnique({
      where: {
        colaId_endpointId: {
          colaId,
          endpointId,
        },
      },
      include: {
        cola: true,
        endpoint: true,
      },
    });

    if (!assignment || !assignment.estaActivo) {
      throw new NotFoundException(
        `No se encontró la asignación del endpoint a la cola especificada`,
      );
    }

    await this.prisma.colaEndpoint.update({
      where: { id: assignment.id },
      data: { estaActivo: false },
    });

    this.logger.log(
      `Endpoint "${assignment.endpoint.metodo} ${assignment.endpoint.ruta}" ` +
        `desasignado de cola "${assignment.cola.nombre}"`,
    );
  }

  async createAndAssign(
    colaId: string,
    createAndAssignDto: CreateAndAssignEndpointDto,
  ): Promise<any> {
    // Verificar que la cola existe
    const cola = await this.prisma.cola.findUnique({
      where: { id: colaId, estaActiva: true },
    });

    if (!cola) {
      throw new NotFoundException(`Cola con ID "${colaId}" no encontrada`);
    }

    // Verificar si ya existe el endpoint
    let endpoint = await this.prisma.endpoint.findFirst({
      where: {
        ruta: createAndAssignDto.ruta,
        metodo: createAndAssignDto.metodo.toUpperCase(),
        estaActivo: true,
      },
    });

    // Si no existe, crearlo
    if (!endpoint) {
      endpoint = await this.prisma.endpoint.create({
        data: {
          ruta: createAndAssignDto.ruta,
          metodo: createAndAssignDto.metodo.toUpperCase(),
        },
      });

      this.logger.log(`Endpoint "${endpoint.metodo} ${endpoint.ruta}" creado`);
    }

    // Asignar a la cola
    const assignDto: AssignEndpointToColaDto = {
      endpointId: endpoint.id,
      prioridad: createAndAssignDto.prioridad,
    };

    return this.assignToQueue(colaId, assignDto);
  }

  async getQueuesForEndpoint(ruta: string, metodo: string): Promise<any[]> {
    const assignments = await this.prisma.colaEndpoint.findMany({
      where: {
        endpoint: {
          ruta,
          metodo: metodo.toUpperCase(),
          estaActivo: true,
        },
        cola: {
          estaActiva: true,
        },
        estaActivo: true,
      },
      include: {
        cola: {
          include: {
            workers: {
              where: { estaActivo: true },
            },
          },
        },
        endpoint: true,
      },
      orderBy: { prioridad: 'asc' },
    });

    return assignments.map((assignment) => ({
      colaEndpointId: assignment.id,
      cola: assignment.cola,
      prioridad: assignment.prioridad,
      endpoint: assignment.endpoint,
    }));
  }

  private mapToResponseDto(endpoint: any): EndpointResponseDto {
    return {
      id: endpoint.id,
      ruta: endpoint.ruta,
      metodo: endpoint.metodo,
      estaActivo: endpoint.estaActivo,
      createdAt: endpoint.createdAt,
      updatedAt: endpoint.updatedAt,
      colas:
        endpoint.colaEndpoints?.map((ce: any) => ({
          id: ce.id,
          colaId: ce.cola.id,
          colaNombre: ce.cola.nombre,
          prioridad: ce.prioridad,
          estaActivo: ce.estaActivo,
        })) || [],
    };
  }
}
