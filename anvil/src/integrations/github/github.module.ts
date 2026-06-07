import { Module } from '@nestjs/common';
import { GitHubService } from './github.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '../../logger/logger.service';

@Module({
  providers: [
    {
      provide: GitHubService,
      useFactory: (config: ConfigService, logger: AppLogger) => {
        const appId = config.get<number>('GITHUB_APP_ID');
        const installationId = config.get<number>('GITHUB_APP_INSTALLATION_ID');
        const privateKeyPath = config.get<string>('GITHUB_PRIVATE_KEY_PATH');
        if (!appId || !privateKeyPath || !installationId)
          throw new Error('Missing GitHub App configuration');
        return new GitHubService(
          { appId, installationId, privateKeyPath },
          logger,
        );
      },
      inject: [ConfigService, AppLogger],
    },
  ],
  exports: [GitHubService],
})
export class GithubModule {}
