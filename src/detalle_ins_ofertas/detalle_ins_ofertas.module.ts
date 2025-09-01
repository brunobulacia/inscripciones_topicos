import { Module } from '@nestjs/common';
import { DetalleInsOfertasService } from './detalle_ins_ofertas.service';
import { DetalleInsOfertasController } from './detalle_ins_ofertas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetalleInsOfertasController],
  providers: [DetalleInsOfertasService],
})
export class DetalleInsOfertasModule {}
