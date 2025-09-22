import { Module } from '@nestjs/common';
import { DetallesInscripcionService } from './detalles_inscripcion.service';
import { DetallesInscripcionController } from './detalles_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetallesInscripcionController],
  providers: [DetallesInscripcionService],
  exports: [DetallesInscripcionService],
})
export class DetallesInscripcionModule {}
