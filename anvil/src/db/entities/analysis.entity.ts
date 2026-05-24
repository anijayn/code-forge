import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PullRequest } from './pull-request.entity';
import { AnalysisType, Severity } from '../types';

@Entity('analyses')
export class Analysis extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PullRequest, (pr) => pr.analyses, { onDelete: 'CASCADE' })
  pullRequest!: PullRequest;

  @Column({ name: 'analysis_type', type: 'enum', enum: AnalysisType })
  analysisType!: AnalysisType;

  @Column({ name: 'file_path' })
  filePath!: string;

  @Column({ name: 'line_number', nullable: true })
  lineNumber?: number;

  @Column({ type: 'enum', enum: Severity, nullable: true })
  severity?: Severity;

  @Column({ name: 'explanation', type: 'text', nullable: true })
  explanation?: string;

  @Column({ name: 'fix_suggestion', type: 'text', nullable: true })
  fixSuggestion?: string;

  @Column({ name: 'github_comment_id', nullable: true })
  githubCommentId?: number;
}
