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
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
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
      style={{
        padding: '20px 24px',
        background: 'var(--card-surface)',
        border: '1px solid var(--default-border)',
        borderRadius: 'var(--radius-md)',
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minWidth: '850px', position: 'relative' }}>
        
        {/* Connecting Line Behind Steps */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '2px',
            background: 'var(--default-border)',
            zIndex: 1,
          }}
        >
          {/* Active Progress Fill */}
          <div
            style={{
              height: '100%',
              width: `${(Math.max(0, currentIndex) / (WORKFLOW_STAGES.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--deep-purple) 0%, var(--primary-purple) 70%, var(--neon-cyan) 100%)',
              boxShadow: '0 0 10px var(--primary-purple)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Steps */}
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = stage.icon;

          let nodeBg = 'var(--elevated-surface)';
          let nodeBorder = 'var(--default-border)';
          let iconColor = 'var(--text-muted)';
          let labelColor = 'var(--text-muted)';

          if (isCurrent) {
            nodeBg = isFailed ? 'rgba(251, 113, 133, 0.15)' : 'rgba(168, 85, 247, 0.15)';
            nodeBorder = isFailed ? 'var(--error)' : 'var(--primary-purple)';
            iconColor = isFailed ? 'var(--error)' : 'var(--bright-purple)';
            labelColor = isFailed ? 'var(--error)' : 'var(--text-primary)';
          } else if (isPassed) {
            nodeBg = 'rgba(52, 211, 153, 0.1)';
            nodeBorder = 'rgba(52, 211, 153, 0.3)';
            iconColor = 'var(--success)';
            labelColor = 'var(--text-secondary)';
          }

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
              {/* Step Circle Node */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: nodeBg,
                  border: `2px solid ${nodeBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isCurrent ? (isFailed ? '0 0 16px rgba(251, 113, 133, 0.3)' : '0 0 20px var(--purple-glow-color)') : 'none',
                }}
                className={isCurrent ? 'active-step-pulse' : ''}
              >
                <Icon size={18} style={{ color: iconColor }} />
              </div>

              {/* Step Label */}
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: isCurrent ? '700' : '500',
                    color: labelColor,
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {stage.label}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: isCurrent ? 'var(--neon-cyan)' : 'var(--text-muted)',
                    marginTop: '2px',
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
