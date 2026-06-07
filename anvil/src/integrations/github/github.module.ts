import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: GithubService,
      useFactory: (config: ConfigService) => {
        const appId = config.get<number>('GITHUB_APP_ID');
        const installationId = config.get<number>('GITHUB_APP_INSTALLATION_ID');
        const privateKeyPath = config.get<string>('GITHUB_PRIVATE_KEY_PATH');
        if (!appId || !privateKeyPath || !installationId)
          throw new Error('Missing GitHub App configuration');
        return new GithubService({ appId, installationId, privateKeyPath });
      },
      inject: [ConfigService],
    },
  ],
  exports: [GithubService],
})
export class GithubModule {}
