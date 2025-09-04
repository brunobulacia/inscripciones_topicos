import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DetalleInsOfertasService } from './detalle_ins_ofertas.service';
import { DetalleInsOfertasController } from './detalle_ins_ofertas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { DetalleInsOfertaQueueService } from './services/detalle-ins-oferta-queue.service';
import { DetalleInsOfertaProcessor } from './processors/detalle-ins-oferta.processor';
import {
  CreateDetalleInsOfertaHandler,
  FindAllDetalleInsOfertaHandler,
  FindOneDetalleInsOfertaHandler,
  UpdateDetalleInsOfertaHandler,
  DeleteDetalleInsOfertaHandler,
} from './processors/handlers/detalle-ins-oferta.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [DetalleInsOfertasController],
  providers: [
    DetalleInsOfertasService,
    DetalleInsOfertaQueueService,
    DetalleInsOfertaProcessor,
    CreateDetalleInsOfertaHandler,
    FindAllDetalleInsOfertaHandler,
    FindOneDetalleInsOfertaHandler,
    UpdateDetalleInsOfertaHandler,
    DeleteDetalleInsOfertaHandler,
  ],
  exports: [DetalleInsOfertasService, DetalleInsOfertaQueueService],
})
export class DetalleInsOfertasModule {}
