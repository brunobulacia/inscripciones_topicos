import { Controller, Get, Post, Param } from '@nestjs/common';
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

@ApiTags('queue')
@ApiBearerAuth()
@Controller('queue')
export class QueueController {
  constructor(
    @InjectQueue(QUEUE_NAMES.INSCRIPCIONES)
    private readonly inscripcionesQueue: Queue,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas globales de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de la cola',
    schema: {
      type: 'object',
      properties: {
        stats: {
          type: 'object',
          properties: {
            waiting: { type: 'number', description: 'Trabajos en espera' },
            active: { type: 'number', description: 'Trabajos activos' },
            completed: { type: 'number', description: 'Trabajos completados' },
            failed: { type: 'number', description: 'Trabajos fallidos' },
            total: { type: 'number', description: 'Total de trabajos' },
          },
        },
        jobs: {
          type: 'object',
          properties: {
            waiting: {
              type: 'array',
              items: { type: 'object' },
              description: 'Primeros 10 trabajos en espera',
            },
            active: {
              type: 'array',
              items: { type: 'object' },
              description: 'Trabajos actualmente procesándose',
            },
            recien_completados: {
              type: 'array',
              items: { type: 'object' },
              description: 'Últimos 10 trabajos completados',
            },
            fallados: {
              type: 'array',
              items: { type: 'object' },
              description: 'Últimos 10 trabajos fallidos',
            },
          },
        },
      },
    },
  })
  async getQueueStats() {
    const waiting = await this.inscripcionesQueue.getWaiting();
    const active = await this.inscripcionesQueue.getActive();
    const completed = await this.inscripcionesQueue.getCompleted();
    const failed = await this.inscripcionesQueue.getFailed();

    return {
      stats: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total:
          waiting.length + active.length + completed.length + failed.length,
      },
      jobs: {
        waiting: waiting.slice(0, 10).map((job) => ({
          id: job.id,
          name: job.name,
          data: job.data,
          createdAt: new Date(job.timestamp).toISOString(),
        })),
        active: active.map((job) => ({
          id: job.id,
          name: job.name,
          data: job.data,
          processedAt: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
        })),
        recien_completados: completed.slice(-10).map((job) => ({
          id: job.id,
          name: job.name,
          result: job.returnvalue,
          processedAt: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
          completedAt: job.finishedOn
            ? new Date(job.finishedOn).toISOString()
            : null,
        })),
        fallados: failed.slice(-10).map((job) => ({
          id: job.id,
          name: job.name,
          error: job.failedReason,
          failedAt:
            job.failedReason && job.finishedOn
              ? new Date(job.finishedOn).toISOString()
              : job.processedOn
                ? new Date(job.processedOn).toISOString()
                : new Date().toISOString(),
        })),
      },
    };
  }
  @Post('clear')
  @ApiOperation({ summary: 'Limpiar completamente la cola global' })
  @ApiResponse({
    status: 200,
    description: 'Cola limpiada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cola limpiada exitosamente' },
      },
    },
  })
  async clearQueue() {
    await this.inscripcionesQueue.obliterate({ force: true });
    return { message: 'Cola limpiada exitosamente' };
  }

  @Post('stop')
  async stopQueue() {
    await this.inscripcionesQueue.pause();
    return { message: 'Cola detenida exitosamente' };
  }

  @Post('start')
  async startQueue() {
    await this.inscripcionesQueue.resume();
    return { message: 'Cola iniciada exitosamente' };
  }
}
