import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MaestroDeOfertasService } from './maestro_de_ofertas.service';
import { MaestroDeOfertasController } from './maestro_de_ofertas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { MaestroDeOfertaQueueService } from './services/maestro-de-oferta-queue.service';
import { MaestroDeOfertaProcessor } from './processors/maestro-de-oferta.processor';
import {
  CreateMaestroDeOfertaHandler,
  DeleteMaestroDeOfertaHandler,
  FindAllMaestroDeOfertasHandler,
  FindOneMaestroDeOfertaHandler,
  UpdateMaestroDeOfertaHandler,
} from './processors/handlers/maestro-de-oferta.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [MaestroDeOfertasController],
  providers: [
    MaestroDeOfertasService,
    MaestroDeOfertaQueueService,
    MaestroDeOfertaProcessor,
    CreateMaestroDeOfertaHandler,
    DeleteMaestroDeOfertaHandler,
    FindAllMaestroDeOfertasHandler,
    FindOneMaestroDeOfertaHandler,
    UpdateMaestroDeOfertaHandler,
  ],
})
export class MaestroDeOfertasModule {}
