import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import helmet from '@fastify/helmet';
import * as Sentry from '@sentry/node';
import { Client, Connection } from '@temporalio/client';
import { getDatabase, JobRepository, AuditEventRepository } from '@patchgarden/core';

// ──────────────────────────────────────────────────────────────────────────────
// Sentry Initialization
// ──────────────────────────────────────────────────────────────────────────────

if (process.env['SENTRY_DSN']) {
  Sentry.init({
    dsn: process.env['SENTRY_DSN'],
    environment: process.env['SENTRY_ENVIRONMENT'] ?? 'development',
    tracesSampleRate: parseFloat(
      process.env['SENTRY_TRACES_SAMPLE_RATE'] ?? '1.0',
    ),
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Fastify Application
// ──────────────────────────────────────────────────────────────────────────────

const app = Fastify({
  logger: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    transport:
      process.env['NODE_ENV'] !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
  },
});

// ── Plugins ──────────────────────────────────────────────────────────────────

await app.register(helmet, { global: true });
await app.register(cors, {
  origin: [
    'http://localhost:3000',
    process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
  ],
  credentials: true,
});
await app.register(websocket);

// ── Database and Temporal Client ─────────────────────────────────────────────

const db = getDatabase();
const jobRepo = new JobRepository(db);
const auditRepo = new AuditEventRepository(db);

let temporalClient: Client | null = null;

async function getTemporalClient(): Promise<Client> {
  if (temporalClient) return temporalClient;
  const connection = await Connection.connect({
    address: process.env['TEMPORAL_ADDRESS'] ?? 'localhost:7233',
  });
  temporalClient = new Client({
    connection,
    namespace: process.env['TEMPORAL_NAMESPACE'] ?? 'patchgarden',
  });
  return temporalClient;
}

// ──────────────────────────────────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '0.1.0',
}));

// Temporal status
app.get('/temporal/status', async () => {
  try {
    await getTemporalClient();
    return { connected: true, address: process.env['TEMPORAL_ADDRESS'] };
  } catch {
    return { connected: false };
  }
});

// Ollama/model status
app.get('/model/status', async () => {
  try {
    const { default: axios } = await import('axios');
    const ollamaUrl = process.env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434';
    const res = await axios.get(`${ollamaUrl}/api/tags`, { timeout: 5000 });
    const models = (res.data as { models?: Array<{name: string}> }).models ?? [];
    const modelName = process.env['OLLAMA_MODEL'] ?? 'gemma3:4b';
    return {
      available: true,
      modelLoaded: models.some((m) => m.name.startsWith(modelName)),
      models: models.map((m) => m.name),
    };
  } catch (err) {
    return { available: false, modelLoaded: false, error: String(err) };
  }
});

// List jobs
app.get('/jobs', async (request) => {
  const { status } = request.query as { status?: string };
  if (status) {
    return jobRepo.findByStatus(status as Parameters<typeof jobRepo.findByStatus>[0]);
  }
  return jobRepo.list();
});

// Get job by ID
app.get('/jobs/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });
  return job;
});

// Get audit events for a job
app.get('/jobs/:id/events', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });
  return auditRepo.findByJobId(id);
});

// Create a new job
app.post('/jobs', async (request, reply) => {
  const span = Sentry.startInactiveSpan({ name: 'api.createJob' });
  
  try {
    const { repoPath } = request.body as { repoPath?: string };

    if (!repoPath || typeof repoPath !== 'string') {
      return reply.status(400).send({ error: 'repoPath is required' });
    }

    // Create job record
    const job = jobRepo.create({ repoPath });

    auditRepo.append({
      jobId: job.id,
      eventType: 'JOB_CREATED',
      actor: 'api',
      payload: { repoPath },
    });

    // Start Temporal workflow
    try {
      const client = await getTemporalClient();
      const handle = await client.workflow.start('PatchGardenWorkflow', {
        taskQueue: process.env['TEMPORAL_TASK_QUEUE'] ?? 'patchgarden-worker',
        workflowId: job.id,
        args: [{
          jobId: job.id,
          repoPath,
          workspaceRoot: process.env['WORKSPACE_ROOT'] ?? './workspaces',
          evidenceRoot: process.env['EVIDENCE_ROOT'] ?? './jobs',
        }],
      });

      // Update job with workflow ID
      jobRepo.transition(job.id, 'INSPECTING', {
        workflowId: handle.workflowId,
        runId: handle.firstExecutionRunId,
      });
    } catch (err) {
      app.log.error({ jobId: job.id, err }, 'Failed to start Temporal workflow');
      jobRepo.transition(job.id, 'BLOCKED', {
        errorCode: 'TEMPORAL_START_FAILED',
        errorMessage: String(err),
      });
    }

    return reply.status(201).send(jobRepo.findById(job.id));
  } finally {
    span.end();
  }
});

// Approve proposal
app.post('/jobs/:id/approve-proposal', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });

  try {
    const client = await getTemporalClient();
    const handle = client.workflow.getHandle(id);
    await handle.signal('approveProposal');

    auditRepo.append({
      jobId: id,
      eventType: 'PATCH_PROPOSAL_APPROVED',
      actor: 'human',
    });

    return { signaled: true };
  } catch (err) {
    return reply.status(500).send({ error: String(err) });
  }
});

// Reject proposal
app.post('/jobs/:id/reject-proposal', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });

  const { reason } = request.body as { reason?: string };

  try {
    const client = await getTemporalClient();
    const handle = client.workflow.getHandle(id);
    await handle.signal('rejectProposal', reason);

    auditRepo.append({
      jobId: id,
      eventType: 'PATCH_PROPOSAL_REJECTED',
      actor: 'human',
      payload: { reason },
    });

    return { signaled: true };
  } catch (err) {
    return reply.status(500).send({ error: String(err) });
  }
});

// Approve final result
app.post('/jobs/:id/approve-result', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });

  try {
    const client = await getTemporalClient();
    const handle = client.workflow.getHandle(id);
    await handle.signal('approveFinal');

    auditRepo.append({
      jobId: id,
      eventType: 'PATCH_RESULT_APPROVED',
      actor: 'human',
    });

    return { signaled: true };
  } catch (err) {
    return reply.status(500).send({ error: String(err) });
  }
});

// Reject final result
app.post('/jobs/:id/reject-result', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = jobRepo.findById(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });

  const { reason } = request.body as { reason?: string };

  try {
    const client = await getTemporalClient();
    const handle = client.workflow.getHandle(id);
    await handle.signal('rejectFinal', reason);

    auditRepo.append({
      jobId: id,
      eventType: 'PATCH_RESULT_REJECTED',
      actor: 'human',
      payload: { reason },
    });

    return { signaled: true };
  } catch (err) {
    return reply.status(500).send({ error: String(err) });
  }
});

// ── WebSocket for real-time job updates ────────────────────────────────────

app.get('/jobs/:id/live', { websocket: true }, (socket, request) => {
  const { id } = request.params as { id: string };

  const sendUpdate = () => {
    const job = jobRepo.findById(id);
    if (job && socket.readyState === 1 /* OPEN */) {
      socket.send(JSON.stringify({ type: 'JOB_UPDATE', data: job }));
    }
  };

  // Send initial state
  sendUpdate();

  // Poll every 2 seconds for updates
  const interval = setInterval(sendUpdate, 2000);

  socket.on('close', () => {
    clearInterval(interval);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

await app.listen({ port: PORT, host: '0.0.0.0' });
app.log.info(`PatchGarden API running on port ${PORT}`);
