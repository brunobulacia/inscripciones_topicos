import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';

export interface QueueLoad {
  colaId: string;
  nombre: string;
  waitingJobs: number;
  activeJobs: number;
  totalLoad: number;
  workersCount: number;
  concurrencia: number;
}

export interface LoadBalancerResult {
  selectedQueue: {
    colaId: string;
    nombre: string;
    load: number;
  };
  allQueues: QueueLoad[];
  strategy: string;
  timestamp: Date;
}

@Injectable()
export class LoadBalancerService {
  private readonly logger = new Logger(LoadBalancerService.name);
  private readonly dinamicQueues = new Map<string, Queue>();
  private roundRobinCounters = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  // Inyectar las colas dinámicas desde ColasService
  setDynamicQueues(queues: ReadonlyMap<string, Queue>) {
    this.dinamicQueues.clear();
    queues.forEach((queue, name) => {
      this.dinamicQueues.set(name, queue);
    });
  }

  /**
   * Selecciona la mejor cola para un endpoint usando el algoritmo especificado
   */
  async selectBestQueue(
    ruta: string,
    metodo: string,
    strategy: 'least-loaded' | 'round-robin' = 'least-loaded',
  ): Promise<LoadBalancerResult> {
    // Validar parámetros de entrada
    if (!ruta || typeof ruta !== 'string' || ruta.trim() === '') {
      throw new NotFoundException(
        'El parámetro "ruta" es requerido y debe ser una cadena válida',
      );
    }

    if (!metodo || typeof metodo !== 'string' || metodo.trim() === '') {
      throw new NotFoundException(
        'El parámetro "metodo" es requerido y debe ser una cadena válida',
      );
    }

    const metodoUpperCase = metodo.toUpperCase();

    // 1. Buscar todas las colas que soportan este endpoint usando la tabla intermedia
    const colaEndpoints = await this.prisma.colaEndpoint.findMany({
      where: {
        endpoint: {
          ruta,
          metodo: metodoUpperCase,
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

    if (colaEndpoints.length === 0) {
      throw new NotFoundException(
        `No hay colas disponibles para el endpoint ${metodoUpperCase} ${ruta}`,
      );
    }

    // 2. Obtener métricas de carga para cada cola
    const queueLoads = await Promise.all(
      colaEndpoints.map((ce) => this.getQueueLoad(ce.cola)),
    );

    // 3. Seleccionar la mejor cola según la estrategia
    let selectedQueue: QueueLoad;

    switch (strategy) {
      case 'round-robin':
        selectedQueue = this.selectRoundRobin(queueLoads, `${ruta}:${metodo}`);
        break;
      case 'least-loaded':
      default:
        selectedQueue = this.selectLeastLoaded(queueLoads);
        break;
    }

    const result: LoadBalancerResult = {
      selectedQueue: {
        colaId: selectedQueue.colaId,
        nombre: selectedQueue.nombre,
        load: selectedQueue.totalLoad,
      },
      allQueues: queueLoads,
      strategy,
      timestamp: new Date(),
    };

    this.logger.log(
      `🎯 Balanceador seleccionó cola "${selectedQueue.nombre}" (carga: ${selectedQueue.totalLoad}) ` +
        `para ${metodoUpperCase} ${ruta} usando estrategia "${strategy}"`,
    );

    return result;
  }

  /**
   * Obtiene la carga actual de una cola
   */
  private async getQueueLoad(cola: any): Promise<QueueLoad> {
    const queue = this.dinamicQueues.get(cola.nombre);

    let waitingJobs = 0;
    let activeJobs = 0;

    if (queue) {
      try {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        waitingJobs = waiting.length;
        activeJobs = active.length;
      } catch (error) {
        this.logger.warn(
          `Error obteniendo carga de cola "${cola.nombre}":`,
          error.message,
        );
      }
    }

    const workersCount = cola.workers?.length || 0;
    const concurrencia =
      cola.workers?.reduce(
        (sum: number, worker: any) => sum + worker.concurrencia,
        0,
      ) || 0;

    // Calcular carga total: jobs activos + jobs en espera, ponderado por capacidad
    const totalLoad =
      workersCount > 0 ? (activeJobs + waitingJobs) / concurrencia : 999999;

    return {
      colaId: cola.id,
      nombre: cola.nombre,
      waitingJobs,
      activeJobs,
      totalLoad,
      workersCount,
      concurrencia,
    };
  }

  /**
   * Estrategia: Seleccionar la cola con menor carga
   */
  private selectLeastLoaded(queueLoads: QueueLoad[]): QueueLoad {
    // Filtrar colas que tienen workers activos
    const availableQueues = queueLoads.filter((q) => q.workersCount > 0);

    if (availableQueues.length === 0) {
      // Si no hay colas con workers, usar la primera disponible
      this.logger.warn(
        'No hay colas con workers activos, usando la primera disponible',
      );
      return queueLoads[0];
    }

    // Ordenar por carga total (menor carga primero)
    availableQueues.sort((a, b) => a.totalLoad - b.totalLoad);

    return availableQueues[0];
  }

  /**
   * Estrategia: Round-robin entre las colas disponibles
   */
  private selectRoundRobin(
    queueLoads: QueueLoad[],
    endpointKey: string,
  ): QueueLoad {
    // Filtrar colas que tienen workers activos
    const availableQueues = queueLoads.filter((q) => q.workersCount > 0);

    if (availableQueues.length === 0) {
      return queueLoads[0];
    }

    // Obtener el contador actual para este endpoint
    const currentCounter = this.roundRobinCounters.get(endpointKey) || 0;
    const nextIndex = currentCounter % availableQueues.length;

    // Actualizar contador
    this.roundRobinCounters.set(endpointKey, currentCounter + 1);

    return availableQueues[nextIndex];
  }

  /**
   * Obtiene estadísticas de balanceo para todos los endpoints
   */
  async getLoadBalancingStats(): Promise<any> {
    const colaEndpoints = await this.prisma.colaEndpoint.findMany({
      where: {
        estaActivo: true,
        endpoint: {
          estaActivo: true,
        },
        cola: {
          estaActiva: true,
        },
      },
      include: {
        endpoint: true,
        cola: {
          include: {
            workers: { where: { estaActivo: true } },
          },
        },
      },
    });

    // Agrupar por endpoint
    const endpointGroups = new Map<string, any[]>();

    colaEndpoints.forEach((ce) => {
      const key = `${ce.endpoint.metodo} ${ce.endpoint.ruta}`;
      if (!endpointGroups.has(key)) {
        endpointGroups.set(key, []);
      }
      endpointGroups.get(key)!.push(ce);
    });

    // Obtener estadísticas para cada grupo
    const stats = await Promise.all(
      Array.from(endpointGroups.entries()).map(
        async ([endpointKey, ceList]) => {
          const queueLoads = await Promise.all(
            ceList.map((ce) => this.getQueueLoad(ce.cola)),
          );

          return {
            endpoint: endpointKey,
            queuesCount: queueLoads.length,
            totalLoad: queueLoads.reduce((sum, q) => sum + q.totalLoad, 0),
            queues: queueLoads.map((q) => ({
              nombre: q.nombre,
              load: q.totalLoad,
              workers: q.workersCount,
              concurrencia: q.concurrencia,
              waiting: q.waitingJobs,
              active: q.activeJobs,
            })),
          };
        },
      ),
    );

    return {
      timestamp: new Date().toISOString(),
      totalEndpoints: endpointGroups.size,
      endpointsWithMultipleQueues: stats.filter((s) => s.queuesCount > 1)
        .length,
      statistics: stats,
    };
  }

  /**
   * Resetea los contadores de round-robin
   */
  resetRoundRobinCounters(): void {
    this.roundRobinCounters.clear();
    this.logger.log('🔄 Contadores de round-robin reseteados');
  }
}
