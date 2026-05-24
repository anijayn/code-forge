import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AppLogger } from '../logger/logger.service';
import { QUEUES } from './constants';

// Registers class as BullMQ Worker that listens to the specified queue
// Automatically executes process() whenever job is added to queue
@Processor(QUEUES.ANALYZE_PR)
export class AnalysisWorkerService extends WorkerHost {
  constructor(private readonly logger: AppLogger) {
    // This is required in all derived classes. It calls the constructor
    // of the parent class, so child class can use 'this' object
    super();
  }
  async process(job: Job): Promise<void> {
    this.logger.log(`Picked up job ${job.id}`);
    this.logger.log(`PR: #${job.data.prNumber} in ${job.data.repoFullName}`);
    this.logger.log(`Head SHA: ${job.data.headSha}`);

    // TODO: Implement real analysis logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`Job ${job.id} complete`);
  }
}
