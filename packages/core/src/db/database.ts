import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ──────────────────────────────────────────────────────────────────────────────
// Schema SQL
// ──────────────────────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  repo_path TEXT NOT NULL,
  repo_head_commit TEXT,
  repo_branch TEXT,
  repo_remote TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED',
  stage TEXT NOT NULL DEFAULT 'CREATED',
  workflow_id TEXT,
  run_id TEXT,
  worktree_path TEXT,
  test_command TEXT,
  baseline_result TEXT,
  analysis TEXT,
  patch_diff TEXT,
  diff_hash TEXT,
  candidate_result TEXT,
  approval_state TEXT DEFAULT 'PENDING',
  approved_by TEXT,
  rejection_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  model_id TEXT,
  error_code TEXT,
  error_message TEXT,
  evidence_dir TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  stage TEXT NOT NULL,
  evidence_hash TEXT,
  worker_version TEXT,
  temporal_run_id TEXT,
  attempt INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  event_type TEXT NOT NULL,
  actor TEXT,
  payload TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_checkpoints_job ON checkpoints(job_id);
CREATE INDEX IF NOT EXISTS idx_audit_job ON audit_events(job_id);
`;

// ──────────────────────────────────────────────────────────────────────────────
// Database Singleton
// ──────────────────────────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

export function getDatabase(dbPath?: string): Database.Database {
  if (_db) return _db;

  const resolvedPath = dbPath ?? process.env['DATABASE_URL'] ?? './patchgarden.db';
  
  // Handle file: prefix from URL format
  const filePath = resolvedPath.startsWith('file:') 
    ? resolvedPath.slice(5) 
    : resolvedPath;

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(filePath);
  migrate(_db);
  return _db;
}

export function migrate(db: Database.Database): void {
  db.exec(SCHEMA_SQL);
  
  // Record migration
  const insertVersion = db.prepare(`
    INSERT OR IGNORE INTO schema_version (version, applied_at)
    VALUES (1, ?)
  `);
  insertVersion.run(new Date().toISOString());
}

export function closeDatabase(): void {
  _db?.close();
  _db = null;
}

// ──────────────────────────────────────────────────────────────────────────────
// In-memory DB for tests
// ──────────────────────────────────────────────────────────────────────────────

export function createInMemoryDatabase(): Database.Database {
  const db = new Database(':memory:');
  migrate(db);
  return db;
}
