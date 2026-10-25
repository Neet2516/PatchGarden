'use client';

import React from 'react';
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
} from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)', transition: 'background-color 0.25s ease' }}>
      
      {/* ── LANDING NAVBAR ────────────────────────────────────────────────────────── */}
      <header
        style={{
          height: '70px',
          padding: '0 32px',
          background: 'var(--surface-main)',
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            className="clay-button-primary"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🌱
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              PatchGarden
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              AI-Powered Code Maintenance
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden-mobile">
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
            How It Works
          </a>
          <a href="#safety" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
            Safety & Control
          </a>
          <a href="#capabilities" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
            Capabilities
          </a>
          <a
            href="https://github.com/Neet2516/PatchGarden"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
          >
            Documentation
          </a>
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            id="btn-landing-theme"
            aria-label="Toggle Theme"
            className="clay-button"
            style={{
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#FCD34D' }} /> : <Moon size={15} style={{ color: 'var(--accent-primary)' }} />}
            <span className="hidden-mobile">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Primary Dashboard CTA */}
          <Link
            href="/dashboard"
            id="btn-nav-open-dashboard"
            className="clay-button-primary"
            style={{
              padding: '9px 18px',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Open Dashboard</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 32px 80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Eyebrow Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-secondary)', border: '1px solid var(--border-purple)', width: 'fit-content' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-primary)' }} className="status-pulse" />
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)' }}>
                AI-Powered Code Maintenance
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
              Fix Bugs. Verify Changes.{' '}
              <span style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-violet) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Stay in Control.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '540px' }}>
              PatchGarden investigates failing tests, gathers evidence, and proposes minimal AI-generated fixes. Every change goes through review and verification before it can move forward.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
              <Link
                href="/dashboard"
                id="btn-hero-primary-cta"
                className="clay-button-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Open PatchGarden</span>
                <ArrowRight size={17} />
              </Link>

              <a
                href="#how-it-works"
                id="btn-hero-secondary-cta"
                className="clay-button"
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Supporting Trust Points */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
                <span>Evidence-Driven Patches</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
                <span>Automated Verification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Human Approval Required</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Miniature Dashboard Preview Card */}
          <div style={{ position: 'relative' }}>
            <div
              className="clay-card-raised purple-glow"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {/* Preview Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>fixtures/broken-calc</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--surface-secondary)', color: 'var(--text-muted)' }}>
                    Preview
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  <Cpu size={13} />
                  <span>Gemma 3 4B</span>
                </div>
              </div>

              {/* Compact Workflow Stepper */}
              <div className="clay-card-inset" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {['Queued', 'Inspect', 'Evidence', 'Proposal Review', 'Verify'].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: idx === 3 ? 'var(--accent-primary)' : idx < 3 ? 'var(--status-success)' : 'var(--surface-elevated)',
                        color: idx <= 3 ? '#FFFFFF' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '700',
                      }}
                    >
                      {idx < 3 ? '✓' : idx + 1}
                    </span>
                    <span style={{ fontWeight: idx === 3 ? '700' : '500', color: idx === 3 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mini Metric Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div className="clay-card" style={{ padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--status-error)' }}>1</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Failing Test</div>
                </div>
                <div className="clay-card" style={{ padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--status-success)' }}>4</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Passing</div>
                </div>
                <div className="clay-card" style={{ padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-cyan)' }}>+4 lines</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Patch Size</div>
                </div>
                <div className="clay-card" style={{ padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-primary)' }}>Gate 1</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Status</div>
                </div>
              </div>

              {/* Code Diff Snippet Preview */}
              <div style={{ background: 'var(--diff-bg)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '6px' }}>src/calculator.js</div>
                <div style={{ color: '#C5B8D9' }}> export function divide(a, b) &#123;</div>
                <div style={{ background: 'var(--diff-add-bg)', color: 'var(--diff-add-text)', padding: '1px 6px', margin: '0 -6px' }}>
                  +   if (b === 0) throw new RangeError('Division by zero');
                </div>
                <div style={{ color: '#C5B8D9' }}>   return a / b;</div>
                <div style={{ color: '#C5B8D9' }}> &#125;</div>
              </div>

              {/* Maintainer Gate Status Strip */}
              <div
                className="clay-card-inset"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeft: '3px solid var(--accent-primary)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Human Review Required</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Review proposed patch before verification.</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: 'var(--accent-primary)',
                    fontWeight: '700',
                  }}
                >
                  Paused
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Deliberative Engineering
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            A safer workflow for AI-assisted maintenance.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            From a failing test to a verified patch, every stage has a clear purpose.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
          
          {/* Step 1 */}
          <div className="clay-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clay-card-inset" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={22} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Step 1</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Investigate</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Inspect the failure and reproduce the problem with the existing test suite against an untouched baseline.
            </p>
          </div>

          {/* Step 2 */}
          <div className="clay-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clay-card-inset" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>Step 2</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Gather Evidence</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Collect relevant code and test evidence before proposing a change. Secrets and credentials are automatically redacted.
            </p>
          </div>

          {/* Step 3 */}
          <div className="clay-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clay-card-inset" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitPullRequest size={22} style={{ color: 'var(--accent-violet)' }} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-violet)', textTransform: 'uppercase' }}>Step 3</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Propose a Patch</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Generate a minimal, reviewable patch using local open-weight AI that addresses the identified failure without code bloat.
            </p>
          </div>

          {/* Step 4 */}
          <div className="clay-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clay-card-inset" style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} style={{ color: 'var(--status-success)' }} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--status-success)', textTransform: 'uppercase' }}>Step 4</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Review and Verify</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              A human maintainer approves the proposal before the verification workflow executes in an isolated Git worktree.
            </p>
          </div>

        </div>
      </section>

      {/* ── SAFETY AND HUMAN CONTROL SECTION ──────────────────────────────────────── */}
      <section id="safety" style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 32px' }}>
        <div
          className="clay-card-raised purple-glow"
          style={{
            padding: '48px',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Explanatory Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Safety Architecture
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1.2, margin: 0 }}>
              AI can propose the fix. You stay in control.
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              PatchGarden keeps proposed changes reviewable and makes human approval an explicit part of the maintenance workflow. We believe autonomous code pushes are dangerous for open-source repositories.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />
                <span>Review before execution — maintainer signal required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                <FolderLock size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Verification through isolated temporary Git worktrees</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                <History size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Auditable maintenance events preserved in SQLite ledger</span>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <Link
                href="/dashboard"
                className="clay-button-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                <span>View Maintainer Gate in Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Stylized Maintainer Review Gate Preview */}
          <div className="clay-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Maintainer Gate</span>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-primary)', fontWeight: '700' }}>
                GATE REQUIRED
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The AI never commits, merges, or pushes code autonomously. Temporal workflow execution halts until your approval signal.
            </div>
            <div className="clay-button-primary" style={{ padding: '12px', textAlign: 'center', fontSize: '13px', cursor: 'default' }}>
              ✓ Approve Proposal & Run Verify
            </div>
            <div className="clay-button" style={{ padding: '9px', textAlign: 'center', fontSize: '12px', color: 'var(--status-error)', cursor: 'default' }}>
              ✕ Reject Proposal
            </div>
          </div>

        </div>
      </section>

      {/* ── PRODUCT CAPABILITIES SECTION ─────────────────────────────────────────── */}
      <section id="capabilities" style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            System Highlights
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Engineered for Maintainers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <GitPullRequest size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Minimal Patch Proposals</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                AI-generated changes focused strictly on the identified issue. Zero unnecessary refactorings or hallucinations.
              </p>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <Terminal size={22} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Test-Aware Workflow</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Clear visibility into failing tests, regression results, and verification status in an isolated worktree.
              </p>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <EyeOff size={22} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Evidence Ledger</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Relevant collected evidence presented in a structured interface with automatic secret redaction.
              </p>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <History size={22} style={{ color: 'var(--accent-violet)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Immutable Audit Trail</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                A chronological view of maintenance events backed by SQLite persistence and cryptographic sealing.
              </p>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <Cpu size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Local AI Runtime</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Visibility into local Google Gemma 3 (4B) running on Ollama with 100% on-device data privacy.
              </p>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
            <ShieldCheck size={22} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>Human Approval Gate</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Explicit maintainer sign-off required before any consequential workflow progression.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── FINAL CTA SECTION ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 32px 80px 32px' }}>
        <div
          className="clay-card-raised purple-glow"
          style={{
            padding: '56px 32px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '32px' }}>🌱</div>
          <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Make every code change accountable.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '500px', margin: 0 }}>
            Investigate the failure. Review the proposal. Verify the result.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <Link
              href="/dashboard"
              className="clay-button-primary"
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Open PatchGarden</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#how-it-works"
              style={{
                color: 'var(--accent-primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Explore the workflow →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--border-default)',
          background: 'var(--surface-main)',
          padding: '36px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🌱</span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>PatchGarden</span>
          <span>— Slow and Steady AI Maintenance</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <a
            href="https://github.com/Neet2516/PatchGarden"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            GitHub
          </a>
          <span>MIT License © 2026 Navneet Sinha</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Hacktoberfest 2026</span>
        </div>
      </footer>

    </div>
  );
}
