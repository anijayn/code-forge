export interface GitHubPullRequestEvent {
  action: string;
  pull_request: {
    number: number;
    title: string;
    head: {
      sha: string;
    };
    base: {
      ref: string;
    };
    user: {
      login: string;
    };
  };
  repository: {
    full_name: string;
  };
  installation: {
    id: number;
  };
}
