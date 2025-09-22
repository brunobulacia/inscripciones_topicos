import { Module } from '@nestjs/common';
import { FichasInscripcionService } from './fichas_inscripcion.service';
import { FichasInscripcionController } from './fichas_inscripcion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FichasInscripcionController],
  providers: [FichasInscripcionService],
  exports: [FichasInscripcionService],
})
export class FichasInscripcionModule {}
