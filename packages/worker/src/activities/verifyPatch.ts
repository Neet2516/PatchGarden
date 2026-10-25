import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository } from '@patchgarden/core';
import type { TestResult } from '@patchgarden/core';

interface VerifyPatchInput {
  jobId: string;
  worktreePath: string;
  evidenceRoot: string;
}

interface VerifyPatchOutput {
  success: boolean;
  testStatus?: string;
  regressions?: string[];
  error?: string;
}

export async function verifyPatch(
  input: VerifyPatchInput,
): Promise<VerifyPatchOutput> {
  const { jobId, worktreePath, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  try {
    const job = jobRepo.findById(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    const testCommand = job.testCommand ?? 'npm test';
    const [cmd, ...args] = testCommand.split(' ');

    // Install deps in worktree first
    try {
      execFileSync('npm', ['install', '--prefer-offline', '--no-audit'], {
        cwd: worktreePath, timeout: 60000, encoding: 'utf8',
      });
    } catch { /* ignore install warnings */ }

    // Run tests in isolated worktree
    let candidateStdout = '';
    let candidateStderr = '';
    let candidateExitCode = 0;
    let timedOut = false;

    try {
      execFileSync(cmd!, args, {
        cwd: worktreePath, encoding: 'utf8', timeout: 120_000, maxBuffer: 10 * 1024 * 1024,
      });
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string; status?: number; killed?: boolean };
      candidateStdout = e.stdout ?? '';
      candidateStderr = e.stderr ?? '';
      candidateExitCode = e.status ?? 1;
      timedOut = e.killed ?? false;
    }

    const baseline = job.baselineResult;
    const baselineFailingNames = new Set(baseline?.failingTests.map(t => t.name) ?? []);

    // Simple regression detection: look for new failures in output
    const regressions: string[] = [];
    if (candidateExitCode !== 0 && baseline) {
      // Any failure that wasn't in baseline is a regression (heuristic)
      const combined = candidateStdout + candidateStderr;
      for (const line of combined.split('\n')) {
        if (line.includes('FAIL') && !baselineFailingNames.has(line.trim())) {
          regressions.push(line.trim().slice(0, 200));
        }
      }
    }

    const testStatus = candidateExitCode === 0 ? 'PASS' : regressions.length > 0 ? 'FAIL' : 'PARTIAL';

    const candidateResult: TestResult = {
      exitCode: candidateExitCode,
      status: candidateExitCode === 0 ? 'PASS' : 'FAIL',
      failingTests: [],
      passingTests: [],
      totalTests: 0,
      durationMs: 0,
      stdout: candidateStdout.slice(0, 50_000),
      stderr: candidateStderr.slice(0, 20_000),
      timedOut,
      regressions,
    };

    // Save verification evidence
    const evidenceDir = path.join(evidenceRoot, jobId);
    fs.writeFileSync(
      path.join(evidenceDir, 'verification.json'),
      JSON.stringify({ ts: new Date().toISOString(), testStatus, candidateResult, regressions }, null, 2),
    );

    jobRepo.transition(jobId, 'AWAITING_FINAL', { candidateResult });
    ckptRepo.create({ jobId, stage: 'AWAITING_FINAL', workerVersion: '0.1.0' });

    return { success: true, testStatus, regressions };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
