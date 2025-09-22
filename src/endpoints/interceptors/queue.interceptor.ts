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

@Injectable()
export class QueueInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QueueInterceptor.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly colasService: ColasService,
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

    const endpoint = await this.endpointsService.findByRoute(path, method);

    if (endpoint) {
      this.logger.log(`🎯 Interceptando ${method} ${path} -> Cola asignada`);

      try {
        const customJobId = uuidv4();

        const jobData = {
          method,
          path,
          query: request.query,
          params: request.params,
          body: request.body,
          headers: this.sanitizeHeaders(request.headers),
          timestamp: new Date().toISOString(),
          endpointId: endpoint.id,
          userAgent: request.get('User-Agent'),
          ip: request.ip,
        };

        const cola = await this.colasService.findOne(endpoint.colaId);

        const job = await this.colasService.addJob(cola.nombre, {
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
        });

        this.logger.log(
          `📋 Job creado: ${customJobId} en cola "${cola.nombre}" para ${method} ${path}`,
        );

        response.setHeader('X-Queue-Processed', 'true');
        response.setHeader('X-Queue-Name', cola.nombre);
        response.setHeader('X-Job-Id', customJobId);
        response.status(202);

        return of({
          jobId: customJobId,
          message: `Job created successfully for ${method} ${path}`,
          queueName: cola.nombre,
          status: 'queued',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        this.logger.error(
          `❌ Error creando job para ${method} ${path}:`,
          error.message,
        );
        // Si falla la creación del job, continuamos con el procesamiento normal
        response.setHeader('X-Queue-Error', 'job-creation-failed');
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
