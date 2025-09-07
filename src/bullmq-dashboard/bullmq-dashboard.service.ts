import { Injectable } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { Request, Response } from 'express';

@Injectable()
export class BullMQDashboardService {
  private serverAdapter: ExpressAdapter;
  private bullBoard: ReturnType<typeof createBullBoard>;
  private queues: Queue[] = [];

  constructor() {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/admin/queues');

    this.bullBoard = createBullBoard({
      queues: [],
      serverAdapter: this.serverAdapter,
    });
  }

  /**
   * Agregar una cola al dashboard
   * @param queue - La cola de BullMQ a agregar
   */
  addQueue(queue: Queue): void {
    this.queues.push(queue);
    this.bullBoard.addQueue(new BullMQAdapter(queue));
  }

  /**
   * Remover una cola del dashboard
   * @param queueName - El nombre de la cola a remover
   */
  removeQueue(queueName: string): void {
    const index = this.queues.findIndex((queue) => queue.name === queueName);
    if (index !== -1) {
      this.bullBoard.removeQueue(queueName);
      this.queues.splice(index, 1);
    }
  }

  /**
   * Obtener el router de Express para el dashboard
   */
  getRouter() {
    return this.serverAdapter.getRouter();
  }

  /**
   * Middleware para proteger el dashboard (opcional)
   */
  createAuthMiddleware() {
    return (req: Request, res: Response, next: Function) => {
      // Aquí puedes agregar tu lógica de autenticación
      // Por ejemplo, verificar JWT, session, etc.

      // Para desarrollo, permitir acceso libre
      if (process.env.NODE_ENV === 'development') {
        return next();
      }

      // En producción, puedes agregar autenticación
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Verificar el token aquí
      // const token = authHeader.substring(7);
      // ... lógica de verificación

      next();
    };
  }

  /**
   * Obtener estadísticas de todas las colas
   */
  async getQueuesStats() {
    const stats: Array<{
      name: string;
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    }> = [];

    for (const queue of this.queues) {
      const waiting = await queue.getWaiting();
      const active = await queue.getActive();
      const completed = await queue.getCompleted();
      const failed = await queue.getFailed();
      const delayed = await queue.getDelayed();

      stats.push({
        name: queue.name,
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      });
    }

    return stats;
  }
}
