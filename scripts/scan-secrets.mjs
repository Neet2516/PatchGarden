import fs from 'fs';
import path from 'path';

const SECRET_PATTERNS = [
  { name: 'OpenAI / Anthropic API Key', pattern: /sk-[a-zA-Z0-9]{20,}/ },
  { name: 'GitHub Personal Access Token', pattern: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'GitHub Fine-Grained Token', pattern: /github_pat_[a-zA-Z0-9_]{60,}/ },
  { name: 'AWS Access Key ID', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'Private Key Block', pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Slack Webhook URL', pattern: /https:\/\/hooks\.slack\.com\/services\/T[0-9A-Za-z]{8}\/B[0-9A-Za-z]{8}\/[0-9A-Za-z]{24}/ },
  { name: 'Stripe Secret Key', pattern: /sk_live_[0-9a-zA-Z]{24}/ },
];

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  '.next',
  'build',
  'coverage',
]);

let violations = 0;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      // Don't scan binary files or this scanner itself
      if (entry.name === 'scan-secrets.mjs' || entry.name.endsWith('.png') || entry.name.endsWith('.db')) {
        continue;
      }
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip comment lines explaining the patterns or tests deliberately testing scanner
    if (filePath.includes('tests') || filePath.includes('security')) return;

    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        console.error(`🚨 SECRET DETECTED in ${filePath}:${idx + 1}`);
        console.error(`   Type: ${name}`);
        violations++;
      }
    }
  });
}

console.log('🔍 Starting PatchGarden Secret Scan...');
scanDirectory(process.cwd());

if (violations > 0) {
  console.error(`\n❌ Secret scan failed with ${violations} violations.`);
  process.exit(1);
} else {
  console.log('✅ Clean! No leaked secrets or credentials detected.');
  process.exit(0);
}
