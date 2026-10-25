'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { WorkflowStepper } from '@/components/workflow/workflow-stepper';
import { StatCard } from '@/components/dashboard/stat-card';
import { PatchReviewLayout } from '@/components/review/patch-review-layout';
import { MaintainerGate } from '@/components/review/maintainer-gate';
import { RuntimeInfoCard } from '@/components/integrations/runtime-info-card';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  GitCommit,
  Check,
  X,
} from 'lucide-react';

export default function DashboardPage() {
  const [jobState, setJobState] = useState({
    id: 'job_slow_steady_01',
    repoPath: 'fixtures/broken-calc',
    testCommand: 'npm test',
    stage: 'AWAITING_PROPOSAL',
    status: 'IN_PROGRESS',
    approvalState: 'PROPOSAL_REQUIRED',
    duration: '3m 48s',
    failingCount: 1,
    passingCount: 4,
    proposal: {
      explanation: 'Integer division by zero in calculateDivision was not checked before modulo arithmetic. Added guard to throw RangeError with descriptive exception message.',
      riskLevel: 'LOW',
      filesModified: ['src/calculator.js'],
      patchContent: `--- a/src/calculator.js
+++ b/src/calculator.js
@@ -14,4 +14,8 @@ export function divide(a, b) {
+  // Guard: slow and steady verified check
+  if (b === 0) {
+    throw new RangeError('Division by zero is undefined');
+  }
   return a / b;
 }`,
    },
    testOutput: `> broken-calc@1.0.0 test
> node --test test/calculator.test.js

✔ add: adds two positive numbers (1.1ms)
✔ subtract: subtracts two numbers (0.1ms)
✔ multiply: multiplies two numbers (0.7ms)
✔ divide: correctly divides two numbers (0.1ms)
✖ divide: throws RangeError on division by zero (1.5ms)
  AssertionError [ERR_ASSERTION]: Missing expected exception RangeError

ℹ tests 5 | pass 4 | fail 1
ℹ duration_ms 88.4ms

[SLOW & STEADY] Baseline failure successfully captured. Codebase untouched.`,
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Maintainer Action Handlers
  const handleApproveProposal = () => {
    setIsProcessing(true);
    setNotification('⚡ Maintainer approved proposal. Temporal worker provisioning isolated worktree...');

    // Simulate worktree execution
    setTimeout(() => {
      setJobState(prev => ({
        ...prev,
        stage: 'APPLYING_PATCH',
      }));

      setTimeout(() => {
        setJobState(prev => ({
          ...prev,
          stage: 'VERIFYING',
        }));

        setTimeout(() => {
          setIsProcessing(false);
          setJobState(prev => ({
            ...prev,
            stage: 'AWAITING_FINAL',
            approvalState: 'FINAL_REQUIRED',
            passingCount: 5,
            failingCount: 0,
            testOutput: `> broken-calc@1.0.0 test (worktree_job_slow_steady_01)
> node --test test/calculator.test.js

✔ add: adds two positive numbers (0.9ms)
✔ subtract: subtracts two numbers (0.1ms)
✔ multiply: multiplies two numbers (0.6ms)
✔ divide: correctly divides two numbers (0.1ms)
✔ divide: throws RangeError on division by zero (0.4ms)

ℹ tests 5 | pass 5 | fail 0
ℹ duration_ms 64.2ms

🎉 Isolated verification succeeded! Zero regressions detected.
Temporal checkpoint created. Awaiting maintainer final sign-off.`,
          }));
          setNotification('🎉 Isolated worktree tests passed with 0 regressions! Awaiting final sign-off.');
        }, 1800);
      }, 1200);
    }, 1000);
  };

  const handleRejectProposal = () => {
    setJobState(prev => ({
      ...prev,
      stage: 'COMPLETE',
      status: 'CANCELLED',
      approvalState: 'PROPOSAL_REJECTED',
    }));
    setNotification('❌ Proposal rejected by maintainer. Isolated worktree dismantled.');
  };

  const handleApproveFinal = () => {
    setJobState(prev => ({
      ...prev,
      stage: 'COMPLETE',
      status: 'COMPLETED',
      approvalState: 'FINAL_APPROVED',
    }));
    setNotification('🏆 Candidate sealed into cryptographic evidence ledger!');
  };

  return (
    <AppShell repoPath={jobState.repoPath}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Toast Notification Banner */}
        {notification && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              color: 'var(--neon-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 0 16px rgba(34, 211, 238, 0.15)',
            }}
          >
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--bright-purple)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Maintenance Workflow
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
              <code style={{ fontSize: '11px', color: 'var(--neon-cyan)' }}>{jobState.id}</code>
            </div>
            <h1 style={{ margin: 0 }}>
              Investigate & Verify <span style={{ color: 'var(--bright-purple)' }}>{jobState.repoPath}</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Failure symptom: <code>divide by zero returns Infinity instead of RangeError</code>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                background: jobState.failingCount > 0 ? 'rgba(251, 191, 36, 0.12)' : 'rgba(52, 211, 153, 0.12)',
                border: `1px solid ${jobState.failingCount > 0 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
                color: jobState.failingCount > 0 ? 'var(--warning)' : 'var(--success)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: jobState.failingCount > 0 ? 'var(--warning)' : 'var(--success)',
                }}
              />
              <span>{jobState.stage === 'COMPLETE' ? 'Maintenance Sealed' : 'Maintainer Action Required'}</span>
            </div>
          </div>
        </div>

        {/* 10-Stage Workflow Stepper */}
        <WorkflowStepper
          currentStageId={jobState.stage}
          isFailed={jobState.status === 'FAILED'}
        />

        {/* 4 Metric Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <StatCard
            label="Failing Tests"
            value={jobState.failingCount}
            subtext="Baseline failure captured"
            icon={AlertCircle}
            accentColor={jobState.failingCount > 0 ? 'var(--error)' : 'var(--success)'}
          />
          <StatCard
            label="Passing Tests"
            value={jobState.passingCount}
            subtext="Regression suite"
            icon={CheckCircle2}
            accentColor="var(--success)"
          />
          <StatCard
            label="Diff Blast Radius"
            value={jobState.proposal.riskLevel}
            subtext="1 file • 4 lines added"
            icon={GitCommit}
            accentColor="var(--neon-cyan)"
            glow={true}
          />
          <StatCard
            label="Verification Time"
            value={jobState.duration}
            subtext="Durable Temporal execution"
            icon={Clock}
            accentColor="var(--bright-purple)"
          />
        </div>

        {/* Two-Column Review Layout: Left is Tabs, Right is Maintainer Gate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Code Diff, Test Terminal, Evidence, Audit */}
          <PatchReviewLayout
            patchContent={jobState.proposal.patchContent}
            patchExplanation={jobState.proposal.explanation}
            filesModified={jobState.proposal.filesModified}
            testOutput={jobState.testOutput}
            testPassed={jobState.passingCount === 5}
          />

          {/* Right Column: Maintainer Gate & Infrastructure Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <MaintainerGate
              stage={jobState.stage}
              onApproveProposal={handleApproveProposal}
              onRejectProposal={handleRejectProposal}
              onApproveFinal={handleApproveFinal}
              isProcessing={isProcessing}
            />

            <RuntimeInfoCard />
          </div>

        </div>

      </div>
    </AppShell>
  );
}
