import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { GrupoMateriasService } from './grupo_materias.service';
import { GrupoMateriasController } from './grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { GrupoMateriaQueueService } from './services/grupo-materia-queue.service';
import { GrupoMateriaProcessor } from './processors/grupo-materia.processor';
import {
  CreateGrupoMateriaHandler,
  FindAllGrupoMateriaHandler,
  FindOneGrupoMateriaHandler,
  UpdateGrupoMateriaHandler,
  DeleteGrupoMateriaHandler,
} from './processors/handlers/grupo-materia.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [GrupoMateriasController],
  providers: [
    GrupoMateriasService,
    GrupoMateriaQueueService,
    GrupoMateriaProcessor,
    CreateGrupoMateriaHandler,
    FindAllGrupoMateriaHandler,
    FindOneGrupoMateriaHandler,
    UpdateGrupoMateriaHandler,
    DeleteGrupoMateriaHandler,
  ],
  exports: [GrupoMateriasService, GrupoMateriaQueueService],
})
export class GrupoMateriasModule {}
