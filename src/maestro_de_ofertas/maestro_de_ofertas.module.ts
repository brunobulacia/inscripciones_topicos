import { Module } from '@nestjs/common';
import { MaestroDeOfertasService } from './maestro_de_ofertas.service';
import { MaestroDeOfertasController } from './maestro_de_ofertas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaestroDeOfertasController],
  providers: [MaestroDeOfertasService],
  exports: [MaestroDeOfertasService],
})
export class MaestroDeOfertasModule {}
