import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QueueCommonModule } from '../common/queue-common.module';
import { QUEUE_NAMES } from '../common/types/queue.types';

// Queue services
import { HorarioQueueService } from './services/horario-queue.service';

// Processors
import { HorarioProcessor } from './processors/horario.processor';

// Handlers
import {
  CreateHorarioHandler,
  FindAllHorariosHandler,
  FindOneHorarioHandler,
  UpdateHorarioHandler,
  DeleteHorarioHandler,
} from './processors/handlers/horario.handlers';

@Module({
  imports: [
    PrismaModule,
    QueueCommonModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [HorariosController],
  providers: [
    HorariosService,
    HorarioQueueService,
    HorarioProcessor,
    CreateHorarioHandler,
    FindAllHorariosHandler,
    FindOneHorarioHandler,
    UpdateHorarioHandler,
    DeleteHorarioHandler,
  ],
  exports: [HorariosService, HorarioQueueService],
})
export class HorariosModule {}
