// ──────────────────────────────────────────────────────────────────────────────
// Secret Redactor
// Sanitizes content before it is logged, sent to the AI model, or written
// to evidence artifacts. See agent/SAFETY_POLICY.md §5.
// ──────────────────────────────────────────────────────────────────────────────

interface RedactionPattern {
  name: string;
  pattern: RegExp;
  replacement: string;
}

const REDACTION_PATTERNS: RedactionPattern[] = [
  {
    name: 'GITHUB_TOKEN',
    pattern: /ghp_[A-Za-z0-9]{36}/g,
    replacement: '[REDACTED:GITHUB_TOKEN]',
  },
  {
    name: 'GITHUB_OAUTH',
    pattern: /gho_[A-Za-z0-9]{36}/g,
    replacement: '[REDACTED:GITHUB_OAUTH]',
  },
  {
    name: 'GITHUB_APP_TOKEN',
    pattern: /ghs_[A-Za-z0-9]{36}/g,
    replacement: '[REDACTED:GITHUB_APP_TOKEN]',
  },
  {
    name: 'AWS_ACCESS_KEY',
    pattern: /AKIA[0-9A-Z]{16}/g,
    replacement: '[REDACTED:AWS_ACCESS_KEY]',
  },
  {
    name: 'AWS_SECRET',
    pattern: /(?<![A-Za-z0-9])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
    replacement: '[REDACTED:AWS_SECRET_CANDIDATE]',
  },
  {
    name: 'BEARER_TOKEN',
    pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,
    replacement: 'Bearer [REDACTED:BEARER_TOKEN]',
  },
  {
    name: 'SENTRY_DSN',
    pattern: /https:\/\/[a-f0-9]+@[^/]+\.sentry\.io\/[0-9]+/g,
    replacement: '[REDACTED:SENTRY_DSN]',
  },
  {
    name: 'PRIVATE_KEY_BLOCK',
    pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE KEY-----/g,
    replacement: '[REDACTED:PRIVATE_KEY]',
  },
  {
    name: 'ENV_ASSIGNMENT',
    // Lines that look like: SECRET_KEY=value or SECRET_KEY="value"
    pattern: /^((?:SECRET|TOKEN|KEY|PASSWORD|PASSWD|PWD|API_KEY|PRIVATE)[A-Z_]*)=.+$/gim,
    replacement: '$1=[REDACTED:ENV_VALUE]',
  },
];

/**
 * Redact known secret patterns from a string.
 * Returns the sanitized string and a list of redaction types applied.
 */
export function redact(content: string): {
  sanitized: string;
  redactionTypes: string[];
} {
  let sanitized = content;
  const redactionTypes: string[] = [];

  for (const { name, pattern, replacement } of REDACTION_PATTERNS) {
    const before = sanitized;
    sanitized = sanitized.replace(pattern, replacement);
    if (sanitized !== before) {
      redactionTypes.push(name);
    }
  }

  return { sanitized, redactionTypes };
}

/**
 * Redact content and return only the sanitized string.
 * Use when you don't need to know which patterns matched.
 */
export function redactString(content: string): string {
  return redact(content).sanitized;
}

/**
 * Redact all string values in a plain object (shallow).
 */
export function redactObject<T extends Record<string, unknown>>(
  obj: T,
): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = redactString(value);
    }
  }
  return result;
}
