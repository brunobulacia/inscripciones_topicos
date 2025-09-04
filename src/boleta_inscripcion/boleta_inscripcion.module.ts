import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BoletaInscripcionService } from './boleta_inscripcion.service';
import { BoletaInscripcionController } from './boleta_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { BoletaInscripcionQueueService } from './services/boleta-inscripcion-queue.service';
import { BoletaInscripcionProcessor } from './processors/boleta-inscripcion.processor';
import {
  CreateBoletaInscripcionHandler,
  FindAllBoletaInscripcionHandler,
  FindOneBoletaInscripcionHandler,
  UpdateBoletaInscripcionHandler,
  DeleteBoletaInscripcionHandler,
} from './processors/handlers/boleta-inscripcion.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [BoletaInscripcionController],
  providers: [
    BoletaInscripcionService,
    BoletaInscripcionQueueService,
    BoletaInscripcionProcessor,
    CreateBoletaInscripcionHandler,
    FindAllBoletaInscripcionHandler,
    FindOneBoletaInscripcionHandler,
    UpdateBoletaInscripcionHandler,
    DeleteBoletaInscripcionHandler,
  ],
})
export class BoletaInscripcionModule {}
