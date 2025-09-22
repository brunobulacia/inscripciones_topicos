import { Module } from '@nestjs/common';
import { PrerequisitosService } from './prerequisitos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrerequisitosController } from './prerequisitos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PrerequisitosController],
  providers: [PrerequisitosService],
  exports: [PrerequisitosService],
})
export class PrerequisitosModule {}
