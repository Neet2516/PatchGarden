import { describe, it, expect } from 'vitest';
import { redactSecrets } from '../../packages/core/src/security/redactor.js';

describe('Security: Secret Redactor', () => {
  it('redacts OpenAI/Anthropic secret API keys', () => {
    const raw = 'Error authenticating with sk-abc12345678901234567890 in config';
    const cleaned = redactSecrets(raw);
    expect(cleaned).not.toContain('sk-abc12345678901234567890');
    expect(cleaned).toContain('[REDACTED_API_KEY]');
  });

  it('redacts GitHub Personal Access Tokens', () => {
    const raw = 'git clone https://ghp_123456789012345678901234567890123456@github.com/repo';
    const cleaned = redactSecrets(raw);
    expect(cleaned).not.toContain('ghp_123456789012345678901234567890123456');
    expect(cleaned).toContain('[REDACTED_GITHUB_TOKEN]');
  });

  it('redacts AWS Access Key IDs', () => {
    const raw = 'AccessKeyId: AKIAIOSFODNN7EXAMPLE';
    const cleaned = redactSecrets(raw);
    expect(cleaned).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(cleaned).toContain('[REDACTED_AWS_KEY]');
  });
});
