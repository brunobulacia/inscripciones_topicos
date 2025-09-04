import { Injectable, Logger } from '@nestjs/common';
import { JobHandler, JobHandlerRegistry } from '../types/generic-job.types';

@Injectable()
export class QueueJobHandlerRegistry implements JobHandlerRegistry {
  private readonly logger = new Logger(QueueJobHandlerRegistry.name);
  private readonly handlers = new Map<string, JobHandler>();

  register<TData, TResult>(
    entityName: string,
    operation: string,
    handler: JobHandler<TData, TResult>,
  ): void {
    const key = this.getHandlerKey(entityName, operation);
    this.handlers.set(key, handler);
    this.logger.log(`Registered handler for ${key}`);
  }

  getHandler<TData, TResult>(
    entityName: string,
    operation: string,
  ): JobHandler<TData, TResult> | undefined {
    const key = this.getHandlerKey(entityName, operation);
    return this.handlers.get(key) as JobHandler<TData, TResult> | undefined;
  }

  private getHandlerKey(entityName: string, operation: string): string {
    return `${entityName.toLowerCase()}.${operation.toLowerCase()}`;
  }

  /**
   * Lista todos los handlers registrados (útil para debugging)
   */
  listHandlers(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Verifica si existe un handler para una entidad y operación
   */
  hasHandler(entityName: string, operation: string): boolean {
    const key = this.getHandlerKey(entityName, operation);
    return this.handlers.has(key);
  }
}
