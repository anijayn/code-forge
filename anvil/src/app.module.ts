import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './db/entities/workspace.entity';
import { PullRequest } from './db/entities/pull-request.entity';
import { Analysis } from './db/entities/analysis.entity';
import { AnalysisJob } from './db/entities/analysis-job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      // forRootAsync + imports ensures ConfigModule is resolvable when factory runs
      // imports: [ConfigModule],
      inject: [ConfigService],
      // Nest runs a factory function and uses its return value as dependency
      // This enables dynamic configuration values, for example here env variables
      // are not static so everytime nest loads the module, it runs this factory function
      // to fetch the env variables dynamically and loads it to typeorm module
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [Workspace, PullRequest, Analysis, AnalysisJob],
        migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
        synchronize: false, // never true, use migrations
        logging: true, // see SQL in terminal during development
      }),
    }),
    HealthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
