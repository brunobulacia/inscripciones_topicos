import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CarrerasService } from './carreras.service';
import { CarrerasController } from './carreras.controller';
import { CarreraQueueService } from './services/carrera-queue.service';
import { CarreraProcessor } from './processors/carrera.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import {
  CreateCarreraHandler,
  FindAllCarrerasHandler,
  FindOneCarreraHandler,
  UpdateCarreraHandler,
  DeleteCarreraHandler,
} from './handlers/carrera.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [CarrerasController],
  providers: [
    CarrerasService,
    CarreraQueueService,
    CarreraProcessor,
    CreateCarreraHandler,
    FindAllCarrerasHandler,
    FindOneCarreraHandler,
    UpdateCarreraHandler,
    DeleteCarreraHandler,
  ],
  exports: [CarrerasService, CarreraQueueService],
})
export class CarrerasModule {}
