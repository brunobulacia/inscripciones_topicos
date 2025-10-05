import { Module } from '@nestjs/common';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';
import { InscripcionAsyncController } from './inscripcion-async.controller';
import { InscripcionAsyncService } from './inscripcion-async.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatRequestsModule } from 'src/seat-requests/seat-requests.module';

@Module({
  imports: [PrismaModule, SeatRequestsModule],
  providers: [InscripcionService, InscripcionAsyncService],
  controllers: [InscripcionController, InscripcionAsyncController],
  exports: [InscripcionService, InscripcionAsyncService],
})
export class InscripcionModule {}
