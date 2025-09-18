import { Module, forwardRef } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { AutoQueueService } from './services/auto-queue.service';
import { EndpointExecutorService } from './services/endpoint-executor.service';
import { QueueInterceptor } from './interceptors/queue.interceptor';
import { EndpointProcessor } from './processors/endpoint.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { ColasModule } from '../colas/colas.module';
import { CarrerasModule } from '../carreras/carreras.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ColasModule),
    CarrerasModule,
  ],
  controllers: [EndpointsController],
  providers: [
    EndpointsService,
    AutoQueueService,
    EndpointExecutorService,
    QueueInterceptor,
    EndpointProcessor,
  ],
  exports: [
    EndpointsService,
    AutoQueueService,
    EndpointExecutorService,
    QueueInterceptor,
  ],
})
export class EndpointsModule {}