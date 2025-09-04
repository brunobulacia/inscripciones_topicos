import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BoletaGrupoMateriasService } from './boleta_grupo_materias.service';
import { BoletaGrupoMateriasController } from './boleta_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { BoletaGrupoMateriaQueueService } from './services/boleta-grupo-materia-queue.service';
import { BoletaGrupoMateriaProcessor } from './processors/boleta-grupo-materia.processor';
import {
  CreateBoletaGrupoMateriaHandler,
  FindAllBoletaGrupoMateriaHandler,
  FindOneBoletaGrupoMateriaHandler,
  UpdateBoletaGrupoMateriaHandler,
  DeleteBoletaGrupoMateriaHandler,
} from './processors/handlers/boleta-grupo-materia.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [BoletaGrupoMateriasController],
  providers: [
    BoletaGrupoMateriasService,
    BoletaGrupoMateriaQueueService,
    BoletaGrupoMateriaProcessor,
    CreateBoletaGrupoMateriaHandler,
    FindAllBoletaGrupoMateriaHandler,
    FindOneBoletaGrupoMateriaHandler,
    UpdateBoletaGrupoMateriaHandler,
    DeleteBoletaGrupoMateriaHandler,
  ],
})
export class BoletaGrupoMateriasModule {}
