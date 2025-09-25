import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ColasService } from '../../colas/colas.service';
import { WorkersService } from '../../workers/workers.service';

@Injectable()
export class DynamicQueuesBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DynamicQueuesBootstrapService.name);

  constructor(
    private readonly colasService: ColasService,
    private readonly workersService: WorkersService,
  ) {}

  async onApplicationBootstrap() {
    try {
      console.log('\nIniciando sistema de colas dinámicas\n');

      // Inicializar colas existentes
      await this.colasService.initializeExistingQueues();

      await this.workersService.initializeExistingWorkers();

      this.logger.log(
        '\nSistema de colas dinámicas inicializado correctamente',
      );
      this.logger.log(
        'Dashboard disponible en: http://localhost:3000/admin/queues',
      );
      this.logger.log(
        'API de colas disponible en: http://localhost:3000/api/colas',
      );
      this.logger.log(
        'API de workers disponible en: http://localhost:3000/api/workers',
      );
    } catch (error) {
      this.logger.error('Error iniciando sistema de colas dinámicas:', error);
    }
  }
}
