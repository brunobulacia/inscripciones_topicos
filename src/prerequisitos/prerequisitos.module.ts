import { Module } from '@nestjs/common';
import { PrerequisitosService } from './prerequisitos.service';
import { PrerequisitosController } from './prerequisitos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrerequisitosController],
  providers: [PrerequisitosService],
})
export class PrerequisitosModule {}
