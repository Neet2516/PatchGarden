// ──────────────────────────────────────────────────────────────────────────────
// PatchGarden Domain Types
// ──────────────────────────────────────────────────────────────────────────────

/**
 * The workflow stage of a job — corresponds to the state machine in
 * docs/TECHNICAL_ARCHITECTURE.md.
 */
export type WorkflowStage =
  | 'CREATED'
  | 'INSPECTING'
  | 'IDENTIFYING'
  | 'COLLECTING'
  | 'ANALYZING'
  | 'AWAITING_APPROVAL'
  | 'APPLYING'
  | 'VERIFYING'
  | 'AWAITING_FINAL'
  | 'APPROVED'
  | 'REJECTED_PROPOSAL'
  | 'REJECTED_RESULT'
  | 'COMPLETE'
  | 'BLOCKED';

/**
 * High-level job status for UI display.
 */
export type JobStatus =
  | 'CREATED'
  | 'IN_PROGRESS'
  | 'AWAITING_HUMAN'
  | 'COMPLETE'
  | 'BLOCKED';

/**
 * Approval state for human decision gates.
 */
export type ApprovalState =
  | 'PENDING'
  | 'PROPOSAL_APPROVED'
  | 'PROPOSAL_REJECTED'
  | 'RESULT_APPROVED'
  | 'RESULT_REJECTED';

/**
 * AI model confidence levels.
 */
export type AnalysisConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

/**
 * Test execution result status.
 */
export type TestStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'ERROR' | 'TIMEOUT';

// ──────────────────────────────────────────────────────────────────────────────
// Core Entities
// ──────────────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  repoPath: string;
  repoHeadCommit: string | null;
  repoBranch: string | null;
  repoRemote: string | null;
  status: JobStatus;
  stage: WorkflowStage;
  workflowId: string | null;
  runId: string | null;
  worktreePath: string | null;
  testCommand: string | null;
  baselineResult: TestResult | null;
  analysis: AnalysisResult | null;
  patchDiff: string | null;
  diffHash: string | null;
  candidateResult: TestResult | null;
  approvalState: ApprovalState;
  approvedBy: string | null;
  rejectionReason: string | null;
  retryCount: number;
  modelId: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  evidenceDir: string | null;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string;
  completedAt: string | null;
}

export interface TestResult {
  exitCode: number;
  status: TestStatus;
  failingTests: FailingTest[];
  passingTests: string[];
  totalTests: number;
  durationMs: number;
  stdout: string; // Truncated to 50KB
  stderr: string; // Truncated to 20KB
  timedOut: boolean;
  regressions?: string[]; // Tests that passed in baseline but fail in candidate
}

export interface FailingTest {
  name: string;
  errorMessage: string;
  stackTrace?: string;
  filePath?: string;
}

export interface AnalysisResult {
  hypothesis: string;
  affectedFiles: string[];
  patchPlan: PatchInstruction[];
  confidence: AnalysisConfidence;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  validationErrors?: string[];
}

export interface PatchInstruction {
  filePath: string;         // Relative to repo root
  action: 'MODIFY';         // MVP: only modifications (no creates/deletes)
  diff: string;             // Unified diff format
  explanation: string;      // Human-readable explanation
}

export interface Checkpoint {
  id: string;
  jobId: string;
  stage: WorkflowStage;
  evidenceHash: string | null;
  workerVersion: string | null;
  temporalRunId: string | null;
  attempt: number;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  jobId: string | null;
  eventType: AuditEventType;
  actor: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export type AuditEventType =
  | 'JOB_CREATED'
  | 'STAGE_TRANSITION'
  | 'PATCH_PROPOSAL_APPROVED'
  | 'PATCH_PROPOSAL_REJECTED'
  | 'PATCH_RESULT_APPROVED'
  | 'PATCH_RESULT_REJECTED'
  | 'SECURITY_VIOLATION'
  | 'MODEL_OUTPUT_INVALID'
  | 'RECOVERY_INITIATED'
  | 'JOB_COMPLETE'
  | 'WORKTREE_CLEANED';

// ──────────────────────────────────────────────────────────────────────────────
// State Machine Transitions
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Valid transitions in the PatchGarden workflow state machine.
 * Key = current stage, Value = allowed next stages.
 */
export const VALID_TRANSITIONS: Record<WorkflowStage, WorkflowStage[]> = {
  CREATED: ['INSPECTING', 'BLOCKED'],
  INSPECTING: ['IDENTIFYING', 'BLOCKED'],
  IDENTIFYING: ['COLLECTING', 'BLOCKED'],
  COLLECTING: ['ANALYZING', 'BLOCKED'],
  ANALYZING: ['AWAITING_APPROVAL', 'BLOCKED'],
  AWAITING_APPROVAL: ['APPLYING', 'REJECTED_PROPOSAL', 'BLOCKED'],
  APPLYING: ['VERIFYING', 'BLOCKED'],
  VERIFYING: ['AWAITING_FINAL', 'BLOCKED'],
  AWAITING_FINAL: ['APPROVED', 'REJECTED_RESULT'],
  APPROVED: ['COMPLETE'],
  REJECTED_PROPOSAL: ['COMPLETE'],
  REJECTED_RESULT: ['COMPLETE'],
  COMPLETE: [],
  BLOCKED: [], // Terminal — requires manual intervention
};

export class StateTransitionError extends Error {
  constructor(
    public readonly fromStage: WorkflowStage,
    public readonly toStage: WorkflowStage,
  ) {
    super(`Invalid transition: ${fromStage} → ${toStage}`);
    this.name = 'StateTransitionError';
  }
}

export function assertValidTransition(
  from: WorkflowStage,
  to: WorkflowStage,
): void {
  const allowed = VALID_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    throw new StateTransitionError(from, to);
  }
}
