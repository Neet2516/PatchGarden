import { describe, it, expect } from 'vitest';
import { JobRepository } from '../../packages/core/src/db/repositories.js';
import { createInMemoryDatabase } from '../../packages/core/src/db/database.js';
import { StateTransitionError } from '../../packages/core/src/types/index.js';

describe('Domain: Job State Machine', () => {
  it('correctly transitions from CREATED through INSPECTING to IDENTIFYING', () => {
    const db = createInMemoryDatabase();
    const repo = new JobRepository(db);

    const job = repo.create({
      repoPath: 'fixtures/broken-calc',
      testCommand: 'npm test',
    });

    expect(job.stage).toBe('CREATED');
    expect(job.status).toBe('CREATED');

    repo.transition(job.id, 'INSPECTING', { status: 'IN_PROGRESS' });
    const inspectingJob = repo.findById(job.id);
    expect(inspectingJob?.stage).toBe('INSPECTING');
    expect(inspectingJob?.status).toBe('IN_PROGRESS');

    repo.transition(job.id, 'IDENTIFYING');
    const identifyingJob = repo.findById(job.id);
    expect(identifyingJob?.stage).toBe('IDENTIFYING');
  });

  it('enforces terminal states and rejects invalid transitions', () => {
    const db = createInMemoryDatabase();
    const repo = new JobRepository(db);

    const job = repo.create({
      repoPath: 'fixtures/broken-calc',
    });

    // Cannot jump from CREATED directly to COMPLETE
    expect(() => repo.transition(job.id, 'COMPLETE')).toThrow(StateTransitionError);

    // Can transition to BLOCKED (which is terminal)
    repo.transition(job.id, 'BLOCKED', { status: 'BLOCKED' });
    const blockedJob = repo.findById(job.id);
    expect(blockedJob?.stage).toBe('BLOCKED');
    expect(blockedJob?.status).toBe('BLOCKED');

    // Terminal state cannot transition anywhere
    expect(() => repo.transition(job.id, 'INSPECTING')).toThrow(StateTransitionError);
  });
});
