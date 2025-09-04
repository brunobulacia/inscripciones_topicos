import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PeriodosService } from './periodos.service';
import { PeriodosController } from './periodos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { PeriodoQueueService } from './services/periodo-queue.service';
import { PeriodoProcessor } from './processors/periodo.processor';
import {
  CreatePeriodoHandler,
  FindAllPeriodosHandler,
  FindOnePeriodoHandler,
  UpdatePeriodoHandler,
  DeletePeriodoHandler,
} from './processors/handlers/periodo.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [PeriodosController],
  providers: [
    PeriodosService,
    PeriodoQueueService,
    PeriodoProcessor,
    CreatePeriodoHandler,
    FindAllPeriodosHandler,
    FindOnePeriodoHandler,
    UpdatePeriodoHandler,
    DeletePeriodoHandler,
  ],
})
export class PeriodosModule {}
