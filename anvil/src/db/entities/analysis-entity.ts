import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PullRequest } from './pull-request.entity';
import { AnalysisType, Severity } from '../types';

@Entity('analysis')
export class Analysis extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PullRequest, (pr) => pr.analyses)
  pullRequest!: PullRequest;

  @Column({ name: 'analysis_type' })
  analysisType!: AnalysisType;

  @Column({ name: 'file_path' })
  filePath!: string;

  @Column({ name: 'line_number', nullable: true })
  lineNumber!: number;

  @Column({ nullable: true })
  severity!: Severity;

  @Column({ type: 'text', nullable: true })
  explanation!: string;

  @Column({ name: 'fix_suggestion', type: 'text', nullable: true })
  fixSuggestion!: string;

  @Column({ name: 'github_comment_id', nullable: true })
  githubCommentId!: number;
}
