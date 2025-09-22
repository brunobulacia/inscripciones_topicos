import { Injectable, Logger } from '@nestjs/common';
import { EndpointsService } from '../endpoints.service';
import { ColasService } from '../../colas/colas.service';
import { LoadBalancerService } from './load-balancer.service';

@Injectable()
export class AutoQueueService {
  private readonly logger = new Logger(AutoQueueService.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly colasService: ColasService,
    private readonly loadBalancerService: LoadBalancerService,
  ) {}

  /**
   * Procesa una request automáticamente creando un job si la ruta está asignada
   * Usa el load balancer para seleccionar la mejor cola disponible
   */
  async processRequest(
    method: string,
    path: string,
    requestData: any,
  ): Promise<{
    isQueued: boolean;
    jobId?: string;
    queueName?: string;
    endpointId?: string;
    loadBalancerInfo?: any;
  }> {
    // Verificar si esta ruta está asignada a alguna cola
    const hasEndpoint = await this.endpointsService.hasActiveEndpoint(
      path,
      method,
    );

    if (!hasEndpoint) {
      return { isQueued: false };
    }

    try {
      // Usar el load balancer para seleccionar la mejor cola
      const balancerResult = await this.loadBalancerService.selectBestQueue(
        path,
        method,
      );

      if (!balancerResult.selectedQueue) {
        this.logger.warn(`⚠️  No hay colas disponibles para ${method} ${path}`);
        return { isQueued: false };
      }

      // Buscar el endpoint para obtener su ID
      const endpoint = await this.endpointsService.findByRoute(path, method);

      // Crear job con la información de la request
      const jobData = {
        method,
        path,
        ...requestData,
        timestamp: new Date().toISOString(),
        endpointId: endpoint?.id,
        loadBalancer: {
          selectedQueue: balancerResult.selectedQueue,
          strategy: balancerResult.strategy,
          timestamp: balancerResult.timestamp,
        },
      };

      // Agregar job a la cola seleccionada por el load balancer
      const job = await this.colasService.addJob(
        balancerResult.selectedQueue.nombre,
        {
          name: `${method}-${path.replace(/\//g, '-')}`,
          data: jobData,
          opts: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        },
      );

      this.logger.log(
        `📋 Request encolada con load balancer: ${method} ${path} -> Job ${job.id} en "${balancerResult.selectedQueue.nombre}" (carga: ${balancerResult.selectedQueue.load})`,
      );

      return {
        isQueued: true,
        jobId: job.id,
        queueName: balancerResult.selectedQueue.nombre,
        endpointId: endpoint?.id,
        loadBalancerInfo: balancerResult,
      };
    } catch (error) {
      this.logger.error(`❌ Error encolando request ${method} ${path}:`, error);
      return { isQueued: false };
    }
  }

  /**
   * Verifica si una ruta específica está asignada a una cola
   */
  async isRouteManaged(method: string, path: string): Promise<boolean> {
    return this.endpointsService.hasActiveEndpoint(path, method);
  }

  /**
   * Obtiene información de las colas asignadas a una ruta
   */
  async getQueueInfo(
    method: string,
    path: string,
  ): Promise<{
    endpoint?: any;
    colas?: any[];
  }> {
    const endpoint = await this.endpointsService.findByRoute(path, method);

    if (!endpoint) {
      return {};
    }

    try {
      const colas = await this.endpointsService.getQueuesForEndpoint(
        path,
        method,
      );
      return { endpoint, colas };
    } catch (error) {
      this.logger.error(
        `Error obteniendo información de colas para ${method} ${path}:`,
        error,
      );
      return { endpoint };
    }
  }

  /**
   * Obtiene estadísticas de requests encoladas usando el load balancer
   */
  async getQueuingStats(): Promise<any> {
    try {
      const loadBalancerStats =
        await this.loadBalancerService.getLoadBalancingStats();

      return {
        ...loadBalancerStats,
        message:
          'Estadísticas del sistema de encolado automático con load balancer',
      };
    } catch (error) {
      this.logger.error('Error obteniendo estadísticas:', error);
      return {
        message:
          'Error obteniendo estadísticas del sistema de encolado automático',
        error: error.message,
      };
    }
  }
}
