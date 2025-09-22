import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { EndpointsService } from '../endpoints.service';
import { ColasService } from '../../colas/colas.service';
import { LoadBalancerService } from '../services/load-balancer.service';

@Injectable()
export class QueueInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QueueInterceptor.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly colasService: ColasService,
    private readonly loadBalancerService: LoadBalancerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, path } = request;

    if (this.shouldSkipRoute(path)) {
      return next.handle();
    }

    // Verificar si existe al menos un endpoint para esta ruta
    const hasEndpoint = await this.endpointsService.hasActiveEndpoint(
      path,
      method,
    );

    if (hasEndpoint) {
      this.logger.log(
        `🎯 Interceptando ${method} ${path} -> Usando balanceador de carga`,
      );

      try {
        // Inyectar las colas dinámicas en el load balancer
        this.loadBalancerService.setDynamicQueues(
          this.colasService.getDinamicQueues(),
        );

        // Usar el load balancer para seleccionar la mejor cola
        const balancerResult = await this.loadBalancerService.selectBestQueue(
          path,
          method,
          'least-loaded', // Estrategia por defecto
        );

        const customJobId = uuidv4();

        const jobData = {
          method,
          path,
          query: request.query,
          params: request.params,
          body: request.body,
          headers: this.sanitizeHeaders(request.headers),
          timestamp: new Date().toISOString(),
          endpointId: balancerResult.selectedQueue.colaId,
          userAgent: request.get('User-Agent'),
          ip: request.ip,
        };

        const job = await this.colasService.addJob(
          balancerResult.selectedQueue.nombre,
          {
            name: `${method}-${path.replace(/\//g, '-')}`,
            data: {
              ...jobData,
              customJobId,
            },
            opts: {
              jobId: customJobId,
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 2000,
              },
              removeOnComplete: false,
              removeOnFail: false,
            },
          },
        );

        this.logger.log(
          `📋 Job creado: ${customJobId} en cola "${balancerResult.selectedQueue.nombre}" ` +
            `(carga: ${balancerResult.selectedQueue.load}) para ${method} ${path} ` +
            `usando estrategia "${balancerResult.strategy}"`,
        );

        response.setHeader('X-Queue-Processed', 'true');
        response.setHeader('X-Queue-Name', balancerResult.selectedQueue.nombre);
        response.setHeader(
          'X-Queue-Load',
          balancerResult.selectedQueue.load.toString(),
        );
        response.setHeader('X-Load-Balancer-Strategy', balancerResult.strategy);
        response.setHeader(
          'X-Available-Queues',
          balancerResult.allQueues.length.toString(),
        );
        response.setHeader('X-Job-Id', customJobId);
        response.status(202);

        return of({
          jobId: customJobId,
          message: `Job created successfully for ${method} ${path}`,
          queueName: balancerResult.selectedQueue.nombre,
          queueLoad: balancerResult.selectedQueue.load,
          strategy: balancerResult.strategy,
          availableQueues: balancerResult.allQueues.length,
          status: 'queued',
          timestamp: new Date().toISOString(),
          loadBalancing: {
            selectedQueue: balancerResult.selectedQueue,
            allQueues: balancerResult.allQueues.map((q) => ({
              nombre: q.nombre,
              load: q.totalLoad,
              workers: q.workersCount,
              waiting: q.waitingJobs,
              active: q.activeJobs,
            })),
          },
        });
      } catch (error) {
        this.logger.error(
          `❌ Error en balanceador para ${method} ${path}:`,
          error.message,
        );
        // Si falla el balanceador, continuamos con el procesamiento normal
        response.setHeader('X-Queue-Error', 'load-balancer-failed');
      }
    }

    // Si no hay endpoint asignado, continuar con el procesamiento normal
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `✅ Request ${method} ${path} procesada sincrónicamente (sin cola asignada)`,
        );
      }),
    );
  }

  /**
   * Determina si una ruta debe ser excluida de la intercepción
   */
  private shouldSkipRoute(path: string): boolean {
    const skipPaths = [
      '/api/docs',
      '/api/colas',
      '/api/workers',
      '/api/endpoints',
      '/admin/queues',
      '/health',
      '/metrics',
      '/_next',
      '/favicon.ico',
    ];

    return skipPaths.some((skipPath) => path.startsWith(skipPath));
  }

  /**
   * Limpia headers sensibles antes de almacenarlos en el job
   */
  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
