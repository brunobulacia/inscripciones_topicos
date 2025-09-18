import { Injectable, Logger } from '@nestjs/common';
import { EndpointsService } from '../endpoints.service';
import { ColasService } from '../../colas/colas.service';

@Injectable()
export class AutoQueueService {
  private readonly logger = new Logger(AutoQueueService.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly colasService: ColasService,
  ) {}

  /**
   * Procesa una request automáticamente creando un job si la ruta está asignada
   */
  async processRequest(method: string, path: string, requestData: any): Promise<{
    isQueued: boolean;
    jobId?: string;
    queueName?: string;
    endpointId?: string;
  }> {
    // Verificar si esta ruta está asignada a alguna cola
    const endpoint = await this.endpointsService.findByRoute(path, method);
    
    if (!endpoint) {
      return { isQueued: false };
    }

    try {
      // Obtener información de la cola
      const cola = await this.colasService.findOne(endpoint.colaId);
      
      // Crear job con la información de la request
      const jobData = {
        method,
        path,
        ...requestData,
        timestamp: new Date().toISOString(),
        endpointId: endpoint.id,
      };

      // Agregar job a la cola específica
      const job = await this.colasService.addJob(cola.nombre, {
        name: `${method}-${path.replace(/\//g, '-')}`,
        data: jobData,
        opts: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      this.logger.log(`📋 Request encolada: ${method} ${path} -> Job ${job.id} en "${cola.nombre}"`);

      return {
        isQueued: true,
        jobId: job.id,
        queueName: cola.nombre,
        endpointId: endpoint.id,
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
    return this.endpointsService.isRouteAssigned(path, method);
  }

  /**
   * Obtiene información de la cola asignada a una ruta
   */
  async getQueueInfo(method: string, path: string): Promise<{
    endpoint?: any;
    cola?: any;
  }> {
    const endpoint = await this.endpointsService.findByRoute(path, method);
    
    if (!endpoint) {
      return {};
    }

    try {
      const cola = await this.colasService.findOne(endpoint.colaId);
      return { endpoint, cola };
    } catch (error) {
      this.logger.error(`Error obteniendo información de cola para ${method} ${path}:`, error);
      return { endpoint };
    }
  }

  /**
   * Obtiene estadísticas de requests encoladas
   */
  async getQueuingStats(): Promise<any> {
    const endpointStats = await this.endpointsService.getEndpointStats();
    
    return {
      ...endpointStats,
      message: 'Estadísticas del sistema de encolado automático',
    };
  }
}