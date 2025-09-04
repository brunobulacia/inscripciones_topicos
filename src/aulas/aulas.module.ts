import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QueueCommonModule } from '../common/queue-common.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { AulaQueueService } from './services/aula-queue.service';
import { AulaProcessor } from './processors/aula.processor';
import {
  CreateAulaHandler,
  FindAllAulasHandler,
  FindOneAulaHandler,
  UpdateAulaHandler,
  DeleteAulaHandler,
} from './handlers/aula.handlers';

@Module({
  imports: [
    PrismaModule,
    QueueCommonModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [AulasController],
  providers: [
    AulasService,
    AulaQueueService,
    AulaProcessor,
    CreateAulaHandler,
    FindAllAulasHandler,
    FindOneAulaHandler,
    UpdateAulaHandler,
    DeleteAulaHandler,
  ],
})
export class AulasModule {}
