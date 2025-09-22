import { Module } from '@nestjs/common';
import { AvanceAcademicoService } from './avance_academico.service';
import { AvanceAcademicoController } from './avance_academico.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvanceAcademicoController],
  providers: [AvanceAcademicoService],
  exports: [AvanceAcademicoService],
})
export class AvanceAcademicoModule {}
