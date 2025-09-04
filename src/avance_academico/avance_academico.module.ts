import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AvanceAcademicoService } from './avance_academico.service';
import { AvanceAcademicoController } from './avance_academico.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { AvanceAcademicoQueueService } from './services/avance-academico-queue.service';
import { AvanceAcademicoProcessor } from './processors/avance-academico.processor';
import {
  CreateAvanceAcademicoHandler,
  FindAllAvanceAcademicoHandler,
  FindOneAvanceAcademicoHandler,
  UpdateAvanceAcademicoHandler,
  DeleteAvanceAcademicoHandler,
} from './processors/handlers/avance-academico.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [AvanceAcademicoController],
  providers: [
    AvanceAcademicoService,
    AvanceAcademicoQueueService,
    AvanceAcademicoProcessor,
    CreateAvanceAcademicoHandler,
    FindAllAvanceAcademicoHandler,
    FindOneAvanceAcademicoHandler,
    UpdateAvanceAcademicoHandler,
    DeleteAvanceAcademicoHandler,
  ],
})
export class AvanceAcademicoModule {}
