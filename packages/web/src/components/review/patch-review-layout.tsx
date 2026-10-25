'use client';

import React, { useState } from 'react';
import {
  FileCode,
  Terminal,
  ShieldAlert,
  History,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';

interface PatchReviewLayoutProps {
  patchContent: string;
  patchExplanation: string;
  filesModified: string[];
  testOutput: string;
  testPassed?: boolean;
}

export function PatchReviewLayout({
  patchContent,
  patchExplanation,
  filesModified,
  testOutput,
  testPassed = false,
}: PatchReviewLayoutProps) {
  const [activeTab, setActiveTab] = useState<'diff' | 'terminal' | 'evidence' | 'audit'>('diff');
  const [copied, setCopied] = useState(false);

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(patchContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'diff', label: 'Candidate Patch', icon: FileCode, count: `${filesModified.length} file` },
    { id: 'terminal', label: 'Test Runner', icon: Terminal, status: testPassed ? 'pass' : 'fail' },
    { id: 'evidence', label: 'Sanitized Evidence', icon: ShieldAlert, badge: 'Clean' },
    { id: 'audit', label: 'Immutable Audit Log', icon: History, count: '6 events' },
  ];

  return (
    <div
      style={{
        background: 'var(--card-surface)',
        border: '1px solid var(--default-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navigation Tabs Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--default-border)',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--primary-purple)' : 'transparent'}`,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--bright-purple)' : 'var(--text-muted)' }} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.status && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: tab.status === 'pass' ? 'var(--success)' : 'var(--error)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'diff' && (
          <button
            onClick={handleCopyDiff}
            id="btn-copy-diff"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--card-surface)',
              border: '1px solid var(--default-border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {copied ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Diff'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: Candidate Patch Viewer */}
      {activeTab === 'diff' && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Gemma 3 Reasoning Box */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(168, 85, 247, 0.06)',
              border: '1px solid var(--purple-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--bright-purple)', textTransform: 'uppercase' }}>
              <span>🧠 Gemma 3:4b Reasoning Analysis</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              {patchExplanation}
            </p>
          </div>

          {/* Unified Diff Editor Card */}
          <div
            style={{
              background: '#09090F',
              border: '1px solid var(--default-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            {/* Diff Header */}
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--default-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{filesModified[0] || 'src/calculator.js'}</code>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                <span style={{ color: 'var(--success)' }}>+4 additions</span>
                <span style={{ color: 'var(--error)' }}>-0 deletions</span>
              </div>
            </div>

            {/* Diff Code Lines */}
            <div style={{ padding: '12px 0', overflowX: 'auto', fontSize: '13px', lineHeight: 1.6 }}>
              {patchContent.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++');
                const isDel = line.startsWith('-') && !line.startsWith('---');
                const isHunk = line.startsWith('@@');

                let lineBg = 'transparent';
                let textColor = 'var(--text-secondary)';
                if (isAdd) {
                  lineBg = 'var(--diff-add-bg)';
                  textColor = 'var(--diff-add-text)';
                } else if (isDel) {
                  lineBg = 'var(--diff-del-bg)';
                  textColor = 'var(--diff-del-text)';
                } else if (isHunk) {
                  textColor = 'var(--neon-cyan)';
                  lineBg = 'rgba(34, 211, 238, 0.05)';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      padding: '1px 16px',
                      background: lineBg,
                      color: textColor,
                    }}
                  >
                    <span
                      style={{
                        width: '32px',
                        color: 'var(--text-muted)',
                        userSelect: 'none',
                        fontSize: '11px',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre', overflowX: 'visible' }}>
                      <code>{line}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Terminal Test Runner Output */}
      {activeTab === 'terminal' && (
        <div style={{ padding: '20px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: '#07070B',
              border: '1px solid var(--default-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.5,
              minHeight: '280px',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                isolated-worktree-runner: vitest / node:test
              </span>
            </div>

            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              <code>{testOutput}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Sanitized Evidence */}
      {activeTab === 'evidence' && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--elevated-surface)',
              border: '1px solid var(--default-border)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <FolderLock size={20} style={{ color: 'var(--neon-cyan)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Worktree Isolation Guarantee
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                All patches are applied into an isolated Git worktree (<code>worktree_job_slow_steady_demo</code>). The primary workspace checkout remains completely untouched until final maintainer sign-off.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--elevated-surface)',
              border: '1px solid var(--default-border)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <EyeOff size={20} style={{ color: 'var(--primary-purple)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Automated Secret Redaction
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Before model prompt dispatch, <code>redactSecrets</code> scanned all evidence files. Zero GitHub tokens, AWS keys, or API credentials leaked. 100% on-device inference via Gemma 3.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { time: '10:40:12', event: 'JOB_CREATED', detail: 'Workflow started by maintainer for fixtures/broken-calc', type: 'info' },
            { time: '10:40:18', event: 'BASELINE_CAPTURED', detail: 'Identified 1 failing test: divide throws RangeError', type: 'warn' },
            { time: '10:41:04', event: 'EVIDENCE_COLLECTED', detail: 'Sanitized src/calculator.js and test suite (0 secrets)', type: 'info' },
            { time: '10:42:20', event: 'MODEL_ANALYSIS', detail: 'Gemma 3:4b generated minimal 4-line patch proposal', type: 'ai' },
            { time: '10:42:25', event: 'GATE_REACHED', detail: 'Temporal workflow paused; awaiting maintainer approval', type: 'gate' },
          ].map((entry, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--elevated-surface)',
                border: '1px solid var(--subtle-border)',
                fontSize: '12px',
              }}
            >
              <code style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{entry.time}</code>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: entry.type === 'ai' ? 'rgba(168, 85, 247, 0.15)' : entry.type === 'warn' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(34, 211, 238, 0.15)',
                  color: entry.type === 'ai' ? 'var(--bright-purple)' : entry.type === 'warn' ? 'var(--warning)' : 'var(--neon-cyan)',
                  letterSpacing: '0.02em',
                }}
              >
                {entry.event}
              </span>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{entry.detail}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
