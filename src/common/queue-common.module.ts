import { Global, Module } from '@nestjs/common';
import { QueueJobSerializer } from './services/queue-job-serializer.service';
import { QueueJobHandlerRegistry } from './services/queue-job-handler-registry.service';

@Global()
@Module({
  providers: [QueueJobSerializer, QueueJobHandlerRegistry],
  exports: [QueueJobSerializer, QueueJobHandlerRegistry],
})
export class QueueCommonModule {}
