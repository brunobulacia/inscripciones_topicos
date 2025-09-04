import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { EstudianteQueueService } from './services/estudiante-queue.service';
import { EstudianteProcessor } from './processors/estudiante.processor';
import {
  CreateEstudianteHandler,
  FindAllEstudiantesHandler,
  FindOneEstudianteHandler,
  UpdateEstudianteHandler,
  DeleteEstudianteHandler,
} from './processors/handlers/estudiante.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [EstudiantesController],
  providers: [
    EstudiantesService,
    EstudianteQueueService,
    EstudianteProcessor,
    CreateEstudianteHandler,
    FindAllEstudiantesHandler,
    FindOneEstudianteHandler,
    UpdateEstudianteHandler,
    DeleteEstudianteHandler,
  ],
})
export class EstudiantesModule {}
