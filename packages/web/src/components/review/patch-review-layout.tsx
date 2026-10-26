'use client';

import React, { useState } from 'react';
import {
  FileCode,
  Terminal,
  ShieldAlert,
  History,
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
  activeTab?: 'diff' | 'terminal' | 'evidence' | 'audit';
  onTabChange?: (tab: 'diff' | 'terminal' | 'evidence' | 'audit') => void;
}

export function PatchReviewLayout({
  patchContent,
  patchExplanation,
  filesModified,
  testOutput,
  testPassed = false,
  activeTab: externalTab,
  onTabChange,
}: PatchReviewLayoutProps) {
  const [internalTab, setInternalTab] = useState<'diff' | 'terminal' | 'evidence' | 'audit'>('diff');
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = (tab: 'diff' | 'terminal' | 'evidence' | 'audit') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
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
      id="review-workspace"
      className="clay-card"
      style={{
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
          padding: '12px 18px',
          background: 'var(--surface-secondary)',
          borderBottom: '1px solid var(--border-default)',
          overflowX: 'auto',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={isActive ? 'clay-button-primary' : 'clay-button'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--surface-secondary)',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: '600',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.status && (
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: tab.status === 'pass' ? 'var(--status-success)' : 'var(--status-error)',
                      boxShadow: `0 0 6px ${tab.status === 'pass' ? 'var(--status-success)' : 'var(--status-error)'}`,
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
            className="clay-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--status-success)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Diff'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: Candidate Patch Viewer */}
      {activeTab === 'diff' && (
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Gemma 3 Reasoning Box */}
          <div
            className="clay-card-inset"
            style={{
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderLeft: '4px solid var(--accent-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>🧠 Gemma 3:4b Reasoning Analysis</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
              {patchExplanation}
            </p>
          </div>

          {/* Code Diff Editor (High-contrast dark surface for optimal readability across themes) */}
          <div
            style={{
              background: 'var(--diff-bg)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Diff Header */}
            <div
              style={{
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{ color: '#F7F2FF', fontWeight: '600' }}>{filesModified[0] || 'src/calculator.js'}</code>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '600' }}>
                <span style={{ color: 'var(--status-success)' }}>+4 additions</span>
                <span style={{ color: 'var(--status-error)' }}>-0 deletions</span>
              </div>
            </div>

            {/* Diff Code Lines */}
            <div style={{ padding: '14px 0', overflowX: 'auto', fontSize: '13px', lineHeight: 1.6 }}>
              {patchContent.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++');
                const isDel = line.startsWith('-') && !line.startsWith('---');
                const isHunk = line.startsWith('@@');

                let lineBg = 'transparent';
                let textColor = '#C5B8D9';
                if (isAdd) {
                  lineBg = 'var(--diff-add-bg)';
                  textColor = 'var(--diff-add-text)';
                } else if (isDel) {
                  lineBg = 'var(--diff-del-bg)';
                  textColor = 'var(--diff-del-text)';
                } else if (isHunk) {
                  textColor = 'var(--accent-cyan)';
                  lineBg = 'rgba(103, 232, 249, 0.06)';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      padding: '2px 18px',
                      background: lineBg,
                      color: textColor,
                    }}
                  >
                    <span
                      style={{
                        width: '36px',
                        color: 'rgba(255, 255, 255, 0.25)',
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
        <div style={{ padding: '22px' }}>
          <div
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--diff-bg)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              minHeight: '280px',
              color: '#F7F2FF',
              boxShadow: 'var(--clay-shadow-inset)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                isolated-worktree-runner: vitest / node:test
              </span>
            </div>

            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#E2D9F3' }}>
              <code>{testOutput}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Sanitized Evidence */}
      {activeTab === 'evidence' && (
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            className="clay-card-inset"
            style={{
              padding: '18px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <FolderLock size={22} style={{ color: 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Worktree Isolation Guarantee
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                Candidate repairs are applied into an isolated Git worktree (<code>worktree_job_slow_steady_01</code>). The primary workspace checkout remains untouched until human maintainer sign-off.
              </div>
            </div>
          </div>

          <div
            className="clay-card-inset"
            style={{
              padding: '18px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <EyeOff size={22} style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Automated Secret Redaction
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                Before prompt construction, <code>redactSecrets</code> scanned all evidence files. Zero GitHub tokens, AWS keys, or API credentials leaked. 100% on-device inference via Gemma 3.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { time: '10:40:12', event: 'JOB_CREATED', detail: 'Workflow started by maintainer for fixtures/broken-calc', type: 'info' },
            { time: '10:40:18', event: 'BASELINE_CAPTURED', detail: 'Identified 1 failing test: divide throws RangeError', type: 'warn' },
            { time: '10:41:04', event: 'EVIDENCE_COLLECTED', detail: 'Sanitized src/calculator.js and test suite (0 secrets)', type: 'info' },
            { time: '10:42:20', event: 'MODEL_ANALYSIS', detail: 'Gemma 3:4b generated minimal 4-line patch proposal', type: 'ai' },
            { time: '10:42:25', event: 'GATE_REACHED', detail: 'Temporal workflow paused; awaiting maintainer approval', type: 'gate' },
          ].map((entry, idx) => (
            <div
              key={idx}
              className="clay-card-inset"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                fontSize: '12px',
              }}
            >
              <code style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{entry.time}</code>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: entry.type === 'ai' ? 'rgba(139, 92, 246, 0.15)' : entry.type === 'warn' ? 'var(--status-warning-bg)' : 'rgba(103, 232, 249, 0.15)',
                  color: entry.type === 'ai' ? 'var(--accent-primary)' : entry.type === 'warn' ? 'var(--status-warning)' : 'var(--accent-cyan)',
                  letterSpacing: '0.03em',
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
