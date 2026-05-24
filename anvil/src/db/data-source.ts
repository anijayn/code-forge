// This is a standalone TypeORM configuration file used by the CLI
// to connect to the database and locate entities/migrations outside NestJS runtime.
// We use ts-node to run this typescript file without compiling it into js file

import { DataSource } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { PullRequest } from './entities/pull-request.entity';
import { Analysis } from './entities/analysis.entity';
import { AnalysisJob } from './entities/analysis-job.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Workspace, PullRequest, Analysis, AnalysisJob],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
