import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NivelesService } from './niveles.service';
import { NivelesController } from './niveles.controller';
import { NivelQueueService } from './services/nivel-queue.service';
import { NivelProcessor } from './processors/nivel.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import {
  CreateNivelHandler,
  FindAllNivelesHandler,
  FindOneNivelHandler,
  UpdateNivelHandler,
  DeleteNivelHandler,
} from './handlers/nivel.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [NivelesController],
  providers: [
    NivelesService,
    NivelQueueService,
    NivelProcessor,
    CreateNivelHandler,
    FindAllNivelesHandler,
    FindOneNivelHandler,
    UpdateNivelHandler,
    DeleteNivelHandler,
  ],
  exports: [NivelesService, NivelQueueService],
})
export class NivelesModule {}
