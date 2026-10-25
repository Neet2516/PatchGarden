import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository, AuditEventRepository } from '@patchgarden/core';
import type { JobStatus, ApprovalState } from '@patchgarden/core';

interface CompleteJobInput {
  jobId: string;
  finalStatus: 'APPROVED' | 'REJECTED_PROPOSAL' | 'REJECTED_RESULT' | 'BLOCKED';
  evidenceRoot: string;
}

interface CompleteJobOutput {
  success: boolean;
  evidenceSummaryPath?: string;
  error?: string;
}

export async function completeJob(input: CompleteJobInput): Promise<CompleteJobOutput> {
  const { jobId, finalStatus, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);
  const auditRepo = new AuditEventRepository(db);

  try {
    const job = jobRepo.findById(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    let targetStatus: JobStatus = 'COMPLETED';
    let targetApproval: ApprovalState = 'FINAL_APPROVED';

    if (finalStatus === 'APPROVED') {
      targetStatus = 'COMPLETED';
      targetApproval = 'FINAL_APPROVED';
    } else if (finalStatus === 'REJECTED_PROPOSAL') {
      targetStatus = 'CANCELLED';
      targetApproval = 'PROPOSAL_REJECTED';
    } else if (finalStatus === 'REJECTED_RESULT') {
      targetStatus = 'CANCELLED';
      targetApproval = 'FINAL_REJECTED';
    } else {
      targetStatus = 'FAILED';
      targetApproval = 'PENDING';
    }

    jobRepo.transition(jobId, 'COMPLETE', {
      status: targetStatus,
      approvalState: targetApproval,
    });

    ckptRepo.create({
      jobId,
      stage: 'COMPLETE',
      workerVersion: '0.1.0',
    });

    auditRepo.log({
      jobId,
      eventType: 'STAGE_TRANSITION',
      summary: `Job completed with status ${targetStatus} (${targetApproval})`,
      details: { finalStatus, completedAt: new Date().toISOString() },
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
          analysisResult: updatedJob?.analysisResult,
          candidateResult: updatedJob?.candidateResult,
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
