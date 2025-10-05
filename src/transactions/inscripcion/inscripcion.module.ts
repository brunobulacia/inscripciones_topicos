import { Module } from '@nestjs/common';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InscripcionService],
  controllers: [InscripcionController],
  exports: [InscripcionService],
})
export class InscripcionModule {}
