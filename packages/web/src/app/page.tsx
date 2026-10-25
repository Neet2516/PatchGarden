'use client';

import React, { useState, useEffect } from 'react';

// Stages in order
const STAGES = [
  { id: 'PENDING', label: 'Queued' },
  { id: 'INSPECTING', label: 'Inspect' },
  { id: 'BASELINE_FAILED', label: 'Reproduce' },
  { id: 'COLLECTING_EVIDENCE', label: 'Evidence' },
  { id: 'ANALYZING', label: 'Gemma 3' },
  { id: 'AWAITING_PROPOSAL', label: 'Proposal Review' },
  { id: 'APPLYING_PATCH', label: 'Worktree' },
  { id: 'VERIFYING', label: 'Verify' },
  { id: 'AWAITING_FINAL', label: 'Final Gate' },
  { id: 'COMPLETE', label: 'Sealed' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'diff' | 'tests' | 'evidence' | 'audit'>('diff');
  const [jobState, setJobState] = useState({
    id: 'job_slow_steady_demo',
    repoPath: 'fixtures/broken-calc',
    testCommand: 'npm test',
    stage: 'AWAITING_PROPOSAL',
    status: 'IN_PROGRESS',
    approvalState: 'PROPOSAL_REQUIRED',
    duration: '4m 12s',
    failingCount: 1,
    passingCount: 4,
    proposal: {
      explanation: 'Integer division by zero in calculateDivision was not checked before modulo arithmetic. Guard added to return ErrorResult instead of throwing unhandled uncaught exception.',
      riskLevel: 'LOW',
      filesModified: ['src/calculator.ts'],
      patchContent: `--- a/src/calculator.ts
+++ b/src/calculator.ts
@@ -14,6 +14,10 @@ export function calculateDivision(a: number, b: number): number {
+  if (b === 0) {
+    throw new RangeError('Division by zero is undefined');
+  }
   return a / b;
 }`,
    },
    testOutput: `> broken-calc@1.0.0 test
> vitest run

FAIL src/calculator.test.ts > divide > throws RangeError on divide by zero
AssertionError: expected [Function] to throw RangeError but it returned Infinity
  ❯ src/calculator.test.ts:28:18
  ❯ runTest node_modules/vitest/dist/chunk-runtime-chain.js:144:26

Test Files  1 failed (1)
     Tests  1 failed | 4 passed (5)
  Duration  812ms`,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (action: string) => {
    if (action === 'approve_proposal') {
      setJobState(prev => ({
        ...prev,
        stage: 'APPLYING_PATCH',
        approvalState: 'PROPOSAL_APPROVED',
      }));
      setNotification('✅ Proposal approved! Temporal worker is applying patch to isolated worktree...');
      setTimeout(() => {
        setJobState(prev => ({
          ...prev,
          stage: 'VERIFYING',
        }));
        setTimeout(() => {
          setJobState(prev => ({
            ...prev,
            stage: 'AWAITING_FINAL',
            approvalState: 'FINAL_REQUIRED',
            passingCount: 5,
            failingCount: 0,
            testOutput: `> broken-calc@1.0.0 test
> vitest run

PASS src/calculator.test.ts > divide > correctly divides two numbers
PASS src/calculator.test.ts > divide > throws RangeError on divide by zero
PASS src/calculator.test.ts > add > computes sum
PASS src/calculator.test.ts > subtract > computes difference
PASS src/calculator.test.ts > multiply > computes product

Test Files  1 passed (1)
     Tests  5 passed (5)
  Duration  745ms

🎉 Verified! 0 regressions detected in candidate worktree.`,
          }));
          setNotification('🎉 Tests verified in isolated worktree! Awaiting your final sign-off.');
        }, 2000);
      }, 1500);
    } else if (action === 'approve_final') {
      setJobState(prev => ({
        ...prev,
        stage: 'COMPLETE',
        status: 'COMPLETED',
        approvalState: 'FINAL_APPROVED',
      }));
      setNotification('🏆 Patch approved and sealed into evidence ledger!');
    } else if (action === 'reject') {
      setJobState(prev => ({
        ...prev,
        stage: 'COMPLETE',
        status: 'CANCELLED',
        approvalState: 'PROPOSAL_REJECTED',
      }));
      setNotification('❌ Patch proposal rejected. Workspace worktree cleaned up.');
    }
  };

  const getStageIndex = (stageId: string) => STAGES.findIndex(s => s.id === stageId);
  const currentStageIndex = getStageIndex(jobState.stage);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          padding: '12px 20px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--accent-green)',
          borderRadius: '8px',
          color: 'var(--accent-green)',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Top Banner / Active Job Summary */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Maintenance Job
              </span>
              <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                ID: {jobState.id}
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 6px 0' }}>
              Reproducing Failure in <code style={{ color: 'var(--accent-teal)' }}>{jobState.repoPath}</code>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Test Command: <code style={{ color: 'var(--accent-purple)' }}>{jobState.testCommand}</code> • Elapsed: <strong>{jobState.duration}</strong>
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '12px 20px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: jobState.failingCount > 0 ? 'var(--accent-rose)' : 'var(--accent-green)' }}>
                {jobState.failingCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failing Tests</div>
            </div>
            <div style={{ padding: '12px 20px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-green)' }}>
                {jobState.passingCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passing Tests</div>
            </div>
            <div style={{ padding: '12px 20px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-blue)' }}>
                {jobState.proposal.riskLevel}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diff Risk</div>
            </div>
          </div>
        </div>

        {/* Visual State Machine Progress Bar */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {STAGES.map((s, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--accent-green)' : isPassed ? 'var(--accent-emerald)' : 'var(--bg-tertiary)',
                    border: isCurrent ? '3px solid var(--accent-green-glow)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: isCurrent || isPassed ? '#0a0e14' : 'var(--text-muted)',
                    boxShadow: isCurrent ? '0 0 16px var(--accent-green-glow)' : 'none',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                  }}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    marginTop: '8px',
                    textAlign: 'center',
                    fontWeight: isCurrent ? '600' : '400',
                    color: isCurrent ? 'var(--accent-green)' : isPassed ? 'var(--text-secondary)' : 'var(--text-muted)',
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Human Gate Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Left Column: Tabbed Inspector */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            {[
              { id: 'diff', label: 'Candidate Patch' },
              { id: 'tests', label: 'Test Runner Output' },
              { id: 'evidence', label: 'Sanitized Evidence' },
              { id: 'audit', label: 'Immutable Audit Log' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Diff View */}
          {activeTab === 'diff' && (
            <div>
              <div style={{ marginBottom: '16px', padding: '14px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Gemma 3:4b Reasoning Summary
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
                  {jobState.proposal.explanation}
                </p>
              </div>

              <div style={{
                borderRadius: '8px',
                background: '#0d1117',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                fontSize: '13px',
              }}>
                <div style={{
                  padding: '8px 14px',
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span>src/calculator.ts</span>
                  <span style={{ color: 'var(--accent-green)' }}>+4 lines / -0 lines</span>
                </div>
                <pre style={{ padding: '16px', overflowX: 'auto', margin: 0 }}>
                  <code>
                    {jobState.proposal.patchContent.split('\n').map((line, i) => {
                      const isAdd = line.startsWith('+') && !line.startsWith('+++');
                      const isDel = line.startsWith('-') && !line.startsWith('---');
                      return (
                        <div
                          key={i}
                          style={{
                            backgroundColor: isAdd ? 'var(--diff-add-bg)' : isDel ? 'var(--diff-del-bg)' : 'transparent',
                            color: isAdd ? 'var(--diff-add-text)' : isDel ? 'var(--diff-del-text)' : 'inherit',
                            padding: '2px 8px',
                            margin: '0 -16px',
                          }}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* Tab 2: Test Console */}
          {activeTab === 'tests' && (
            <div style={{
              borderRadius: '8px',
              background: '#070a0e',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              fontSize: '13px',
            }}>
              <pre style={{ margin: 0, color: 'var(--text-secondary)' }}>
                <code>{jobState.testOutput}</code>
              </pre>
            </div>
          )}

          {/* Tab 3: Evidence Drawer */}
          {activeTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>📁 Worktree Isolation</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Worktree created at <code>/workspaces/pg_worktree_{jobState.id}</code>. Untouched root repository protected.
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>🔒 Secret Redaction Audit</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Scanned 14 files before model ingestion. 0 secrets leaked, 2 environment variables redacted.
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>🛡️ Path Guard Policy</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  All git apply operations verified strictly inside target workspace boundaries.
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Audit Log */}
          {activeTab === 'audit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '10:40:12', event: 'JOB_CREATED', detail: 'Workflow started by maintainer for fixtures/broken-calc' },
                { time: '10:40:18', event: 'BASELINE_CAPTURED', detail: 'Identified 1 failing test: divide throws RangeError' },
                { time: '10:41:04', event: 'EVIDENCE_COLLECTED', detail: 'Gathered src/calculator.ts and test file (redacted)' },
                { time: '10:42:20', event: 'MODEL_ANALYSIS', detail: 'Gemma 3:4b generated minimal 4-line patch proposal' },
                { time: '10:42:25', event: 'GATE_REACHED', detail: 'Awaiting maintainer approval before touching worktree' },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <code style={{ color: 'var(--text-muted)' }}>{log.time}</code>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{log.event}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{log.detail}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Maintainer Approval Gates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Maintainer Gate
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              PatchGarden never rushes. An AI proposal must be explicitly verified and approved by a human maintainer.
            </p>

            {jobState.stage === 'AWAITING_PROPOSAL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  id="btn-approve-proposal"
                  onClick={() => handleAction('approve_proposal')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px var(--accent-green-glow)',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  ✓ Approve Proposal & Run Verify
                </button>
                <button
                  id="btn-reject-proposal"
                  onClick={() => handleAction('reject')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    background: 'rgba(244, 63, 94, 0.1)',
                    color: 'var(--accent-rose)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ✕ Reject Proposal
                </button>
              </div>
            )}

            {jobState.stage === 'AWAITING_FINAL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: 'var(--accent-green)', fontSize: '12px' }}>
                  ✓ 100% tests passing in isolated worktree. No regressions found.
                </div>
                <button
                  id="btn-approve-final"
                  onClick={() => handleAction('approve_final')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  🎉 Sign Off & Merge Candidate
                </button>
              </div>
            )}

            {jobState.stage === 'COMPLETE' && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--accent-green)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Maintenance Complete</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Evidence ledger preserved.</div>
              </div>
            )}
          </div>

          {/* Model Status Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              LOCAL AI ENGINE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Model</span>
                <span style={{ fontWeight: '600' }}>Google Gemma 3 (4B)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Runtime</span>
                <span>Ollama Docker (Local)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Isolation</span>
                <span style={{ color: 'var(--accent-green)' }}>100% On-Device</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Workflow Engine</span>
                <span style={{ color: 'var(--accent-blue)' }}>Temporal Server</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
