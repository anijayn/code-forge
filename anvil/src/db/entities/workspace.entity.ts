import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspacePlan } from '../types';
import { BaseEntity } from './base.entity';
import { PullRequest } from './pull-request.entity';

// "!" is required because TypeORM assigns values at runtime and TypeScript cannot detect this initialization.
@Entity('workspaces')
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'github_org', nullable: true })
  githubOrg!: string;

  @Column({ type: 'enum', enum: WorkspacePlan, default: WorkspacePlan.FREE })
  plan!: WorkspacePlan;

  @OneToMany(() => PullRequest, (pr) => pr.workspace)
  pullRequests!: PullRequest[];
}
