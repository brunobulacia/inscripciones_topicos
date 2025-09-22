import { Module } from '@nestjs/common';
import { PlanesDeEstudioService } from './planes_de_estudio.service';
import { PlanesDeEstudioController } from './planes_de_estudio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlanesDeEstudioController],
  providers: [PlanesDeEstudioService],
  exports: [PlanesDeEstudioService],
})
export class PlanesDeEstudioModule {}
