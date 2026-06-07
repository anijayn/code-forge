import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull-queue.module';
import { AnalysisWorkerService } from './worker.service';
import { GithubModule } from '../integrations/github/github.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequest } from '../db/entities/pull-request.entity';
import { Analysis } from '../db/entities/analysis.entity';

@Module({
  imports: [
    BullQueueModule,
    GithubModule,
    AnalysisModule,
    TypeOrmModule.forFeature([PullRequest, Analysis]),
  ],
  providers: [AnalysisWorkerService],
})
export class WorkerModule {}
