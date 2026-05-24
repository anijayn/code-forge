import { Module } from '@nestjs/common';
import { BullCoreModule } from './bull-core.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from './constants';

@Module({
  imports: [
    BullCoreModule,
    BullModule.registerQueue({
      name: QUEUES.ANALYZE_PR,
    }),
  ],
})
export class BullQueueModule {}
