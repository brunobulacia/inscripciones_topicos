import { Module } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { ModulosController } from './modulos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { ModuloQueueService } from './services/modulo-queue.service';
import { ModuloProcessor } from './processors/modulo.processor';
import {
  CreateModuloHandler,
  FindAllModulosHandler,
  FindOneModuloHandler,
  UpdateModuloHandler,
  DeleteModuloHandler,
} from './handlers/modulo.handlers';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [ModulosController],
  providers: [
    ModulosService,
    ModuloQueueService,
    ModuloProcessor,
    CreateModuloHandler,
    FindAllModulosHandler,
    FindOneModuloHandler,
    UpdateModuloHandler,
    DeleteModuloHandler,
  ],
  exports: [ModulosService, ModuloQueueService],
})
export class ModulosModule {}
