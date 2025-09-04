import { Injectable } from '@nestjs/common';
import {
  JobSerializer,
  SerializedJob,
  GenericJobPayload,
} from '../types/generic-job.types';

@Injectable()
export class QueueJobSerializer implements JobSerializer {
  private readonly JOB_NAME_PATTERN =
    /^(CREATE|FIND_ALL|FIND_ONE|UPDATE|DELETE)_(.+)$/;

  // Nuevo patrón para el formato entity_operation que estamos usando
  private readonly ENTITY_OPERATION_PATTERN =
    /^(.+)_(create|find_all|find_one|update|delete)$/;

  serialize(jobName: string, data: any): SerializedJob {
    const match = jobName.match(this.JOB_NAME_PATTERN);

    if (!match) {
      throw new Error(
        `Invalid job name format: ${jobName}. Expected format: OPERATION_ENTITY`,
      );
    }

    const [, operation, entityName] = match;

    return {
      entityName: entityName.toLowerCase(),
      operation: operation as any,
      payload: data,
      timestamp: Date.now(),
    };
  }

  deserialize(serializedJob: SerializedJob): GenericJobPayload {
    const jobType = `${serializedJob.operation}_${serializedJob.entityName.toUpperCase()}`;

    return {
      jobType,
      entityName: serializedJob.entityName,
      operation: serializedJob.operation as any,
      data: serializedJob.payload,
    };
  }

  /**
   * Extrae información del nombre del job para routing
   */
  parseJobName(jobName: string): { entity: string; operation: string } {
    // Primero intentamos el nuevo patrón entity_operation
    const entityOpMatch = jobName.match(this.ENTITY_OPERATION_PATTERN);

    if (entityOpMatch) {
      const [, entityName, operation] = entityOpMatch;
      return {
        entity: this.convertToSingular(entityName.toLowerCase()),
        operation: operation.toLowerCase(),
      };
    }

    // Fallback al patrón original OPERATION_ENTITY
    const match = jobName.match(this.JOB_NAME_PATTERN);

    if (!match) {
      throw new Error(
        `Invalid job name format: ${jobName}. Expected formats: 'entity_operation' or 'OPERATION_ENTITY'`,
      );
    }

    const [, operation, entityName] = match;

    return {
      entity: this.convertToSingular(entityName.toLowerCase()),
      operation: operation.toLowerCase(),
    };
  }

  /**
   * Convierte nombres de entidades en plural a singular para el routing
   */
  private convertToSingular(entityName: string): string {
    // Mapeo específico para casos especiales
    const singularMap: Record<string, string> = {
      carreras: 'carrera',
      niveles: 'nivel',
      materias: 'materia',
      estudiantes: 'estudiante',
      docentes: 'docente',
      gestiones: 'gestion',
      periodos: 'periodo',
      modulos: 'modulo',
      // Agregar más mappings según necesidad
    };

    return singularMap[entityName] || entityName;
  }
}
