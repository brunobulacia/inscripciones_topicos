import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullMQDashboardController } from './bullmq-dashboard.controller';
import { BullMQDashboardService } from './bullmq-dashboard.service';

@Module({
  imports: [],
  controllers: [BullMQDashboardController],
  providers: [BullMQDashboardService],
  exports: [BullMQDashboardService],
})
export class BullMQDashboardModule {}
