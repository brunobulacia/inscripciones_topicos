import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GMOfertaController } from './gMOferta.controller';
import { GMOfertaService } from './gMOferta.service';

@Module({
  imports: [PrismaModule],
  providers: [GMOfertaService],
  controllers: [GMOfertaController],
})
export class GMOfertaModule {}
