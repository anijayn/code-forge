import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PullRequest } from './pull-request.entity';
import { AnalysisType, AnalysisJobStatus } from '../types';

@Entity('analysis_jobs')
export class AnalysisJob extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PullRequest, (pr) => pr.jobs)
  pullRequest!: PullRequest;

  @Column({
    name: 'worker_type',
    type: 'enum',
    enum: AnalysisType,
  })
  workerType!: AnalysisType;

  @Column({
    type: 'enum',
    enum: AnalysisJobStatus,
    default: AnalysisJobStatus.QUEUED,
  })
  status!: AnalysisJobStatus;

  @Column({ name: 'bull_job_id', nullable: true })
  bullJobId?: string;

  @Column({ name: 'started_at', nullable: true, type: 'timestamp' })
  startedAt?: Date;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamp' })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  error?: string;
}
