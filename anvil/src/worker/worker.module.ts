import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull-queue.module';
import { AnalysisWorkerService } from './worker.service';
import { GithubModule } from '../integrations/github/github.module';

@Module({
  imports: [BullQueueModule, GithubModule],
  providers: [AnalysisWorkerService],
})
export class WorkerModule {}
