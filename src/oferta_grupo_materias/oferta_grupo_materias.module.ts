import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OfertaGrupoMateriasService } from './oferta_grupo_materias.service';
import { OfertaGrupoMateriasController } from './oferta_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { OfertaGrupoMateriaQueueService } from './services/oferta-grupo-materia-queue.service';
import { OfertaGrupoMateriaProcessor } from './processors/oferta-grupo-materia.processor';
import {
  CreateOfertaGrupoMateriaHandler,
  FindAllOfertaGrupoMateriaHandler,
  FindOneOfertaGrupoMateriaHandler,
  UpdateOfertaGrupoMateriaHandler,
  DeleteOfertaGrupoMateriaHandler,
} from './processors/handlers/oferta-grupo-materia.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [OfertaGrupoMateriasController],
  providers: [
    OfertaGrupoMateriasService,
    OfertaGrupoMateriaQueueService,
    OfertaGrupoMateriaProcessor,
    CreateOfertaGrupoMateriaHandler,
    FindAllOfertaGrupoMateriaHandler,
    FindOneOfertaGrupoMateriaHandler,
    UpdateOfertaGrupoMateriaHandler,
    DeleteOfertaGrupoMateriaHandler,
  ],
  exports: [OfertaGrupoMateriasService, OfertaGrupoMateriaQueueService],
})
export class OfertaGrupoMateriasModule {}
