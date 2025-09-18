import { Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { CarrerasService } from '../../carreras/carreras.service';

@Injectable()
export class EndpointExecutorService {
  private readonly logger = new Logger(EndpointExecutorService.name);

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly carrerasService: CarrerasService,
  ) {}

  async executeEndpoint(method: string, path: string, data: any): Promise<any> {
    try {
      this.logger.log(`🚀 Ejecutando endpoint: ${method} ${path}`);

      // Mapear rutas a servicios y métodos
      const routeMap = this.getRouteMap();
      const routeKey = `${method.toUpperCase()} ${path}`;
      
      if (routeMap.has(routeKey)) {
        const { service, methodName, params } = routeMap.get(routeKey);
        
        // Extraer parámetros de la URL si los hay
        const extractedParams = this.extractParams(path, data.params);
        
        // Ejecutar el método del servicio
        const result = await this.executeServiceMethod(
          service, 
          methodName, 
          extractedParams, 
          data.body, 
          data.query
        );

        this.logger.log(`✅ Endpoint ejecutado exitosamente: ${method} ${path}`);
        return result;
      } else {
        this.logger.warn(`⚠️ No se encontró handler para: ${routeKey}`);
        return {
          error: `No handler found for ${routeKey}`,
          availableRoutes: Array.from(routeMap.keys())
        };
      }
    } catch (error) {
      this.logger.error(`❌ Error ejecutando endpoint ${method} ${path}:`, error.message);
      throw error;
    }
  }

  private getRouteMap(): Map<string, any> {
    const routeMap = new Map();

    // Mapear rutas de carreras
    routeMap.set('GET /api/carreras', {
      service: this.carrerasService,
      methodName: 'findAll',
      params: []
    });

    routeMap.set('GET /api/carreras/:id', {
      service: this.carrerasService,
      methodName: 'findOne',
      params: ['id']
    });

    routeMap.set('POST /api/carreras', {
      service: this.carrerasService,
      methodName: 'create',
      params: []
    });

    routeMap.set('PATCH /api/carreras/:id', {
      service: this.carrerasService,
      methodName: 'update',
      params: ['id']
    });

    routeMap.set('DELETE /api/carreras/:id', {
      service: this.carrerasService,
      methodName: 'remove',
      params: ['id']
    });

    // Aquí puedes agregar más rutas cuando las necesites
    // routeMap.set('GET /api/usuarios', { service: this.usuariosService, methodName: 'findAll', params: [] });

    return routeMap;
  }

  private extractParams(path: string, params: any): any[] {
    // Si hay parámetros en la URL (como /api/carreras/:id)
    if (params && Object.keys(params).length > 0) {
      return Object.values(params);
    }
    return [];
  }

  private async executeServiceMethod(
    service: any, 
    methodName: string, 
    params: any[], 
    body?: any, 
    query?: any
  ): Promise<any> {
    try {
      // Construir argumentos para el método
      const args = [...params];
      
      // Para métodos que requieren body (POST, PATCH)
      if (body && (methodName === 'create' || methodName === 'update')) {
        if (methodName === 'update') {
          args.push(body); // Para update: (id, updateDto)
        } else {
          args.unshift(body); // Para create: (createDto)
        }
      }

      // Agregar query params si los hay
      if (query && Object.keys(query).length > 0) {
        args.push(query);
      }

      this.logger.debug(`Ejecutando ${service.constructor.name}.${methodName} con args:`, args);

      // Ejecutar el método
      const result = await service[methodName](...args);
      
      return result;
    } catch (error) {
      this.logger.error(`Error ejecutando ${service.constructor.name}.${methodName}:`, error.message);
      throw error;
    }
  }
}