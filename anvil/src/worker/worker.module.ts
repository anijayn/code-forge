import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull-queue.module';
import { AnalysisWorkerService } from './worker.service';

@Module({
  imports: [BullQueueModule],
  providers: [AnalysisWorkerService],
})
export class WorkerModule {}
