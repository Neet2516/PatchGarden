'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  FileText,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Github,
  Cpu,
  Lock,
  Workflow,
  Sparkles,
  AlertTriangle,
  FolderLock,
  EyeOff,
  History,
  Terminal,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import { useTheme } from '../lib/theme';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dp-color-ground)', color: 'var(--dp-color-ink)' }}>
      
      {/* ── TOP UTILITY STRIP & NAVIGATION ────────────────────────────────────────── */}
      <nav
        aria-label="Newspaper Top Bar"
        style={{
          borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
          padding: '8px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--dp-typography-label)',
          fontFamily: 'var(--dp-typography-display)',
          letterSpacing: 'var(--dp-typography-label-tracking)',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 700, color: 'var(--dp-color-accent)' }}>● DISPATCH</span>
          <span style={{ color: 'var(--dp-color-secondary)' }}>Hacktoberfest 2026 AI Challenge • Week 3</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#how-it-works" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none', fontWeight: 650 }}>
            Methodology
          </a>
          <a href="#comparisons" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none', fontWeight: 650 }}>
            The Difference
          </a>
          <a href="#safety" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none', fontWeight: 650 }}>
            Safety Charter
          </a>
          <a href="#enquiries" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none', fontWeight: 650 }}>
            Enquiries
          </a>
          <a
            href="https://github.com/Neet2516/PatchGarden"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--dp-color-ink)', textDecoration: 'none', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Github size={13} />
            <span>Repository</span>
          </a>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle edition theme"
            className="newsprint-button"
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              textTransform: 'uppercase',
            }}
          >
            {theme === 'dark' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sun size={12} /> Morning Edition
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Moon size={12} /> Evening Broadside
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── BROAD CONTINUOUS NEWSPAPER SHEET ────────────────────────────────────────── */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 80px 24px' }}>

        {/* ── SECTION: MASTHEAD ────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: '28px', paddingBottom: '22px' }}>
          
          {/* Top Double Rule */}
          <div className="newsprint-double-rule" style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontFamily: 'var(--dp-typography-display)',
                fontWeight: 650,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dp-color-secondary)',
                padding: '2px 0',
              }}
            >
              <span>VOL. I, NO. 3 — HACKTOBERFEST 2026 EDITION</span>
              <span>THE JOURNAL OF DETERMINISTIC OPEN-SOURCE REPAIR</span>
              <span>LATE CITY FINAL • FREE & OPEN-SOURCE (MIT)</span>
            </div>
          </div>

          {/* Enormous Masthead Title */}
          <div style={{ textAlign: 'center', padding: '18px 0 10px 0' }}>
            <h1
              style={{
                fontFamily: 'var(--dp-typography-display)',
                fontSize: 'clamp(46px, 8vw, 84px)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                margin: 0,
                color: 'var(--dp-color-ink)',
              }}
            >
              P A T C H G A R D E N
            </h1>
            <p
              style={{
                fontFamily: 'var(--dp-typography-reading)',
                fontStyle: 'italic',
                fontSize: '18px',
                color: 'var(--dp-color-secondary)',
                marginTop: '10px',
              }}
            >
              The Slow and Steady AI Maintenance Engineer — Never Rushes a Patch.
            </p>
          </div>

          {/* Under-Masthead Heavy Section Rule */}
          <hr className="newsprint-section-rule" style={{ marginBottom: '8px' }} />

          {/* Three-part motto bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
              fontSize: '11px',
              fontFamily: 'var(--dp-typography-display)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--dp-color-secondary)',
            }}
          >
            <span>INFERENCE: LOCAL GEMMA 3 (4B)</span>
            <span style={{ color: 'var(--dp-color-accent)' }}>★ MANDATORY MAINTAINER APPROVAL GATES ★</span>
            <span>DURABLE ENGINE: TEMPORAL CLOUD / DEV</span>
          </div>

        </header>

        {/* ── SECTION: 3:1 LEAD SPREAD ────────────────────────────────────────────── */}
        <section
          className="newsprint-lead-split"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 'var(--dp-spacing-column)',
            paddingTop: '20px',
            paddingBottom: '36px',
            borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
          }}
        >
          {/* Broad Lead Column (3/4) */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="newsprint-badge-red" style={{ marginBottom: '8px' }}>
                SPECIAL REPORT: VERIFIED REPAIR
              </span>
              <h2
                style={{
                  fontFamily: 'var(--dp-typography-display)',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: 'var(--dp-color-ink)',
                  margin: '8px 0 12px 0',
                }}
              >
                AI Engineer Confines Repaired Patches to Isolated Worktrees Until Zero Regressions Are Proven
              </h2>
              <div className="newsprint-byline" style={{ marginBottom: '14px' }}>
                By the PatchGarden Engineering Staff • Verified in Ephemeral Repositories
              </div>
            </div>

            <p className="newsprint-dropcap" style={{ fontSize: 'var(--dp-typography-body)', lineHeight: 1.4 }}>
              In an ecosystem inundated by unchecked autonomous code generation and hallucinated pull requests, <strong>PatchGarden</strong> introduces a disciplined countermeasure. Rather than rushing tentative edits into production branches, this maintenance system treats every code modification with strict editorial skepticism. It runs baseline suites to reproduce verifiable failures, generates surgical diffs with local Google Gemma 3 inference, isolates execution in ephemeral worktrees, and guarantees that not a single line merges without explicit human maintainer consent.
            </p>

            <p style={{ color: 'var(--dp-color-secondary)' }}>
              Built for Hacktoberfest 2026 under the theme <em>Slow and Steady</em>, PatchGarden optimizes for patch verification rather than token volume. Temporal durable orchestration preserves the exact execution state across container reboots, while PathGuard and automatic secret redactors guarantee that zero untrusted paths or credentials ever touch the host machine.
            </p>

            {/* Square Editorial Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/dashboard"
                className="newsprint-button-primary"
                style={{ padding: '12px 26px', fontSize: '15px' }}
              >
                Launch Operations Dashboard
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://github.com/Neet2516/PatchGarden/tree/main/fixtures/broken-calc"
                target="_blank"
                rel="noreferrer"
                className="newsprint-button"
                style={{ padding: '12px 22px', fontSize: '15px' }}
              >
                Inspect `broken-calc` Fixture
              </a>
            </div>

            {/* Monospace Editorial Evidence Box */}
            <div
              style={{
                marginTop: '16px',
                border: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
                background: 'var(--surface-secondary)',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
                  paddingBottom: '8px',
                  marginBottom: '10px',
                  fontFamily: 'var(--dp-typography-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span>EXHIBIT A: DETERMINISTIC VERIFICATION OUTPUT</span>
                <span style={{ color: 'var(--status-success)' }}>● 5 TESTS PASSING (0 REGRESSIONS)</span>
              </div>
              <pre
                style={{
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  overflowX: 'auto',
                  color: 'var(--dp-color-ink)',
                }}
              >
{`> broken-calc@1.0.0 test (isolated worktree: worktree_job_slow_steady_01)
> node --test test/calculator.test.js

✔ add: adds two positive numbers (0.9ms)
✔ subtract: subtracts two numbers (0.1ms)
✔ multiply: multiplies two numbers (0.6ms)
✔ divide: correctly divides two numbers (0.1ms)
✔ divide: throws RangeError on division by zero (0.4ms)

ℹ tests 5 | pass 5 | fail 0
ℹ duration_ms 64.2ms

[VERIFIED EVIDENCE] Baseline reproduction fixed. Zero regressions detected.
Temporal checkpoint created: ckpt_7b39a82f. Awaiting maintainer gate approval.`}
              </pre>
            </div>
          </article>

          {/* Narrow Summary / Dispatch Column (1/4) */}
          <aside
            className="newsprint-vertical-rule"
            style={{
              borderLeft: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
              paddingLeft: 'var(--dp-spacing-column)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ borderBottom: '2px solid var(--dp-color-ink)', paddingBottom: '6px' }}>
              <h3 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Dispatch Bulletins
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ color: 'var(--dp-color-accent)', marginBottom: '4px' }}>01. LOCAL WEIGHTS ONLY</h4>
                <p style={{ fontSize: '14.5px', lineHeight: 1.35, color: 'var(--dp-color-secondary)' }}>
                  Inference is conducted strictly via open-weight Google Gemma 3 (4B) in Docker Ollama. Repository code is never uploaded to cloud LLMs.
                </p>
              </div>

              <hr className="newsprint-hairline" />

              <div>
                <h4 style={{ color: 'var(--dp-color-accent)', marginBottom: '4px' }}>02. ZERO HOST EXECUTION</h4>
                <p style={{ fontSize: '14.5px', lineHeight: 1.35, color: 'var(--dp-color-secondary)' }}>
                  Tests run strictly in isolated Git worktrees with PathGuard bounds checking. Model code is never executed directly on the host machine.
                </p>
              </div>

              <hr className="newsprint-hairline" />

              <div>
                <h4 style={{ color: 'var(--dp-color-accent)', marginBottom: '4px' }}>03. AUTOMATIC REDACTION</h4>
                <p style={{ fontSize: '14.5px', lineHeight: 1.35, color: 'var(--dp-color-secondary)' }}>
                  API tokens, private keys, AWS secrets, and OAuth headers are scrubbed from all logs, model contexts, and evidence summaries.
                </p>
              </div>

              <hr className="newsprint-hairline" />

              <div>
                <h4 style={{ color: 'var(--dp-color-accent)', marginBottom: '4px' }}>04. CRYPTOGRAPHIC EVIDENCE</h4>
                <p style={{ fontSize: '14.5px', lineHeight: 1.35, color: 'var(--dp-color-secondary)' }}>
                  Every transition, test result, and patch candidate is hashed into SQLite and JSONL audit ledgers for complete forensic review.
                </p>
              </div>
            </div>

            {/* Quick Action Box */}
            <div
              style={{
                marginTop: 'auto',
                border: 'var(--dp-border-hairline) solid var(--dp-color-ink)',
                padding: '14px',
                background: 'var(--surface-secondary)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Operational State
              </div>
              <div style={{ fontSize: '13.5px', lineHeight: 1.3, marginBottom: '10px' }}>
                System Doctor reports all 5 subsystems active and compliant.
              </div>
              <Link
                href="/dashboard"
                className="newsprint-button-primary"
                style={{ width: '100%', fontSize: '13px', padding: '8px' }}
              >
                Inspect Live System
              </Link>
            </div>
          </aside>
        </section>

        {/* ── SECTION: COMPACT FACTUAL STRIP ─────────────────────────────────────── */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1px',
            background: 'var(--dp-color-rule)',
            borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
            borderBottom: 'var(--dp-border-section) solid var(--dp-color-ink)',
            margin: '0 0 36px 0',
          }}
        >
          {[
            { metric: '100%', label: 'ISOLATED WORKTREES', desc: 'No modifications to host main tree' },
            { metric: '0', label: 'HOST EXECUTIONS', desc: 'Pre-validated child runner only' },
            { metric: '4B', label: 'GEMMA LOCAL WEIGHTS', desc: 'Zero data leakage outside Docker' },
            { metric: '24h', label: 'HUMAN DECISION GATE', desc: 'Strict maintainer sign-off required' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--dp-color-ground)',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--dp-typography-display)',
                  fontSize: '32px',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'var(--dp-color-ink)',
                }}
              >
                {item.metric}
              </div>
              <div
                style={{
                  fontFamily: 'var(--dp-typography-display)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--dp-color-accent)',
                  margin: '4px 0 2px 0',
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--dp-color-secondary)' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </section>

        {/* ── SECTION: METHODOLOGY & WORKFLOW ────────────────────────────────────── */}
        <section id="how-it-works" style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '2px solid var(--dp-color-ink)', paddingBottom: '6px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              The Five Dispatch Stages of Slow & Steady Maintenance
            </h2>
            <span className="newsprint-byline">PROCEDURAL PROTOCOL</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--dp-spacing-column)',
            }}
          >
            {[
              {
                num: '01',
                title: 'REPRODUCE FAILURE',
                desc: 'PatchGarden executes the test runner against the clean repo to verify the failure is genuine and repeatable before touching any source file.',
              },
              {
                num: '02',
                title: 'REDACT EVIDENCE',
                desc: 'Stack traces, logs, and config files pass through a strict regex redactor to eliminate API keys, OAuth tokens, and sensitive host paths.',
              },
              {
                num: '03',
                title: 'REASON MINIMALLY',
                desc: 'Google Gemma 3 (4B) in Ollama analyzes the failing test and generates a minimal surgical repair proposal rather than an excessive rewrite.',
              },
              {
                num: '04',
                title: 'PROVISION WORKTREE',
                desc: 'A disposable git worktree is spawned on a dedicated branch. The candidate patch is applied strictly within this sandbox boundary.',
              },
              {
                num: '05',
                title: 'VERIFY & SEAL',
                desc: 'The entire test suite is re-run. If regressions emerge, the patch is rejected. If tests pass, evidence is sealed for maintainer sign-off.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  borderTop: '3px solid var(--dp-color-ink)',
                  paddingTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--dp-typography-display)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--dp-color-accent)',
                    letterSpacing: '0.08em',
                  }}
                >
                  STAGE {step.num}
                </div>
                <h3 style={{ fontSize: '16px', margin: '2px 0 6px 0', textTransform: 'uppercase' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14.5px', lineHeight: 1.35, color: 'var(--dp-color-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: COMPARISON TABLE (RUSHED VS. VERIFIED) ────────────────────── */}
        <section id="comparisons" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '2px solid var(--dp-color-ink)', paddingBottom: '6px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              A Comparative Inquiry: Standard AI Tools vs. PatchGarden
            </h2>
            <span className="newsprint-byline">ARCHITECTURAL AUDIT</span>
          </div>

          <table className="newsprint-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Maintenance Dimension</th>
                <th style={{ width: '37.5%' }}>Standard Rushed AI Coding Tools</th>
                <th style={{ width: '37.5%', color: 'var(--dp-color-accent)' }}>
                  <span className="newsprint-badge-red" style={{ marginRight: '8px' }}>FEATURED</span>
                  PatchGarden Verified Dispatch
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Verification Policy</strong></td>
                <td style={{ color: 'var(--dp-color-secondary)' }}>
                  Generates diffs based on token probability without test execution verification.
                </td>
                <td>
                  <strong>Empirical Verification:</strong> Captures baseline failure, applies patch to worktree, and proves regression tests pass.
                </td>
              </tr>
              <tr>
                <td><strong>Execution Safety</strong></td>
                <td style={{ color: 'var(--dp-color-secondary)' }}>
                  Executes arbitrary shell strings directly on the developer host machine.
                </td>
                <td>
                  <strong>PathGuard Whitelist:</strong> Only allowed test runners and git commands execute inside disposable worktrees.
                </td>
              </tr>
              <tr>
                <td><strong>Model Privacy</strong></td>
                <td style={{ color: 'var(--dp-color-secondary)' }}>
                  Uploads proprietary source code and error messages to cloud LLM APIs.
                </td>
                <td>
                  <strong>Local Inference:</strong> Runs Google Gemma 3 (4B) in Docker Ollama on localhost. Zero data leaves your system.
                </td>
              </tr>
              <tr>
                <td><strong>Workflow Durability</strong></td>
                <td style={{ color: 'var(--dp-color-secondary)' }}>
                  In-memory loops. A crash or container reboot loses all state and evidence.
                </td>
                <td>
                  <strong>Temporal Engine:</strong> Workflows survive process restarts, node crashes, and network timeouts deterministically.
                </td>
              </tr>
              <tr>
                <td><strong>Maintainer Control</strong></td>
                <td style={{ color: 'var(--dp-color-secondary)' }}>
                  Pressures maintainers with mass automated PRs that require tedious manual validation.
                </td>
                <td>
                  <strong>Mandatory Gates:</strong> Sealed evidence dossiers, blast radius metrics, and human sign-off required at every checkpoint.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── SECTION: SAFETY & SECURITY CHARTER ──────────────────────────────────── */}
        <section id="safety" style={{ marginBottom: '48px', borderTop: 'var(--dp-border-section) solid var(--dp-color-ink)', paddingTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--dp-spacing-column)' }} className="newsprint-lead-split">
            <div>
              <span className="newsprint-marker-red">SAFETY PROTOCOL</span>
              <h2 style={{ fontSize: '26px', margin: '6px 0 12px 0' }}>
                Strict Engineering Invariants Governed by `SAFETY_POLICY.md`
              </h2>
              <p style={{ fontSize: '15.5px', color: 'var(--dp-color-secondary)', marginBottom: '14px' }}>
                We believe security claims in AI systems must be backed by architectural constraints rather than polite system prompts. PatchGarden enforces non-negotiable host safety:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ color: 'var(--dp-color-accent)', fontWeight: 900 }}>•</div>
                  <div style={{ fontSize: '14.5px' }}>
                    <strong>No Arbitrary AI Execution:</strong> PatchGarden will never execute `eval(modelOutput)` or arbitrary shell commands. Only fixed commands (`npm test`, `git worktree`) are allowed.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ color: 'var(--dp-color-accent)', fontWeight: 900 }}>•</div>
                  <div style={{ fontSize: '14.5px' }}>
                    <strong>Path Traversal Defense:</strong> Every path derived from model output or git references is checked by `assertPathInWorkspace()`. Any `../` escapes immediately throw fatal security exceptions.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ color: 'var(--dp-color-accent)', fontWeight: 900 }}>•</div>
                  <div style={{ fontSize: '14.5px' }}>
                    <strong>Full Secret Redaction:</strong> GitHub PATs, AWS Access Keys, Bearer tokens, and OpenAI keys are sanitized before model input, audit recording, and UI rendering.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                border: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
                background: 'var(--surface-secondary)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dp-color-accent)', marginBottom: '8px' }}>
                  EDITORIAL DECLARATION
                </div>
                <blockquote
                  style={{
                    fontFamily: 'var(--dp-typography-reading)',
                    fontStyle: 'italic',
                    fontSize: '18px',
                    lineHeight: 1.4,
                    color: 'var(--dp-color-ink)',
                    marginBottom: '14px',
                  }}
                >
                  "A child process is not a sandbox. We do not claim kernel-level isolation when running Node tests on the host. Instead, we guarantee rigorous path guards, ephemeral worktrees, zero network egress in test execution, and permanent evidence preservation."
                </blockquote>
              </div>
              <div className="newsprint-byline" style={{ borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)', paddingTop: '8px' }}>
                FROM AGENT/SAFETY_POLICY.MD § 2 — ARCHITECTURAL THREAT MODEL
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION: FREQUENTLY ANSWERED ENQUIRIES (DISCLOSURES) ────────────────── */}
        <section id="enquiries" style={{ marginBottom: '48px', borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '2px solid var(--dp-color-ink)', paddingBottom: '6px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              Frequently Answered Enquiries
            </h2>
            <span className="newsprint-byline">PUBLIC ARCHIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <details className="newsprint-disclosure" open>
              <summary>
                <span>Does PatchGarden require a cloud API key or subscription?</span>
                <span style={{ fontSize: '18px', color: 'var(--dp-color-accent)' }}>+</span>
              </summary>
              <div className="disclosure-content">
                No. PatchGarden is 100% open-source and operates with local open weights (Google Gemma 3 via Docker Ollama). You can run the complete stack on your own workstation with zero cloud subscriptions or API fees.
              </div>
            </details>

            <details className="newsprint-disclosure">
              <summary>
                <span>How does Temporal ensure workflow durability during repair?</span>
                <span style={{ fontSize: '18px', color: 'var(--dp-color-accent)' }}>+</span>
              </summary>
              <div className="disclosure-content">
                Temporal records every activity event into an event history. If your laptop loses power, docker restarts, or a worker fails, Temporal replays the deterministic workflow code and resumes execution exactly where it stopped, preserving checkpoints without duplicated work.
              </div>
            </details>

            <details className="newsprint-disclosure">
              <summary>
                <span>Can PatchGarden push patches or merge pull requests automatically?</span>
                <span style={{ fontSize: '18px', color: 'var(--dp-color-accent)' }}>+</span>
              </summary>
              <div className="disclosure-content">
                Never. Automated merging is strictly forbidden by `AGENTS.md` § 5. PatchGarden produces verified candidates, demonstrates passing tests, and submits them to the maintainer gate for explicit human decision.
              </div>
            </details>

            <details className="newsprint-disclosure">
              <summary>
                <span>How do I test PatchGarden against a reproducible failure right now?</span>
                <span style={{ fontSize: '18px', color: 'var(--dp-color-accent)' }}>+</span>
              </summary>
              <div className="disclosure-content">
                The repository includes `fixtures/broken-calc` with an intentional unhandled division-by-zero bug. Simply open the Operations Dashboard, click "Start Verification", and observe the full 5-stage Slow and Steady workflow in real time.
              </div>
            </details>
          </div>
        </section>

        {/* ── SECTION: CLOSING INVITATION ─────────────────────────────────────────── */}
        <section
          style={{
            border: 'var(--dp-border-section) solid var(--dp-color-ink)',
            padding: '28px',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'var(--surface-secondary)',
          }}
        >
          <span className="newsprint-badge-red" style={{ marginBottom: '8px' }}>
            READY FOR INSPECTION
          </span>
          <h2 style={{ fontSize: '32px', margin: '8px 0 10px 0' }}>
            Experience Verified AI Maintenance
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto 20px auto', fontSize: '16px', color: 'var(--dp-color-secondary)' }}>
            Inspect reproducible failures, evaluate verified candidates with complete diff radius metrics, and experience how open-source maintenance should be handled.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <Link
              href="/dashboard"
              className="newsprint-button-primary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              Enter Operations Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── SECTION: FOOTER & DIRECTORY ────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            fontFamily: 'var(--dp-typography-display)',
            color: 'var(--dp-color-secondary)',
          }}
        >
          <div>
            <strong>PATCHGARDEN DISPATCH</strong> • MIT LICENSE © 2026 NAVNEET SINHA
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://github.com/Neet2516/PatchGarden" target="_blank" rel="noreferrer" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none' }}>
              GITHUB REPO
            </a>
            <a href="https://github.com/Neet2516/PatchGarden/blob/main/agent/SAFETY_POLICY.md" target="_blank" rel="noreferrer" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none' }}>
              SAFETY POLICY
            </a>
            <a href="https://github.com/Neet2516/PatchGarden/blob/main/docs/WORKFLOW_GUIDE.md" target="_blank" rel="noreferrer" style={{ color: 'var(--dp-color-ink)', textDecoration: 'none' }}>
              OPERATIONS GUIDE
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}
