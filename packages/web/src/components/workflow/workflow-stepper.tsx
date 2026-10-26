'use client';

import React from 'react';
import {
  Clock,
  Search,
  AlertTriangle,
  FileText,
  Cpu,
  ShieldAlert,
  GitBranch,
  CheckCircle2,
  UserCheck,
  Lock,
} from 'lucide-react';

export interface WorkflowStageInfo {
  id: string;
  label: string;
  shortDesc: string;
  icon: React.ElementType;
}

export const WORKFLOW_STAGES: WorkflowStageInfo[] = [
  { id: 'PENDING', label: 'Queued', shortDesc: 'Job registered in Temporal', icon: Clock },
  { id: 'INSPECTING', label: 'Inspect', shortDesc: 'Validating git repo safety', icon: Search },
  { id: 'BASELINE_FAILED', label: 'Reproduce', shortDesc: 'Baseline test failure captured', icon: AlertTriangle },
  { id: 'COLLECTING_EVIDENCE', label: 'Evidence', shortDesc: 'Redacting sensitive context', icon: FileText },
  { id: 'ANALYZING', label: 'Gemma 3', shortDesc: 'Local open-weight reasoning', icon: Cpu },
  { id: 'AWAITING_PROPOSAL', label: 'Proposal Review', shortDesc: 'Maintainer approval required', icon: ShieldAlert },
  { id: 'APPLYING_PATCH', label: 'Worktree', shortDesc: 'Isolated temporary worktree', icon: GitBranch },
  { id: 'VERIFYING', label: 'Verify', shortDesc: 'Executing regression suite', icon: CheckCircle2 },
  { id: 'AWAITING_FINAL', label: 'Final Gate', shortDesc: 'Maintainer final sign-off', icon: UserCheck },
  { id: 'COMPLETE', label: 'Sealed', shortDesc: 'Cryptographic audit ledger', icon: Lock },
];

interface WorkflowStepperProps {
  currentStageId: string;
  isFailed?: boolean;
}

export function WorkflowStepper({ currentStageId, isFailed = false }: WorkflowStepperProps) {
  const currentIndex = WORKFLOW_STAGES.findIndex(s => s.id === currentStageId);

  return (
    <div
      className="clay-card"
      style={{
        padding: '24px 28px',
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minWidth: '860px', position: 'relative' }}>
        
        {/* Connecting Progress Track */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '32px',
            right: '32px',
            height: '2px',
            background: 'var(--dp-color-rule)',
            zIndex: 1,
          }}
        >
          {/* Active Progress Fill */}
          <div
            style={{
              height: '100%',
              width: `${(Math.max(0, currentIndex) / (WORKFLOW_STAGES.length - 1)) * 100}%`,
              background: 'var(--dp-color-ink)',
            }}
          />
        </div>

        {/* Steps */}
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 2,
                cursor: 'default',
              }}
            >
              {/* Flat Square Newsprint Step Node */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent
                    ? (isFailed ? 'var(--dp-color-accent)' : 'var(--dp-color-ink)')
                    : isPassed
                    ? 'var(--surface-elevated)'
                    : 'var(--surface-secondary)',
                  border: isCurrent
                    ? '2px solid var(--dp-color-ink)'
                    : isPassed
                    ? '1px solid var(--dp-color-ink)'
                    : '1px solid var(--dp-color-rule)',
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isCurrent
                      ? 'var(--dp-color-ground)'
                      : isPassed
                      ? 'var(--dp-color-ink)'
                      : 'var(--dp-color-secondary)',
                  }}
                />
              </div>

              {/* Step Labels */}
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: isCurrent ? '700' : '600',
                    color: isCurrent
                      ? 'var(--text-primary)'
                      : isPassed
                      ? 'var(--text-secondary)'
                      : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {stage.label}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: isCurrent
                      ? 'var(--accent-primary)'
                      : isPassed
                      ? 'var(--status-success)'
                      : 'var(--text-muted)',
                    marginTop: '2px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCurrent ? '● Active' : isPassed ? '✓ Complete' : `Stage ${idx + 1}`}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
