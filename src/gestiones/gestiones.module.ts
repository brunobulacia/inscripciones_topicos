import { Module } from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import { GestionesController } from './gestiones.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { QueueCommonModule } from '../common/queue-common.module';
import { GestionQueueService } from './services/gestion-queue.service';
import { GestionProcessor } from './processors/gestion.processor';
import {
  CreateGestionHandler,
  FindAllGestionesHandler,
  FindOneGestionHandler,
  UpdateGestionHandler,
  DeleteGestionHandler,
} from './handlers/gestion.handlers';

@Module({
  imports: [
    PrismaModule,
    QueueCommonModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [GestionesController],
  providers: [
    GestionesService,
    GestionQueueService,
    GestionProcessor,
    CreateGestionHandler,
    FindAllGestionesHandler,
    FindOneGestionHandler,
    UpdateGestionHandler,
    DeleteGestionHandler,
  ],
  exports: [GestionesService, GestionQueueService],
})
export class GestionesModule {}
