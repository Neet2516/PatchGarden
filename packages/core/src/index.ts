export { getDatabase, migrate, closeDatabase, createInMemoryDatabase } from './db/database.js';
export { JobRepository, CheckpointRepository, AuditEventRepository } from './db/repositories.js';
export { assertPathInWorkspace, assertNoSymlinkEscape, sanitizeFilename, PathTraversalError } from './security/pathGuard.js';
export { redact, redactString, redactObject } from './security/redactor.js';
export type {
  Job,
  JobStatus,
  WorkflowStage,
  ApprovalState,
  AnalysisConfidence,
  TestStatus,
  TestResult,
  FailingTest,
  AnalysisResult,
  PatchInstruction,
  Checkpoint,
  AuditEvent,
  AuditEventType,
} from './types/index.js';
export {
  VALID_TRANSITIONS,
  StateTransitionError,
  assertValidTransition,
} from './types/index.js';
