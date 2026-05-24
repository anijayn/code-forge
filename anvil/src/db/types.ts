export enum WorkspacePlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum WorkflowStatus {
  PENDING = 'pending',
  ANALYZING = 'analyzing',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export enum AnalysisType {
  SECURITY = 'security',
  COMPLEXITY = 'complexity',
  TEST_GAPS = 'test-gaps',
  BREAKING = 'breaking',
}

export enum AnalysisJobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
}

export enum Severity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}
