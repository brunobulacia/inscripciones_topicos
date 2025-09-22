import { Module } from '@nestjs/common';
import { BoletaInscripcionService } from './boleta_inscripcion.service';
import { BoletaInscripcionController } from './boleta_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BoletaInscripcionController],
  providers: [BoletaInscripcionService],
  exports: [BoletaInscripcionService],
})
export class BoletaInscripcionModule {}
