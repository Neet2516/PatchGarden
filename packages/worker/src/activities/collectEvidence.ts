import fs from 'fs';
import path from 'path';
import { getDatabase, JobRepository, CheckpointRepository, redactString } from '@patchgarden/core';
import type { FailingTest } from '@patchgarden/core';

interface CollectEvidenceInput {
  jobId: string;
  repoPath: string;
  evidenceRoot: string;
  failingTests: FailingTest[];
}

interface CollectEvidenceOutput {
  success: boolean;
  evidenceDir?: string;
  filesCollected?: number;
  error?: string;
}

const MAX_FILE_SIZE = 100 * 1024; // 100KB per file
const MAX_FILES = 20;
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.nyc_output']);
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md']);

/** Walk repo to find source files relevant to failing tests */
function findRelevantFiles(repoPath: string, failingTests: FailingTest[]): string[] {
  const allFiles: string[] = [];

  function walk(dir: string, depth = 0) {
    if (depth > 5) return;
    let entries: fs.Dirent[];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (CODE_EXTENSIONS.has(ext)) {
          allFiles.push(fullPath);
        }
      }
    }
  }

  walk(repoPath);

  // Score files by relevance to failing test names
  const testNames = failingTests.map(t => t.name.toLowerCase());
  const scored = allFiles.map(f => {
    const rel = path.relative(repoPath, f).toLowerCase();
    const score = testNames.reduce((acc, name) => {
      const words = name.split(/\s+/);
      return acc + words.filter(w => w.length > 3 && rel.includes(w)).length;
    }, 0);
    return { file: f, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_FILES).map(s => s.file);
}

export async function collectEvidence(
  input: CollectEvidenceInput,
): Promise<CollectEvidenceOutput> {
  const { jobId, repoPath, evidenceRoot, failingTests } = input;
  const db = getDatabase();
  const jobRepo = new JobRepository(db);
  const ckptRepo = new CheckpointRepository(db);

  try {
    const evidenceDir = path.join(evidenceRoot, jobId);
    fs.mkdirSync(evidenceDir, { recursive: true });

    const relevantFiles = findRelevantFiles(repoPath, failingTests);
    const fileContents: Array<{ path: string; content: string; truncated: boolean }> = [];

    for (const filePath of relevantFiles) {
      try {
        const stat = fs.statSync(filePath);
        if (stat.size > MAX_FILE_SIZE * 2) continue; // Skip very large files

        const raw = fs.readFileSync(filePath, 'utf8');
        const content = redactString(raw); // Apply secret redaction
        const truncated = content.length > MAX_FILE_SIZE;
        fileContents.push({
          path: path.relative(repoPath, filePath),
          content: content.slice(0, MAX_FILE_SIZE),
          truncated,
        });
      } catch { /* skip unreadable files */ }
    }

    // Read package.json for dependency context
    let packageJson = '';
    try {
      const pkgPath = path.join(repoPath, 'package.json');
      const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
      packageJson = redactString(pkgRaw.slice(0, 5000));
    } catch { /* no package.json */ }

    const diagnostic = {
      ts: new Date().toISOString(),
      repoPath,
      failingTests,
      relevantFiles: fileContents.map(f => f.path),
      fileContents,
      packageJson,
    };

    fs.writeFileSync(path.join(evidenceDir, 'diagnostic.json'), JSON.stringify(diagnostic, null, 2));

    jobRepo.transition(jobId, 'ANALYZING');
    ckptRepo.create({ jobId, stage: 'ANALYZING' });

    return { success: true, evidenceDir, filesCollected: fileContents.length };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
