import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AulaGrupoMateriasService } from './aula_grupo_materias.service';
import { AulaGrupoMateriasController } from './aula_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { AulaGrupoMateriaQueueService } from './services/aula-grupo-materia-queue.service';
import { AulaGrupoMateriaProcessor } from './processors/aula-grupo-materia.processor';
import {
  CreateAulaGrupoMateriaHandler,
  FindAllAulaGrupoMateriaHandler,
  FindOneAulaGrupoMateriaHandler,
  UpdateAulaGrupoMateriaHandler,
  DeleteAulaGrupoMateriaHandler,
} from './processors/handlers/aula-grupo-materia.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [AulaGrupoMateriasController],
  providers: [
    AulaGrupoMateriasService,
    AulaGrupoMateriaQueueService,
    AulaGrupoMateriaProcessor,
    CreateAulaGrupoMateriaHandler,
    FindAllAulaGrupoMateriaHandler,
    FindOneAulaGrupoMateriaHandler,
    UpdateAulaGrupoMateriaHandler,
    DeleteAulaGrupoMateriaHandler,
  ],
  exports: [AulaGrupoMateriasService, AulaGrupoMateriaQueueService],
})
export class AulaGrupoMateriasModule {}
