import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BullMQDashboardService } from '../bullmq-dashboard/bullmq-dashboard.service';
import { ColasService } from '../colas/colas.service';

@Injectable()
export class QueueRegistrationService implements OnApplicationBootstrap {
  constructor(
    private dashboardService: BullMQDashboardService,
    private colasService: ColasService,
  ) {}

  async onApplicationBootstrap() {
    // Registrar todas las colas dinámicas en el dashboard
    try {
      // Obtener todas las colas dinámicas del servicio
      const dinamicQueues = this.colasService.getDinamicQueues();

      // Registrar cada cola en el dashboard
      for (const [queueName, queue] of dinamicQueues.entries()) {
        this.dashboardService.addQueue(queue);
        console.log(`✅ Cola '${queueName}' registrada en el dashboard`);
      }

      console.log('✅ Todas las colas registradas en el dashboard de BullMQ');
      console.log(
        `📊 Dashboard disponible en: http://localhost:3000/admin/queues`,
      );
      console.log(
        `📈 API de estadísticas en: http://localhost:3000/api/admin/queues/stats`,
      );
    } catch (error) {
      console.error('❌ Error al registrar colas en el dashboard:', error);
    }
  }
}
