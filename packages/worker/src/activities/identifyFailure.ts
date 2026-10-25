import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository } from '@patchgarden/core';
import type { FailingTest, TestResult, TestStatus } from '@patchgarden/core';

interface IdentifyFailureInput {
  jobId: string;
  repoPath: string;
  evidenceRoot: string;
}

interface IdentifyFailureOutput {
  success: boolean;
  failingTests?: FailingTest[];
  testCommand?: string;
  error?: string;
}

const ALLOWED_TEST_COMMANDS = ['npm test', 'npx jest', 'npx vitest run', 'npx mocha'];

/** Detect which test runner the project uses */
function detectTestCommand(repoPath: string): string {
  try {
    const pkgRaw = fs.readFileSync(path.join(repoPath, 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string>; devDependencies?: Record<string, string>; dependencies?: Record<string, string> };
    const scripts = pkg.scripts ?? {};
    const deps = { ...pkg.devDependencies, ...pkg.dependencies };

    if (scripts['test'] && scripts['test'] !== 'echo "Error: no test specified" && exit 1') {
      return 'npm test';
    }
    if ('vitest' in deps) return 'npx vitest run';
    if ('jest' in deps) return 'npx jest';
    if ('mocha' in deps) return 'npx mocha';
    return 'npm test';
  } catch {
    return 'npm test';
  }
}

/** Parse test output for failing test names */
function parseFailures(stdout: string, stderr: string): FailingTest[] {
  const combined = stdout + '\n' + stderr;
  const failures: FailingTest[] = [];

  // Jest/Vitest pattern: ● Test name
  const jestPattern = /●\s+(.+)/g;
  let match;
  while ((match = jestPattern.exec(combined)) !== null) {
    const name = match[1]?.trim();
    if (name && name.length > 0 && name.length < 200) {
      failures.push({ name, errorMessage: name });
    }
  }

  // Mocha pattern: N failing
  const mochaPattern = /\d+\)\s+(.+)/g;
  while ((match = mochaPattern.exec(combined)) !== null) {
    const name = match[1]?.trim();
    if (name && !failures.some(f => f.name === name)) {
      failures.push({ name, errorMessage: name });
    }
  }

  return failures.slice(0, 10); // max 10 failing tests
}

export async function identifyFailure(
  input: IdentifyFailureInput,
): Promise<IdentifyFailureOutput> {
  const { jobId, repoPath, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  const testCommand = detectTestCommand(repoPath);
  const [cmd, ...args] = testCommand.split(' ');

  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  let timedOut = false;

  try {
    execFileSync(cmd!, args, {
      cwd: repoPath,
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number; killed?: boolean };
    stdout = e.stdout ?? '';
    stderr = e.stderr ?? '';
    exitCode = e.status ?? 1;
    timedOut = e.killed ?? false;
  }

  const failingTests = parseFailures(stdout, stderr);

  // Save baseline evidence
  const evidenceDir = path.join(evidenceRoot, jobId);
  fs.mkdirSync(evidenceDir, { recursive: true });
  const baselineResult: TestResult = {
    exitCode,
    status: (exitCode === 0 ? 'PASS' : 'FAIL') as TestStatus,
    failingTests,
    passingTests: [],
    totalTests: failingTests.length,
    durationMs: 0,
    stdout: stdout.slice(0, 50_000),
    stderr: stderr.slice(0, 20_000),
    timedOut,
  };
  fs.writeFileSync(path.join(evidenceDir, 'baseline.json'), JSON.stringify(baselineResult, null, 2));

  if (exitCode === 0) {
    jobRepo.transition(jobId, 'BLOCKED', { errorCode: 'NO_FAILURES', errorMessage: 'All tests pass — nothing to fix' });
    return { success: false, error: 'No failing tests found (all tests pass)' };
  }

  jobRepo.transition(jobId, 'COLLECTING', { testCommand, baselineResult });
  ckptRepo.create({ jobId, stage: 'COLLECTING' });

  return { success: true, failingTests, testCommand };
}
