import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AppLogger } from '../logger/logger.service';
import { QUEUES } from './constants';
import { GithubService } from '../integrations/github/github.service';
import { PrJobPayload } from './types';
import { chunkDiff, parseDiff } from '../analysis/analysis.utils';

// Registers class as BullMQ Worker that listens to the specified queue
// Automatically executes process() whenever job is added to queue
@Processor(QUEUES.ANALYZE_PR)
export class AnalysisWorkerService extends WorkerHost {
  constructor(
    private readonly logger: AppLogger,
    private readonly githubService: GithubService,
  ) {
    // This is required in all derived classes. It calls the constructor
    // of the parent class, so child class can use 'this' object
    super();
  }
  async process(job: Job<PrJobPayload>): Promise<void> {
    const {
      data: { prNumber, repoFullName, headSha },
      id,
    } = job;
    this.logger.log(`Picked up job ${id}`);
    this.logger.log(`PR: #${job.data.prNumber} in ${repoFullName}`);
    this.logger.log(`Head SHA: ${headSha}`);

    const files = await this.githubService.getPullRequestFiles(
      repoFullName,
      prNumber,
    );

    const parsedDiff = parseDiff(files);
    const chunks = chunkDiff(parsedDiff);

    this.logger.log(`Fetched ${files.length} file(s)`);
    this.logger.log(`Parsed ${parsedDiff.length} diff hunks`);
    this.logger.log(`Split into ${chunks.length} chunk(s)`);

    this.logger.log(`Job ${job.id} complete`);
  }
}
