import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CarrerasService } from './carreras.service';
import { CarrerasController } from './carreras.controller';
import { CarreraQueueService } from './services/carrera-queue.service';
import { CarreraProcessor } from './processors/carrera.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.CARRERAS,
    }),
  ],
  controllers: [CarrerasController],
  providers: [CarrerasService, CarreraQueueService, CarreraProcessor],
  exports: [CarrerasService, CarreraQueueService],
})
export class CarrerasModule {}
