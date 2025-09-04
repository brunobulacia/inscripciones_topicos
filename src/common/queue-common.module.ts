import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueJobSerializer } from './services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from './services/queue-job-handler-registry.service';
import { QueueController } from './controllers/queue.controller';
import { JobsController } from './controllers/jobs.controller';
import { QUEUE_NAMES } from './types/queue.types';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),
  ],
  controllers: [QueueController, JobsController],
  providers: [QueueJobSerializer, QueueJobHandlerRegistry],
  exports: [QueueJobSerializer, QueueJobHandlerRegistry],
})
export class QueueCommonModule {}
