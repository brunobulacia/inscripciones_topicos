import { Module } from '@nestjs/common';
import { GrupoMateriasService } from './grupo_materias.service';
import { GrupoMateriasController } from './grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GrupoMateriasController],
  providers: [GrupoMateriasService],
  exports: [GrupoMateriasService],
})
export class GrupoMateriasModule {}
