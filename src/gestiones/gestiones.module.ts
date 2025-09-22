import { Module } from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import { GestionesController } from './gestiones.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GestionesController],
  providers: [GestionesService],
  exports: [GestionesService],
})
export class GestionesModule {}
