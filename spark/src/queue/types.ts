export type PrJobPayload = {
  prNumber: number;
  repoFullName: string;
  headSha: string;
  baseBranch: string;
  title: string;
  author: string;
  installationId: number;
};
