import type Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import type {
  Job,
  JobStatus,
  WorkflowStage,
  ApprovalState,
  TestResult,
  AnalysisResult,
  AuditEvent,
  AuditEventType,
  Checkpoint,
} from '../types/index.js';
import { assertValidTransition } from '../types/index.js';

// ──────────────────────────────────────────────────────────────────────────────
// Row Types (SQLite raw representation)
// ──────────────────────────────────────────────────────────────────────────────

interface JobRow {
  id: string;
  repo_path: string;
  repo_head_commit: string | null;
  repo_branch: string | null;
  repo_remote: string | null;
  status: string;
  stage: string;
  workflow_id: string | null;
  run_id: string | null;
  worktree_path: string | null;
  test_command: string | null;
  baseline_result: string | null;
  analysis: string | null;
  patch_diff: string | null;
  diff_hash: string | null;
  candidate_result: string | null;
  approval_state: string;
  approved_by: string | null;
  rejection_reason: string | null;
  retry_count: number;
  model_id: string | null;
  error_code: string | null;
  error_message: string | null;
  evidence_dir: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Mappers
// ──────────────────────────────────────────────────────────────────────────────

function rowToJob(row: JobRow): Job {
  return {
    id: row.id,
    repoPath: row.repo_path,
    repoHeadCommit: row.repo_head_commit,
    repoBranch: row.repo_branch,
    repoRemote: row.repo_remote,
    status: row.status as JobStatus,
    stage: row.stage as WorkflowStage,
    workflowId: row.workflow_id,
    runId: row.run_id,
    worktreePath: row.worktree_path,
    testCommand: row.test_command,
    baselineResult: row.baseline_result
      ? (JSON.parse(row.baseline_result) as TestResult)
      : null,
    analysis: row.analysis
      ? (JSON.parse(row.analysis) as AnalysisResult)
      : null,
    patchDiff: row.patch_diff,
    diffHash: row.diff_hash,
    candidateResult: row.candidate_result
      ? (JSON.parse(row.candidate_result) as TestResult)
      : null,
    approvalState: row.approval_state as ApprovalState,
    approvedBy: row.approved_by,
    rejectionReason: row.rejection_reason,
    retryCount: row.retry_count,
    modelId: row.model_id,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    evidenceDir: row.evidence_dir,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// JobRepository
// ──────────────────────────────────────────────────────────────────────────────

export class JobRepository {
  constructor(private readonly db: Database.Database) {}

  create(input: { repoPath: string }): Job {
    const now = new Date().toISOString();
    const id = `job_${nanoid(12)}`;

    this.db
      .prepare(
        `INSERT INTO jobs (
          id, repo_path, status, stage, approval_state,
          retry_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(id, input.repoPath, 'CREATED', 'CREATED', 'PENDING', 0, now, now);

    return this.findById(id)!;
  }

  findById(id: string): Job | undefined {
    const row = this.db
      .prepare('SELECT * FROM jobs WHERE id = ?')
      .get(id) as JobRow | undefined;
    return row ? rowToJob(row) : undefined;
  }

  findByStatus(status: JobStatus): Job[] {
    const rows = this.db
      .prepare('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC')
      .all(status) as JobRow[];
    return rows.map(rowToJob);
  }

  list(limit = 50): Job[] {
    const rows = this.db
      .prepare('SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?')
      .all(limit) as JobRow[];
    return rows.map(rowToJob);
  }

  /**
   * Transition a job to a new stage. Validates the transition before writing.
   */
  transition(
    id: string,
    toStage: WorkflowStage,
    updates?: Partial<Omit<Job, 'id' | 'stage' | 'createdAt'>>,
  ): Job {
    const job = this.findById(id);
    if (!job) throw new Error(`Job not found: ${id}`);

    assertValidTransition(job.stage, toStage);

    const now = new Date().toISOString();
    const newStatus = stageToStatus(toStage);

    const completedAt =
      toStage === 'COMPLETE' || toStage === 'BLOCKED' ? now : job.completedAt;

    this.db
      .prepare(
        `UPDATE jobs SET
          stage = ?, status = ?, updated_at = ?, completed_at = ?,
          worktree_path = COALESCE(?, worktree_path),
          test_command = COALESCE(?, test_command),
          workflow_id = COALESCE(?, workflow_id),
          run_id = COALESCE(?, run_id),
          baseline_result = COALESCE(?, baseline_result),
          analysis = COALESCE(?, analysis),
          patch_diff = COALESCE(?, patch_diff),
          diff_hash = COALESCE(?, diff_hash),
          candidate_result = COALESCE(?, candidate_result),
          approval_state = COALESCE(?, approval_state),
          approved_by = COALESCE(?, approved_by),
          rejection_reason = COALESCE(?, rejection_reason),
          model_id = COALESCE(?, model_id),
          error_code = COALESCE(?, error_code),
          error_message = COALESCE(?, error_message),
          evidence_dir = COALESCE(?, evidence_dir),
          repo_head_commit = COALESCE(?, repo_head_commit),
          repo_branch = COALESCE(?, repo_branch),
          repo_remote = COALESCE(?, repo_remote),
          retry_count = COALESCE(?, retry_count)
        WHERE id = ?`,
      )
      .run(
        toStage,
        newStatus,
        now,
        completedAt,
        updates?.worktreePath ?? null,
        updates?.testCommand ?? null,
        updates?.workflowId ?? null,
        updates?.runId ?? null,
        updates?.baselineResult
          ? JSON.stringify(updates.baselineResult)
          : null,
        updates?.analysis ? JSON.stringify(updates.analysis) : null,
        updates?.patchDiff ?? null,
        updates?.diffHash ?? null,
        updates?.candidateResult
          ? JSON.stringify(updates.candidateResult)
          : null,
        updates?.approvalState ?? null,
        updates?.approvedBy ?? null,
        updates?.rejectionReason ?? null,
        updates?.modelId ?? null,
        updates?.errorCode ?? null,
        updates?.errorMessage ?? null,
        updates?.evidenceDir ?? null,
        updates?.repoHeadCommit ?? null,
        updates?.repoBranch ?? null,
        updates?.repoRemote ?? null,
        updates?.retryCount ?? null,
        id,
      );

    return this.findById(id)!;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// CheckpointRepository
// ──────────────────────────────────────────────────────────────────────────────

export class CheckpointRepository {
  constructor(private readonly db: Database.Database) {}

  create(input: {
    jobId: string;
    stage: WorkflowStage;
    evidenceHash?: string;
    workerVersion?: string;
    temporalRunId?: string;
    attempt?: number;
  }): Checkpoint {
    const id = `ckpt_${nanoid(12)}`;
    const now = new Date().toISOString();

    this.db
      .prepare(
        `INSERT INTO checkpoints (
          id, job_id, stage, evidence_hash, worker_version,
          temporal_run_id, attempt, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        input.jobId,
        input.stage,
        input.evidenceHash ?? null,
        input.workerVersion ?? null,
        input.temporalRunId ?? null,
        input.attempt ?? 1,
        now,
      );

    return {
      id,
      jobId: input.jobId,
      stage: input.stage,
      evidenceHash: input.evidenceHash ?? null,
      workerVersion: input.workerVersion ?? null,
      temporalRunId: input.temporalRunId ?? null,
      attempt: input.attempt ?? 1,
      createdAt: now,
    };
  }

  findLatest(jobId: string): Checkpoint | undefined {
    const row = this.db
      .prepare(
        `SELECT * FROM checkpoints WHERE job_id = ? ORDER BY created_at DESC LIMIT 1`,
      )
      .get(jobId) as
      | {
          id: string;
          job_id: string;
          stage: string;
          evidence_hash: string | null;
          worker_version: string | null;
          temporal_run_id: string | null;
          attempt: number;
          created_at: string;
        }
      | undefined;

    if (!row) return undefined;

    return {
      id: row.id,
      jobId: row.job_id,
      stage: row.stage as WorkflowStage,
      evidenceHash: row.evidence_hash,
      workerVersion: row.worker_version,
      temporalRunId: row.temporal_run_id,
      attempt: row.attempt,
      createdAt: row.created_at,
    };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// AuditEventRepository
// ──────────────────────────────────────────────────────────────────────────────

export class AuditEventRepository {
  constructor(private readonly db: Database.Database) {}

  append(input: {
    jobId?: string;
    eventType: AuditEventType;
    actor?: string;
    payload?: Record<string, unknown>;
  }): AuditEvent {
    const id = `evt_${nanoid(12)}`;
    const now = new Date().toISOString();

    this.db
      .prepare(
        `INSERT INTO audit_events (id, job_id, event_type, actor, payload, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        input.jobId ?? null,
        input.eventType,
        input.actor ?? null,
        input.payload ? JSON.stringify(input.payload) : null,
        now,
      );

    return {
      id,
      jobId: input.jobId ?? null,
      eventType: input.eventType,
      actor: input.actor ?? null,
      payload: input.payload ?? null,
      createdAt: now,
    };
  }

  findByJobId(jobId: string): AuditEvent[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM audit_events WHERE job_id = ? ORDER BY created_at ASC',
      )
      .all(jobId) as Array<{
      id: string;
      job_id: string | null;
      event_type: string;
      actor: string | null;
      payload: string | null;
      created_at: string;
    }>;

    return rows.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      eventType: r.event_type as AuditEventType,
      actor: r.actor,
      payload: r.payload ? (JSON.parse(r.payload) as Record<string, unknown>) : null,
      createdAt: r.created_at,
    }));
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function stageToStatus(stage: WorkflowStage): JobStatus {
  switch (stage) {
    case 'CREATED':
      return 'CREATED';
    case 'AWAITING_APPROVAL':
    case 'AWAITING_FINAL':
      return 'AWAITING_HUMAN';
    case 'COMPLETE':
      return 'COMPLETE';
    case 'BLOCKED':
      return 'BLOCKED';
    default:
      return 'IN_PROGRESS';
  }
}
