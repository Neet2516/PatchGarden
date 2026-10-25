import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository, assertPathInWorkspace } from '@patchgarden/core';
import type { WorkflowStage } from '@patchgarden/core';

interface InspectRepositoryInput {
  jobId: string;
  repoPath: string;
  evidenceRoot: string;
}

interface InspectRepositoryOutput {
  success: boolean;
  headCommit?: string;
  branch?: string;
  remote?: string;
  error?: string;
}

export async function inspectRepository(
  input: InspectRepositoryInput,
): Promise<InspectRepositoryOutput> {
  const { jobId, repoPath, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  try {
    // Validate the repo path is within allowed boundaries
    const workspaceRoot = process.env['WORKSPACE_ROOT'] ?? process.cwd();
    // repos/ is a separate allowed directory for input repos
    // We allow any absolute path the user explicitly provided
    if (!fs.existsSync(repoPath)) {
      return { success: false, error: `Repository path does not exist: ${repoPath}` };
    }

    const stat = fs.statSync(repoPath);
    if (!stat.isDirectory()) {
      return { success: false, error: `Repository path is not a directory: ${repoPath}` };
    }

    // Check it's actually a git repo
    const gitDir = path.join(repoPath, '.git');
    if (!fs.existsSync(gitDir)) {
      return { success: false, error: `Not a Git repository: ${repoPath}` };
    }

    // Get git metadata (read-only)
    const headCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoPath, encoding: 'utf8', timeout: 10000,
    }).trim();

    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: repoPath, encoding: 'utf8', timeout: 10000,
    }).trim();

    let remote = '';
    try {
      remote = execFileSync('git', ['remote', 'get-url', 'origin'], {
        cwd: repoPath, encoding: 'utf8', timeout: 5000,
      }).trim();
    } catch { /* no remote is fine */ }

    // Check for .env files (flag, don't read)
    const envFiles = fs.readdirSync(repoPath).filter(f => f.startsWith('.env'));

    // Write evidence
    const evidenceDir = path.join(evidenceRoot, jobId);
    fs.mkdirSync(evidenceDir, { recursive: true });
    fs.writeFileSync(
      path.join(evidenceDir, 'inspection.json'),
      JSON.stringify({ headCommit, branch, remote, envFilesDetected: envFiles, ts: new Date().toISOString() }, null, 2),
    );

    // Update job state
    jobRepo.transition(jobId, 'IDENTIFYING', {
      repoHeadCommit: headCommit,
      repoBranch: branch,
      repoRemote: remote,
      evidenceDir,
    });

    ckptRepo.create({ jobId, stage: 'IDENTIFYING' as WorkflowStage, evidenceHash: headCommit });

    return { success: true, headCommit, branch, remote };
  } catch (err) {
    jobRepo.transition(jobId, 'BLOCKED', { errorCode: 'INSPECT_FAILED', errorMessage: String(err) });
    return { success: false, error: String(err) };
  }
}
