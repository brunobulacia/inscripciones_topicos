import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrerequisitosService } from './prerequisitos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QueueCommonModule } from '../common/queue-common.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { PrerequisitQueueService } from './services/prerequisito-queue.service';
import { PrerequisitProcessor } from './processors/prerequisito.processor';
import { PrerequisitosController } from './prerequisitos.controller';
import {
  CreatePrerequisitHandler,
  FindAllPrerequisitHandler,
  FindOnePrerequisitHandler,
  UpdatePrerequisitHandler,
  DeletePrerequisitHandler,
} from './processors/handlers/prerequisito.handlers';

@Module({
  imports: [
    PrismaModule,
    QueueCommonModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [PrerequisitosController],
  providers: [
    PrerequisitosService,
    PrerequisitQueueService,
    PrerequisitProcessor,
    CreatePrerequisitHandler,
    FindAllPrerequisitHandler,
    FindOnePrerequisitHandler,
    UpdatePrerequisitHandler,
    DeletePrerequisitHandler,
  ],
  exports: [PrerequisitQueueService, PrerequisitosService],
})
export class PrerequisitosModule {}
