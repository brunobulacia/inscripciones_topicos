import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PlanesDeEstudioService } from './planes_de_estudio.service';
import { PlanesDeEstudioController } from './planes_de_estudio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { PlanDeEstudioQueueService } from './services/plan-de-estudio-queue.service';
import { PlanDeEstudioProcessor } from './processors/plan-de-estudio.processor';
import {
  CreatePlanDeEstudioHandler,
  FindAllPlanesDeEstudioHandler,
  FindOnePlanDeEstudioHandler,
  UpdatePlanDeEstudioHandler,
  DeletePlanDeEstudioHandler,
} from './processors/handlers/plan-de-estudio.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [PlanesDeEstudioController],
  providers: [
    PlanesDeEstudioService,
    PlanDeEstudioQueueService,
    PlanDeEstudioProcessor,
    CreatePlanDeEstudioHandler,
    FindAllPlanesDeEstudioHandler,
    FindOnePlanDeEstudioHandler,
    UpdatePlanDeEstudioHandler,
    DeletePlanDeEstudioHandler,
  ],
})
export class PlanesDeEstudioModule {}
