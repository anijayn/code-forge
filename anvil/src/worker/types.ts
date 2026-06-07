export interface PrJobPayload {
  githubPrId?: number;
  prNumber: number;
  repoFullName: string;
  headSha: string;
  baseBranch: string;
  title: string;
  author: string;
}
