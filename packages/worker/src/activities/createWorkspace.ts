import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository, assertPathInWorkspace } from '@patchgarden/core';

interface CreateWorkspaceInput {
  jobId: string;
  repoPath: string;
  workspaceRoot: string;
}

interface CreateWorkspaceOutput {
  success: boolean;
  worktreePath?: string;
  error?: string;
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<CreateWorkspaceOutput> {
  const { jobId, repoPath, workspaceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  const worktreePath = path.resolve(workspaceRoot, jobId);

  try {
    // Validate workspace root (prevents path traversal)
    fs.mkdirSync(workspaceRoot, { recursive: true });
    assertPathInWorkspace(worktreePath, workspaceRoot);

    // Check if worktree already exists (idempotent)
    if (fs.existsSync(worktreePath)) {
      // Verify it's valid
      try {
        execFileSync('git', ['status'], { cwd: worktreePath, timeout: 5000, encoding: 'utf8' });
        // Already exists and valid — reuse
        jobRepo.transition(jobId, 'APPLYING', { worktreePath });
        ckptRepo.create({ jobId, stage: 'APPLYING', workerVersion: '0.1.0' });
        return { success: true, worktreePath };
      } catch {
        // Stale worktree — remove and recreate
        execFileSync('git', ['worktree', 'remove', '--force', worktreePath], {
          cwd: repoPath, timeout: 10000, encoding: 'utf8',
        });
      }
    }

    // Create the isolated worktree
    execFileSync('git', ['worktree', 'add', worktreePath, 'HEAD'], {
      cwd: repoPath,
      timeout: 30000,
      encoding: 'utf8',
    });

    // Validate the created path is still within workspace root
    assertPathInWorkspace(worktreePath, workspaceRoot);

    jobRepo.transition(jobId, 'APPLYING', { worktreePath });
    ckptRepo.create({ jobId, stage: 'APPLYING', workerVersion: '0.1.0' });

    return { success: true, worktreePath };
  } catch (err) {
    jobRepo.transition(jobId, 'BLOCKED', { errorCode: 'WORKSPACE_CREATE_FAILED', errorMessage: String(err) });
    return { success: false, error: String(err) };
  }
}
