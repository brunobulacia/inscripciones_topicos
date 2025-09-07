import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullMQDashboardController } from './bullmq-dashboard.controller';
import { QueueRegistrationService } from './queue-registration.service';
import { QUEUE_NAMES } from '../common/types/queue.types';
import { BullMQDashboardService } from './bullmq-dashboard.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [BullMQDashboardController],
  providers: [BullMQDashboardService, QueueRegistrationService],
  exports: [BullMQDashboardService],
})
export class BullMQDashboardModule {}
