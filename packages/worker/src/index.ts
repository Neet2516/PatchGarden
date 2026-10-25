import { NativeConnection, Worker } from '@temporalio/worker';
import * as Sentry from '@sentry/node';
import * as activities from './activities/index.js';

// ──────────────────────────────────────────────────────────────────────────────
// Sentry init
// ──────────────────────────────────────────────────────────────────────────────
if (process.env['SENTRY_DSN']) {
  Sentry.init({
    dsn: process.env['SENTRY_DSN'],
    environment: process.env['SENTRY_ENVIRONMENT'] ?? 'development',
    tracesSampleRate: parseFloat(process.env['SENTRY_TRACES_SAMPLE_RATE'] ?? '1.0'),
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Temporal Worker
// ──────────────────────────────────────────────────────────────────────────────
async function main() {
  const connection = await NativeConnection.connect({
    address: process.env['TEMPORAL_ADDRESS'] ?? 'localhost:7233',
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflows/index'),
    activities,
    taskQueue: process.env['TEMPORAL_TASK_QUEUE'] ?? 'patchgarden-worker',
    namespace: process.env['TEMPORAL_NAMESPACE'] ?? 'patchgarden',
    maxConcurrentActivityTaskExecutions: 2,
    maxConcurrentWorkflowTaskExecutions: 2,
  });

  console.log('PatchGarden worker started. Listening for tasks on queue: patchgarden-worker...');
  await worker.run();
}

main().catch((err) => {
  console.error('Worker fatal error:', err);
  Sentry.captureException(err);
  process.exit(1);
});
