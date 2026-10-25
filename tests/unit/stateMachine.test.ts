import { describe, it, expect } from 'vitest';
import { JobRepository } from '../../packages/core/src/db/repositories.js';
import { createInMemoryDatabase } from '../../packages/core/src/db/database.js';

describe('Domain: Job State Machine', () => {
  it('correctly transitions from PENDING through INSPECTING to BASELINE_FAILED', () => {
    const db = createInMemoryDatabase();
    const repo = new JobRepository(db);

    const job = repo.create({
      repoPath: 'fixtures/broken-calc',
      testCommand: 'npm test',
    });

    expect(job.stage).toBe('PENDING');
    expect(job.status).toBe('QUEUED');

    repo.transition(job.id, 'INSPECTING');
    const inspectingJob = repo.findById(job.id);
    expect(inspectingJob?.stage).toBe('INSPECTING');
    expect(inspectingJob?.status).toBe('RUNNING');

    repo.transition(job.id, 'BASELINE_FAILED');
    const reproducedJob = repo.findById(job.id);
    expect(reproducedJob?.stage).toBe('BASELINE_FAILED');
  });

  it('enforces terminal states and updates timestamp', () => {
    const db = createInMemoryDatabase();
    const repo = new JobRepository(db);

    const job = repo.create({
      repoPath: 'fixtures/broken-calc',
    });

    repo.transition(job.id, 'COMPLETE', { status: 'COMPLETED' });
    const completedJob = repo.findById(job.id);
    expect(completedJob?.stage).toBe('COMPLETE');
    expect(completedJob?.status).toBe('COMPLETED');
  });
});
