import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EndpointExecutorService } from '../services/endpoint-executor.service';

@Processor('*', { name: 'endpoint-processor' })
export class EndpointProcessor extends WorkerHost {
  private readonly logger = new Logger(EndpointProcessor.name);

  constructor(private readonly endpointExecutorService: EndpointExecutorService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { method, path, query, params, body, headers, timestamp, endpointId, userAgent, ip, customJobId } = job.data;
    
    this.logger.log(`🔄 Procesando job ${customJobId}: ${method} ${path}`);

    try {
      // Ejecutar el endpoint real
      const endpointResult = await this.endpointExecutorService.executeEndpoint(method, path, {
        query,
        params,
        body,
        headers,
        timestamp,
        endpointId,
        userAgent,
        ip,
        customJobId
      });

      // Retornar el resultado completo
      const result = {
        success: true,
        message: `Job "${job.name}" procesado exitosamente`,
        jobId: customJobId,
        endpoint: {
          method,
          path,
          timestamp
        },
        data: endpointResult, // Aquí va el resultado real del endpoint
        processedAt: new Date().toISOString(),
        executionInfo: {
          worker: job.queueName,
          processingTime: Date.now() - job.timestamp,
          attempts: job.attemptsMade + 1
        }
      };

      this.logger.log(`✅ Job ${customJobId} completado exitosamente`);
      return result;

    } catch (error) {
      this.logger.error(`❌ Error procesando job ${customJobId}:`, error.message);
      
      // Retornar información del error
      const errorResult = {
        success: false,
        message: `Job "${job.name}" falló durante el procesamiento`,
        jobId: customJobId,
        endpoint: {
          method,
          path,
          timestamp
        },
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        processedAt: new Date().toISOString(),
        executionInfo: {
          worker: job.queueName,
          processingTime: Date.now() - job.timestamp,
          attempts: job.attemptsMade + 1
        }
      };

      throw new Error(JSON.stringify(errorResult));
    }
  }
}