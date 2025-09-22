import { Controller, Get, Param } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { QUEUE_NAMES } from '../types/queue.types';

@ApiTags('jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(
    @InjectQueue()
    private readonly inscripcionesQueue: Queue,
  ) {}

  @Get(':jobId/status')
  @ApiOperation({ summary: 'Obtener estado de un trabajo específico' })
  @ApiParam({
    name: 'jobId',
    description: 'ID del trabajo',
    example: 'a6be5732-33a2-43bf-8b7d-13624fdb694b',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del trabajo',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID del trabajo' },
        status: {
          type: 'string',
          description: 'Estado del trabajo',
          enum: ['waiting', 'active', 'completed', 'failed', 'not_found'],
        },
        progress: {
          type: 'number',
          description: 'Progreso del trabajo (0-100)',
        },
        result: {
          type: 'object',
          description: 'Resultado del trabajo si está completado',
        },
        error: { type: 'string', description: 'Error si el trabajo falló' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trabajo no encontrado' })
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.inscripcionesQueue.getJob(jobId);

    if (!job) {
      return {
        id: jobId,
        status: 'not_found',
        message: 'Job not found',
      };
    }

    return {
      id: job.id,
      name: job.name,
      status: await job.getState(),
      progress: job.progress,
      result: job.returnvalue,
      error: job.failedReason,
      createdAt: new Date(job.timestamp),
      processedAt: job.processedOn ? new Date(job.processedOn) : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    };
  }
}
