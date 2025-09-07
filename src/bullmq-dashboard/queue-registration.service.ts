import { Injectable, OnApplicationBootstrap, Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BullMQDashboardService } from '../bullmq-dashboard/bullmq-dashboard.service';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../common/types/queue.types';

@Injectable()
export class QueueRegistrationService implements OnApplicationBootstrap {
  constructor(
    @Inject(getQueueToken(QUEUE_NAMES.INSCRIPCIONES))
    private inscripcionesQueue: Queue,
    private dashboardService: BullMQDashboardService,
  ) {}

  async onApplicationBootstrap() {
    // Registrar todas las colas en el dashboard
    this.dashboardService.addQueue(this.inscripcionesQueue);

    console.log('✅ Colas registradas en el dashboard de BullMQ');
    console.log(
      `📊 Dashboard disponible en: http://localhost:3000/admin/queues`,
    );
    console.log(
      `📈 API de estadísticas en: http://localhost:3000/api/admin/queues/stats`,
    );
  }
}
