import { Injectable } from '@nestjs/common';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { readFileSync } from 'fs';
import type { GithubOptions, PullRequestFile } from './github.types';

@Injectable()
export class GithubService {
  private readonly appId: number;
  private readonly installationId: number;
  private readonly privateKeyPath: string;
  private privateKey: string;

  constructor(private readonly options: GithubOptions) {
    this.appId = options.appId;
    this.privateKeyPath = options.privateKeyPath;
    this.installationId = options.installationId;
    this.privateKey = readFileSync(this.privateKeyPath, 'utf8');
  }

  private createClient(): Octokit {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: this.appId,
        privateKey: this.privateKey,
        installaitonId: this.installationId,
      },
    });
  }
  async getPullRequestFiles(
    repoFullName: string,
    prNumber: number,
  ): Promise<PullRequestFile[]> {
    const [owner, repo] = repoFullName.split('/');

    const octokit = await this.createClient();

    const response = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });

    return response.data.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    }));
  }
}
