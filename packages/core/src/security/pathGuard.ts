import path from 'path';
import fs from 'fs';

// ──────────────────────────────────────────────────────────────────────────────
// Path Guard — prevents path traversal attacks
// All file I/O in PatchGarden must pass through these functions.
// See agent/SAFETY_POLICY.md §2 for the threat model.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Thrown when a path escapes its allowed workspace.
 */
export class PathTraversalError extends Error {
  constructor(
    public readonly targetPath: string,
    public readonly workspace: string,
  ) {
    super(
      `Path traversal detected: "${targetPath}" escapes workspace "${workspace}"`,
    );
    this.name = 'PathTraversalError';
  }
}

/**
 * Windows device names that must never be used as filenames.
 * These can cause hangs or unexpected behavior on Windows.
 */
const WINDOWS_DEVICE_NAMES = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM0', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT0', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);

/**
 * Assert that a target path is within the given workspace directory.
 * Resolves symlinks to check the real path. Throws PathTraversalError if not.
 *
 * @param targetPath - Path to validate
 * @param workspaceRoot - The allowed workspace root directory
 */
export function assertPathInWorkspace(
  targetPath: string,
  workspaceRoot: string,
): void {
  // Check for null bytes
  if (targetPath.includes('\0')) {
    throw new PathTraversalError(targetPath, workspaceRoot);
  }

  // Resolve both paths to absolute form
  const resolvedTarget = path.resolve(targetPath);
  const resolvedWorkspace = path.resolve(workspaceRoot);

  // The resolved target must start with the workspace path + separator
  // This prevents /workspace-extra from matching /workspace
  const workspaceWithSep = resolvedWorkspace.endsWith(path.sep)
    ? resolvedWorkspace
    : resolvedWorkspace + path.sep;

  if (
    resolvedTarget !== resolvedWorkspace &&
    !resolvedTarget.startsWith(workspaceWithSep)
  ) {
    throw new PathTraversalError(targetPath, workspaceRoot);
  }

  // Check path components for Windows device names
  const components = resolvedTarget.split(path.sep);
  for (const component of components) {
    const name = component.split('.')[0]?.toUpperCase() ?? '';
    if (WINDOWS_DEVICE_NAMES.has(name)) {
      throw new PathTraversalError(targetPath, workspaceRoot);
    }
  }
}

/**
 * Check a file path for symlinks that escape the workspace.
 * Uses lstatSync (not statSync) to inspect the link itself, not the target.
 *
 * @param filePath - Path to check
 * @param workspaceRoot - The allowed workspace root directory
 */
export function assertNoSymlinkEscape(
  filePath: string,
  workspaceRoot: string,
): void {
  assertPathInWorkspace(filePath, workspaceRoot);

  // If the path is a symlink, check where it points
  try {
    const stat = fs.lstatSync(filePath);
    if (stat.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(filePath);
      const resolvedLink = path.resolve(path.dirname(filePath), linkTarget);
      assertPathInWorkspace(resolvedLink, workspaceRoot);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist yet — that's okay for write operations
      return;
    }
    throw err;
  }
}

/**
 * Sanitize a filename component to prevent path injection.
 * Removes traversal sequences and special characters.
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\.\./g, '')       // Remove traversal sequences
    .replace(/[/\\]/g, '_')     // Replace path separators
    .replace(/\0/g, '')         // Remove null bytes
    .replace(/[<>:"|?*]/g, '_') // Remove Windows-forbidden chars
    .trim();
}
