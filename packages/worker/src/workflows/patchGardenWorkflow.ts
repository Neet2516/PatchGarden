import { proxyActivities, setHandler, condition, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/index.js';

// ──────────────────────────────────────────────────────────────────────────────
// Activity Proxies
// Configure retry policies per activity type.
// ──────────────────────────────────────────────────────────────────────────────

const {
  inspectRepository,
  identifyFailure,
  collectEvidence,
  analyzeWithAI,
  createWorkspace,
  applyPatch,
  verifyPatch,
  completeJob,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '3 minutes',
  retry: {
    maximumAttempts: 3,
    initialInterval: '5s',
    backoffCoefficient: 2,
    maximumInterval: '60s',
    nonRetryableErrorTypes: [
      'PathTraversalError',
      'SecurityPolicyViolation',
      'StateTransitionError',
    ],
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Signals
// ──────────────────────────────────────────────────────────────────────────────

export const approveProposalSignal = 'approveProposal';
export const rejectProposalSignal = 'rejectProposal';
export const approveFinalSignal = 'approveFinal';
export const rejectFinalSignal = 'rejectFinal';

// ──────────────────────────────────────────────────────────────────────────────
// Workflow Input / Output
// ──────────────────────────────────────────────────────────────────────────────

export interface PatchGardenWorkflowInput {
  jobId: string;
  repoPath: string;
  workspaceRoot: string;
  evidenceRoot: string;
}

export interface PatchGardenWorkflowResult {
  jobId: string;
  finalStatus: 'APPROVED' | 'REJECTED_PROPOSAL' | 'REJECTED_RESULT' | 'BLOCKED';
  evidenceDir: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// PatchGarden Workflow
// This is the core durable workflow. Temporal replays this code on recovery.
// ALL side effects must be in Activities — not in workflow code.
// ──────────────────────────────────────────────────────────────────────────────

export async function PatchGardenWorkflow(
  input: PatchGardenWorkflowInput,
): Promise<PatchGardenWorkflowResult> {
  const { jobId, repoPath, workspaceRoot, evidenceRoot } = input;

  // ── Signal state ────────────────────────────────────────────────────────────
  let proposalDecision: 'approved' | 'rejected' | null = null;
  let finalDecision: 'approved' | 'rejected' | null = null;
  let proposalRejectionReason: string | undefined;
  let finalRejectionReason: string | undefined;

  setHandler(approveProposalSignal, () => {
    proposalDecision = 'approved';
  });

  setHandler(rejectProposalSignal, (reason?: string) => {
    proposalDecision = 'rejected';
    proposalRejectionReason = reason;
  });

  setHandler(approveFinalSignal, () => {
    finalDecision = 'approved';
  });

  setHandler(rejectFinalSignal, (reason?: string) => {
    finalDecision = 'rejected';
    finalRejectionReason = reason;
  });

  try {
    // ── Stage 1: Inspect Repository ─────────────────────────────────────────
    const inspectResult = await inspectRepository({
      jobId,
      repoPath,
      evidenceRoot,
    });

    if (!inspectResult.success) {
      await completeJob({ jobId, status: 'BLOCKED', reason: inspectResult.error });
      return { jobId, finalStatus: 'BLOCKED', evidenceDir: null };
    }

    // ── Stage 2: Identify Failure ────────────────────────────────────────────
    const failureResult = await identifyFailure({
      jobId,
      repoPath,
      evidenceRoot,
    });

    if (!failureResult.success || failureResult.failingTests?.length === 0) {
      await completeJob({
        jobId,
        status: 'BLOCKED',
        reason: failureResult.error ?? 'No failing tests found',
      });
      return { jobId, finalStatus: 'BLOCKED', evidenceDir: null };
    }

    // ── Stage 3: Collect Evidence ────────────────────────────────────────────
    const evidenceResult = await collectEvidence({
      jobId,
      repoPath,
      evidenceRoot,
      failingTests: failureResult.failingTests ?? [],
    });

    // ── Stage 4: Analyze with AI ─────────────────────────────────────────────
    const analysisResult = await analyzeWithAI({
      jobId,
      evidenceRoot,
    });

    if (!analysisResult.success || analysisResult.confidence === 'INSUFFICIENT') {
      await completeJob({
        jobId,
        status: 'BLOCKED',
        reason: 'AI analysis: insufficient evidence to propose a repair',
      });
      return { jobId, finalStatus: 'BLOCKED', evidenceDir: evidenceResult.evidenceDir };
    }

    // ── Stage 5: Create Workspace ────────────────────────────────────────────
    const workspaceResult = await createWorkspace({
      jobId,
      repoPath,
      workspaceRoot,
    });

    if (!workspaceResult.success) {
      await completeJob({ jobId, status: 'BLOCKED', reason: workspaceResult.error });
      return { jobId, finalStatus: 'BLOCKED', evidenceDir: evidenceResult.evidenceDir };
    }

    // ── Gate: Wait for Human Proposal Approval (max 24 hours) ───────────────
    await condition(() => proposalDecision !== null, '24h');

    if (proposalDecision === 'rejected' || proposalDecision === null) {
      await completeJob({
        jobId,
        status: 'REJECTED_PROPOSAL',
        reason: proposalRejectionReason ?? 'Proposal rejected by user (or timed out)',
      });
      return {
        jobId,
        finalStatus: 'REJECTED_PROPOSAL',
        evidenceDir: evidenceResult.evidenceDir,
      };
    }

    // ── Stage 6: Apply Patch ─────────────────────────────────────────────────
    const patchResult = await applyPatch({
      jobId,
      worktreePath: workspaceResult.worktreePath!,
      evidenceRoot,
    });

    if (!patchResult.success) {
      await completeJob({ jobId, status: 'BLOCKED', reason: patchResult.error });
      return { jobId, finalStatus: 'BLOCKED', evidenceDir: evidenceResult.evidenceDir };
    }

    // ── Stage 7: Verify Patch ────────────────────────────────────────────────
    const verifyResult = await verifyPatch({
      jobId,
      worktreePath: workspaceResult.worktreePath!,
      evidenceRoot,
    });

    // ── Gate: Wait for Human Final Approval (max 24 hours) ──────────────────
    await condition(() => finalDecision !== null, '24h');

    if (finalDecision === 'rejected' || finalDecision === null) {
      await completeJob({
        jobId,
        status: 'REJECTED_RESULT',
        reason: finalRejectionReason ?? 'Result rejected by user (or timed out)',
      });
      return {
        jobId,
        finalStatus: 'REJECTED_RESULT',
        evidenceDir: evidenceResult.evidenceDir,
      };
    }

    // ── Complete ─────────────────────────────────────────────────────────────
    await completeJob({ jobId, status: 'APPROVED' });
    return {
      jobId,
      finalStatus: 'APPROVED',
      evidenceDir: evidenceResult.evidenceDir,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : String(err);
    await completeJob({ jobId, status: 'BLOCKED', reason: errorMessage });
    return { jobId, finalStatus: 'BLOCKED', evidenceDir: null };
  }
}
