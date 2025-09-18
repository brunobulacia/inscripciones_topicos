import { Module, forwardRef } from '@nestjs/common';
import { ColasService } from './colas.service';
import { ColasController } from './colas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullMQDashboardModule } from '../bullmq-dashboard/bullmq-dashboard.module';
import { WorkersModule } from '../workers/workers.module';
import { DynamicQueuesBootstrapService } from '../common/services/dynamic-queues-bootstrap.service';

@Module({
  imports: [
    PrismaModule,
    BullMQDashboardModule,
    forwardRef(() => WorkersModule),
  ],
  controllers: [ColasController],
  providers: [ColasService, DynamicQueuesBootstrapService],
  exports: [ColasService],
})
export class ColasModule {}