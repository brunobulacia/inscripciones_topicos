import { Module, forwardRef } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EndpointsModule } from '../endpoints/endpoints.module';

@Module({
  imports: [PrismaModule, forwardRef(() => EndpointsModule)],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}