import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDatabase, JobRepository, CheckpointRepository, assertPathInWorkspace } from '@patchgarden/core';
import type { AnalysisResult } from '@patchgarden/core';

interface ApplyPatchInput {
  jobId: string;
  worktreePath: string;
  evidenceRoot: string;
}

interface ApplyPatchOutput {
  success: boolean;
  diffHash?: string;
  error?: string;
}

export async function applyPatch(
  input: ApplyPatchInput,
): Promise<ApplyPatchOutput> {
  const { jobId, worktreePath, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  const workspaceRoot = process.env['WORKSPACE_ROOT'] ?? path.dirname(worktreePath);

  try {
    // Read the analysis from evidence
    const evidenceDir = path.join(evidenceRoot, jobId);
    const analysis = JSON.parse(
      fs.readFileSync(path.join(evidenceDir, 'analysis.json'), 'utf8'),
    ) as AnalysisResult;

    if (!analysis.patchPlan || analysis.patchPlan.length === 0) {
      return { success: false, error: 'No patch plan in analysis' };
    }

    // Build a combined unified diff from all patch instructions
    const diffLines: string[] = [];
    for (const instruction of analysis.patchPlan) {
      // SECURITY: validate each file path against workspace
      const targetPath = path.resolve(worktreePath, instruction.filePath);
      assertPathInWorkspace(targetPath, worktreePath);

      if (!fs.existsSync(targetPath)) {
        return { success: false, error: `File not found in worktree: ${instruction.filePath}` };
      }

      diffLines.push(instruction.diff);
    }

    const combinedDiff = diffLines.join('\n');
    const diffHash = crypto.createHash('sha256').update(combinedDiff).digest('hex');

    // Write the combined diff to a temp file
    const diffFile = path.join(evidenceDir, 'patch.diff');
    fs.writeFileSync(diffFile, combinedDiff);

    // Apply via git apply (safe — only applies text diffs)
    execFileSync('git', ['apply', '--check', diffFile], {
      cwd: worktreePath, timeout: 15000, encoding: 'utf8',
    });
    execFileSync('git', ['apply', diffFile], {
      cwd: worktreePath, timeout: 15000, encoding: 'utf8',
    });

    jobRepo.transition(jobId, 'VERIFYING', { patchDiff: combinedDiff, diffHash });
    ckptRepo.create({ jobId, stage: 'VERIFYING', evidenceHash: diffHash });

    return { success: true, diffHash };
  } catch (err) {
    jobRepo.transition(jobId, 'BLOCKED', { errorCode: 'PATCH_APPLY_FAILED', errorMessage: String(err) });
    return { success: false, error: String(err) };
  }
}
