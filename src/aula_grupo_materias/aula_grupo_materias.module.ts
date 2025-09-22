import { Module } from '@nestjs/common';
import { AulaGrupoMateriasService } from './aula_grupo_materias.service';
import { AulaGrupoMateriasController } from './aula_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AulaGrupoMateriasController],
  providers: [AulaGrupoMateriasService],
  exports: [AulaGrupoMateriasService],
})
export class AulaGrupoMateriasModule {}
