import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SeatRequestsController } from './seat-requests.controller';
import { SeatRequestsService } from './seat-requests.service';
import { SeatRequestsWorker } from './seat-requests.worker';
import { PrismaModule } from '../prisma/prisma.module';
import { BullMQDashboardModule } from '../bullmq-dashboard/bullmq-dashboard.module';

@Module({
  imports: [
    PrismaModule,
    BullMQDashboardModule,
    BullModule.registerQueue({
      name: 'seat-processing',
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 20,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [SeatRequestsController],
  providers: [SeatRequestsService, SeatRequestsWorker],
  exports: [SeatRequestsService],
})
export class SeatRequestsModule {}
