import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FichasInscripcionService } from './fichas_inscripcion.service';
import { FichasInscripcionController } from './fichas_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { FichaInscripcionQueueService } from './services/ficha-inscripcion-queue.service';
import { FichaInscripcionProcessor } from './processors/ficha-inscripcion.processor';
import {
  CreateFichaInscripcionHandler,
  FindAllFichaInscripcionHandler,
  FindOneFichaInscripcionHandler,
  UpdateFichaInscripcionHandler,
  DeleteFichaInscripcionHandler,
} from './processors/handlers/ficha-inscripcion.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [FichasInscripcionController],
  providers: [
    FichasInscripcionService,
    FichaInscripcionQueueService,
    FichaInscripcionProcessor,
    CreateFichaInscripcionHandler,
    FindAllFichaInscripcionHandler,
    FindOneFichaInscripcionHandler,
    UpdateFichaInscripcionHandler,
    DeleteFichaInscripcionHandler,
  ],
})
export class FichasInscripcionModule {}
