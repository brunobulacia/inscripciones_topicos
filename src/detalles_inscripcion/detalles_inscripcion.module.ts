import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DetallesInscripcionService } from './detalles_inscripcion.service';
import { DetallesInscripcionController } from './detalles_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { DetalleInscripcionQueueService } from './services/detalle-inscripcion-queue.service';
import { DetalleInscripcionProcessor } from './processors/detalle-inscripcion.processor';
import {
  CreateDetalleInscripcionHandler,
  FindAllDetalleInscripcionHandler,
  FindOneDetalleInscripcionHandler,
  UpdateDetalleInscripcionHandler,
  DeleteDetalleInscripcionHandler,
} from './processors/handlers/detalle-inscripcion.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [DetallesInscripcionController],
  providers: [
    DetallesInscripcionService,
    DetalleInscripcionQueueService,
    DetalleInscripcionProcessor,
    CreateDetalleInscripcionHandler,
    FindAllDetalleInscripcionHandler,
    FindOneDetalleInscripcionHandler,
    UpdateDetalleInscripcionHandler,
    DeleteDetalleInscripcionHandler,
  ],
  exports: [DetallesInscripcionService, DetalleInscripcionQueueService],
})
export class DetallesInscripcionModule {}
