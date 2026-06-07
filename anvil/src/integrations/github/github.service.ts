import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { readFileSync } from 'fs';
import { AppLogger } from '../../logger/logger.service';
import { Finding } from '../../analysis/types';
import { Severity } from '../../db/types';
import type { GithubOptions } from './github.types';
import { PullRequestFile } from './github.types';

export interface ReviewComment {
  path: string;
  line: number;
  body: string;
}

@Injectable()
export class GitHubService {
  private readonly appId: number;
  private readonly privateKeyPath: string;
  private readonly installationId: number;
  private readonly privateKey: string;

  constructor(
    private readonly options: GithubOptions,
    private readonly logger: AppLogger,
  ) {
    this.appId = options.appId;
    this.privateKeyPath = options.privateKeyPath;
    this.installationId = options.installationId;
    this.privateKey = readFileSync(this.privateKeyPath, 'utf8');
  }

  private getOctokit(): Octokit {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: this.appId,
        privateKey: this.privateKey,
        installationId: this.installationId,
      },
    });
  }

  async getPrFiles(
    repoFullName: string,
    prNumber: number,
  ): Promise<PullRequestFile[]> {
    const [owner, repo] = repoFullName.split('/');
    const octokit = this.getOctokit();

    this.logger.log(`Fetching diff for PR #${prNumber} in ${repoFullName}`);

    const { data } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });

    const files: PullRequestFile[] = data.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
      patch: f.patch,
    }));

    this.logger.log(
      `Fetched ${files.length} files — ` +
        `${files.reduce((n, f) => n + f.additions, 0)} additions, ` +
        `${files.reduce((n, f) => n + f.deletions, 0)} deletions`,
    );

    return files;
  }

  async postReview(
    repoFullName: string,
    prNumber: number,
    findings: Finding[],
    qualityScore: number,
  ): Promise<void> {
    const [owner, repo] = repoFullName.split('/');
    console.log(`Posting review for PR #${prNumber} in ${repoFullName}`);
    const octokit = this.getOctokit();

    const comments: ReviewComment[] = findings
      .filter((f) => f.line > 0)
      .map((f) => ({
        path: f.file,
        line: f.line,
        body: this.formatComment(f),
      }));

    const summary = this.formatSummary(findings, qualityScore);

    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event: 'COMMENT',
      body: summary,
      comments,
    });

    this.logger.log(
      `Posted review on PR #${prNumber} — ${comments.length} inline comments`,
    );
  }

  private formatComment(finding: Finding): string {
    const severityEmoji: Record<string, string> = {
      high: '🔴',
      medium: '🟡',
      low: '🔵',
      info: 'ℹ️',
    };

    const emoji = severityEmoji[finding.severity] ?? 'ℹ️';

    return [
      `${emoji} **${finding.severity.toUpperCase()}** — ${finding.category}`,
      '',
      finding.explanation,
      '',
      '**Suggested fix:**',
      '```',
      finding.fix,
      '```',
    ].join('\n');
  }

  private formatSummary(findings: Finding[], score: number): string {
    const high = findings.filter((f) => f.severity === Severity.HIGH).length;
    const medium = findings.filter(
      (f) => f.severity === Severity.MEDIUM,
    ).length;
    const low = findings.filter((f) => f.severity === Severity.LOW).length;

    const scoreEmoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';

    return [
      `## CodeForge Analysis ${scoreEmoji}`,
      '',
      `**Quality Score: ${score}/100**`,
      '',
      '| Severity | Count |',
      '|----------|-------|',
      `| 🔴 High   | ${high} |`,
      `| 🟡 Medium | ${medium} |`,
      `| 🔵 Low    | ${low} |`,
      '',
      findings.length === 0
        ? '✅ No issues found. Good work!'
        : `${findings.length} issue(s) found. See inline comments for details.`,
    ].join('\n');
  }
}
