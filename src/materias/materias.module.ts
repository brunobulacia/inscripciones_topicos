import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { MateriaQueueService } from './services/materia-queue.service';
import { MateriaProcessor } from './processors/materia.processor';
import {
  CreateMateriaHandler,
  FindAllMateriaHandler,
  FindOneMateriaHandler,
  UpdateMateriaHandler,
  DeleteMateriaHandler,
} from './processors/handlers/materia.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [MateriasController],
  providers: [
    MateriasService,
    MateriaQueueService,
    MateriaProcessor,
    CreateMateriaHandler,
    FindAllMateriaHandler,
    FindOneMateriaHandler,
    UpdateMateriaHandler,
    DeleteMateriaHandler,
  ],
  exports: [MateriasService, MateriaQueueService],
})
export class MateriasModule {}
