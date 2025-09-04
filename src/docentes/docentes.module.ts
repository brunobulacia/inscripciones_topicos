import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocentesService } from './docentes.service';
import { DocentesController } from './docentes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QueueCommonModule } from '../common/queue-common.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { DocenteQueueService } from './services/docente-queue.service';
import { DocenteProcessor } from './processors/docente.processor';
import {
  CreateDocenteHandler,
  FindAllDocentesHandler,
  FindOneDocenteHandler,
  UpdateDocenteHandler,
  DeleteDocenteHandler,
} from './handlers/docente.handlers';

@Module({
  imports: [
    PrismaModule,
    QueueCommonModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [DocentesController],
  providers: [
    DocentesService,
    DocenteQueueService,
    DocenteProcessor,
    CreateDocenteHandler,
    FindAllDocentesHandler,
    FindOneDocenteHandler,
    UpdateDocenteHandler,
    DeleteDocenteHandler,
  ],
})
export class DocentesModule {}
