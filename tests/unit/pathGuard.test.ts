import { describe, it, expect } from 'vitest';
import path from 'path';
import { assertPathInWorkspace } from '../../packages/core/src/security/pathGuard.js';

describe('Security: Path Guard', () => {
  const workspaceRoot = path.resolve('/tmp/patchgarden-workspace');

  it('allows safe relative paths inside workspace', () => {
    const validPath = path.join(workspaceRoot, 'src', 'calculator.ts');
    expect(() => assertPathInWorkspace(validPath, workspaceRoot)).not.toThrow();
  });

  it('blocks path traversal attempts (../ escape)', () => {
    const maliciousPath = path.join(workspaceRoot, '..', '..', 'etc', 'passwd');
    expect(() => assertPathInWorkspace(maliciousPath, workspaceRoot)).toThrow(/Path traversal detected/);
  });

  it('blocks root traversal tricks', () => {
    const rootEscape = path.resolve('/etc/shadow');
    expect(() => assertPathInWorkspace(rootEscape, workspaceRoot)).toThrow(/Path traversal detected/);
  });
});
