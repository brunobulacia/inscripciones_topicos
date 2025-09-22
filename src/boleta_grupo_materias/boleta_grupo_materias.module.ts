import { Module } from '@nestjs/common';
import { BoletaGrupoMateriasService } from './boleta_grupo_materias.service';
import { BoletaGrupoMateriasController } from './boleta_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BoletaGrupoMateriasController],
  providers: [BoletaGrupoMateriasService],
  exports: [BoletaGrupoMateriasService],
})
export class BoletaGrupoMateriasModule {}
