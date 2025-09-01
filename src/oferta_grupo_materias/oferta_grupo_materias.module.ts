import { Module } from '@nestjs/common';
import { OfertaGrupoMateriasService } from './oferta_grupo_materias.service';
import { OfertaGrupoMateriasController } from './oferta_grupo_materias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OfertaGrupoMateriasController],
  providers: [OfertaGrupoMateriasService],
})
export class OfertaGrupoMateriasModule {}
