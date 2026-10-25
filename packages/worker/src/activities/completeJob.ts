import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository, AuditEventRepository } from '@patchgarden/core';
import type { JobStatus, ApprovalState } from '@patchgarden/core';

export interface CompleteJobInput {
  jobId: string;
  finalStatus: 'APPROVED' | 'REJECTED_PROPOSAL' | 'REJECTED_RESULT' | 'BLOCKED';
  evidenceRoot?: string | undefined;
  reason?: string | undefined;
}

export interface CompleteJobOutput {
  success: boolean;
  evidenceSummaryPath?: string;
  error?: string;
}

export async function completeJob(input: CompleteJobInput): Promise<CompleteJobOutput> {
  const { jobId, finalStatus, reason } = input;
  const evidenceRoot = input.evidenceRoot ?? process.env['EVIDENCE_ROOT'] ?? './evidence';
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);
  const auditRepo = new AuditEventRepository(db);

  try {
    const job = jobRepo.findById(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    let targetStatus: JobStatus = 'COMPLETE';
    let targetApproval: ApprovalState = 'RESULT_APPROVED';

    if (finalStatus === 'APPROVED') {
      targetStatus = 'COMPLETE';
      targetApproval = 'RESULT_APPROVED';
    } else if (finalStatus === 'REJECTED_PROPOSAL') {
      targetStatus = 'COMPLETE';
      targetApproval = 'PROPOSAL_REJECTED';
    } else if (finalStatus === 'REJECTED_RESULT') {
      targetStatus = 'COMPLETE';
      targetApproval = 'RESULT_REJECTED';
    } else {
      targetStatus = 'BLOCKED';
      targetApproval = 'PENDING';
    }

    jobRepo.transition(jobId, finalStatus === 'BLOCKED' ? 'BLOCKED' : 'COMPLETE', {
      status: targetStatus,
      approvalState: targetApproval,
      ...(reason ? { errorMessage: reason } : {}),
    });

    ckptRepo.create({
      jobId,
      stage: finalStatus === 'BLOCKED' ? 'BLOCKED' : 'COMPLETE',
      workerVersion: '0.1.0',
    });

    auditRepo.append({
      jobId,
      eventType: 'STAGE_TRANSITION',
      actor: 'system',
      payload: { finalStatus, reason: reason ?? null, completedAt: new Date().toISOString() },
    });

    // Write final summary into evidence directory
    const evidenceDir = path.join(evidenceRoot, jobId);
    const summaryPath = path.join(evidenceDir, 'summary.json');
    if (!fs.existsSync(evidenceDir)) {
      fs.mkdirSync(evidenceDir, { recursive: true });
    }

    const updatedJob = jobRepo.findById(jobId);
    fs.writeFileSync(
      summaryPath,
      JSON.stringify(
        {
          jobId,
          status: updatedJob?.status,
          approvalState: updatedJob?.approvalState,
          baselineResult: updatedJob?.baselineResult,
          analysis: updatedJob?.analysis,
          candidateResult: updatedJob?.candidateResult,
          reason: reason ?? null,
          completedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    return {
      success: true,
      evidenceSummaryPath: summaryPath,
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
    };
  }
}
