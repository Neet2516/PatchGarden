import fs from 'fs';
import path from 'path';
import * as Sentry from '@sentry/node';
import { getDatabase, JobRepository, CheckpointRepository } from '@patchgarden/core';
import type { AnalysisResult } from '@patchgarden/core';
import { runInference } from '../ai/ollama.js';

interface AnalyzeWithAIInput {
  jobId: string;
  evidenceRoot: string;
}

interface AnalyzeWithAIOutput {
  success: boolean;
  confidence?: string;
  error?: string;
}

const MAX_RETRIES = 3;

export async function analyzeWithAI(
  input: AnalyzeWithAIInput,
): Promise<AnalyzeWithAIOutput> {
  const { jobId, evidenceRoot } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  // Read diagnostic evidence
  const evidenceDir = path.join(evidenceRoot, jobId);
  let diagnosticContext = '';

  try {
    const baseline = JSON.parse(
      fs.readFileSync(path.join(evidenceDir, 'baseline.json'), 'utf8'),
    ) as { failingTests: Array<{ name: string; errorMessage: string }>; stdout: string; stderr: string };

    const diagnostic = JSON.parse(
      fs.readFileSync(path.join(evidenceDir, 'diagnostic.json'), 'utf8'),
    ) as {
      failingTests: Array<{ name: string; errorMessage: string }>;
      fileContents: Array<{ path: string; content: string }>;
      packageJson: string;
    };

    // Build context string (token-limited)
    const sections: string[] = [];
    sections.push(`## Failing Tests\n${baseline.failingTests.map(t => `- ${t.name}: ${t.errorMessage}`).join('\n')}`);
    sections.push(`## Test Output (truncated)\n${(baseline.stdout + baseline.stderr).slice(0, 3000)}`);
    if (diagnostic.packageJson) {
      sections.push(`## package.json\n${diagnostic.packageJson.slice(0, 1000)}`);
    }
    for (const file of diagnostic.fileContents.slice(0, 8)) {
      sections.push(`## File: ${file.path}\n\`\`\`\n${file.content.slice(0, 2000)}\n\`\`\``);
    }

    diagnosticContext = sections.join('\n\n').slice(0, 12000); // ~3k tokens
  } catch (err) {
    return { success: false, error: `Failed to read evidence: ${String(err)}` };
  }

  // Run inference with retries
  const span = Sentry.startInactiveSpan({ name: 'ai.analyzeWithGemma', op: 'ai.inference' });

  let lastError = '';
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await runInference({ diagnosticContext, jobId });

      if (result.output) {
        const analysis: AnalysisResult = {
          hypothesis: result.output.hypothesis,
          affectedFiles: result.output.affectedFiles,
          patchPlan: result.output.patchPlan,
          confidence: result.output.confidence,
          modelId: result.modelId,
          promptTokens: result.promptTokens,
          completionTokens: result.completionTokens,
          latencyMs: result.latencyMs,
        };

        // Save analysis evidence
        fs.writeFileSync(
          path.join(evidenceDir, 'analysis.json'),
          JSON.stringify({ ...analysis, ts: new Date().toISOString() }, null, 2),
        );

        jobRepo.transition(jobId, 'AWAITING_APPROVAL', { analysis });
        ckptRepo.create({ jobId, stage: 'AWAITING_APPROVAL', workerVersion: '0.1.0' });

        span.setAttributes({ 'ai.model': result.modelId, 'ai.confidence': result.output.confidence, 'ai.latency_ms': result.latencyMs });
        span.end();
        return { success: true, confidence: result.output.confidence };
      }

      lastError = result.validationErrors.join('; ');
      Sentry.captureMessage(`AI output validation failed (attempt ${attempt}): ${lastError}`, 'warning');

    } catch (err) {
      lastError = String(err);
    }

    if (attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 5000 * attempt)); // backoff
    }
  }

  span.end();
  jobRepo.transition(jobId, 'BLOCKED', { errorCode: 'MODEL_OUTPUT_INVALID', errorMessage: lastError });
  return { success: false, error: `All ${MAX_RETRIES} inference attempts failed: ${lastError}` };
}
