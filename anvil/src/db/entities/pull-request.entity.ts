import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';
import { WorkflowStatus } from '../types';
import { Analysis } from './analysis.entity';
import { AnalysisJob } from './analysis-job.entity';
// import { AnalysisFinding } from './analysis-finding.entity';

@Entity('pull_requests')
export class PullRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.pullRequests)
  workspace!: Workspace;

  @Column({ name: 'github_pr_id' })
  githubPrId!: number;

  @Column({ name: 'github_pr_number' })
  githubPrNumber!: number;

  @Column({ name: 'repo_full_name' })
  repoFullName!: string;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  author!: string;

  @Column({ name: 'base_branch', nullable: true })
  baseBranch!: string;

  @Column({ name: 'head_sha', nullable: true })
  headSha!: string;

  @Column({
    name: 'workflow_status',
    type: 'enum',
    enum: WorkflowStatus,
    default: WorkflowStatus.PENDING,
  })
  workflowStatus!: WorkflowStatus;

  @Column({ name: 'quality_score', nullable: true })
  qualityScore!: number; // 0-100

  @Column({ name: 'analyzed_at', nullable: true })
  analyzedAt!: Date;

  @OneToMany(() => Analysis, (analysis) => analysis.pullRequest)
  analyses!: Analysis[];

  @OneToMany(() => AnalysisJob, (job) => job.pullRequest)
  jobs!: AnalysisJob[];
}
