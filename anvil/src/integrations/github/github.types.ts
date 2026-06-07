export interface PullRequestFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export interface GithubOptions {
  appId: number;
  installationId: number;
  privateKeyPath: string;
}

export interface PullRequestDetails {
  title: string;
  body: string | null;
  author: string;
  baseBranch: string;
  headBranch: string;
  files: PullRequestFile[];
}
