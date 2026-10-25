'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

interface MaintainerGateProps {
  stage: string;
  onApproveProposal: () => void;
  onRejectProposal: () => void;
  onApproveFinal: () => void;
  isProcessing?: boolean;
}

export function MaintainerGate({
  stage,
  onApproveProposal,
  onRejectProposal,
  onApproveFinal,
  isProcessing = false,
}: MaintainerGateProps) {
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  return (
    <div
      style={{
        padding: '22px',
        background: 'var(--card-surface)',
        border: '1px solid var(--purple-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        boxShadow: '0 0 24px rgba(168, 85, 247, 0.08)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--bright-purple)' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Maintainer Review Gate
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: stage === 'COMPLETE' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(168, 85, 247, 0.15)',
            color: stage === 'COMPLETE' ? 'var(--success)' : 'var(--bright-purple)',
            border: `1px solid ${stage === 'COMPLETE' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
            fontWeight: '600',
          }}
        >
          {stage === 'COMPLETE' ? 'SEALED' : 'GATE REQUIRED'}
        </span>
      </div>

      {/* Philosophy note */}
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        PatchGarden enforces a <strong>Slow and Steady</strong> policy. The AI never commits, merges, or pushes code to production autonomously. All changes require explicit maintainer verification.
      </div>

      {/* Stage: Proposal Review */}
      {stage === 'AWAITING_PROPOSAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(168, 85, 247, 0.06)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>What approval authorizes:</strong>
            <p style={{ margin: '4px 0 0 0' }}>
              Creates an isolated temporary Git worktree and applies the minimal diff to run the regression test suite. Does not touch the active branch.
            </p>
          </div>

          <button
            id="btn-gate-approve-proposal"
            onClick={onApproveProposal}
            disabled={isProcessing}
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--deep-purple) 0%, var(--primary-purple) 100%)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '13px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 16px var(--purple-glow-color)',
              opacity: isProcessing ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isProcessing ? <Loader2 size={16} className="status-pulse" /> : <CheckCircle size={16} />}
            <span>Approve Proposal & Run Verify</span>
          </button>

          {!showConfirmReject ? (
            <button
              id="btn-gate-reject-proposal"
              onClick={() => setShowConfirmReject(true)}
              disabled={isProcessing}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(251, 113, 133, 0.25)',
                background: 'rgba(251, 113, 133, 0.06)',
                color: 'var(--error)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={14} />
              <span>Reject Proposal</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                id="btn-confirm-reject"
                onClick={() => {
                  setShowConfirmReject(false);
                  onRejectProposal();
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--error)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowConfirmReject(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--default-border)',
                  background: 'var(--elevated-surface)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage: Verification Passing / Final Gate */}
      {stage === 'AWAITING_FINAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              fontSize: '12px',
              color: 'var(--success)',
            }}
          >
            ✓ <strong>Verification Succeeded:</strong> 0 regressions detected in isolated candidate worktree.
          </div>

          <button
            id="btn-gate-approve-final"
            onClick={onApproveFinal}
            disabled={isProcessing}
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--neon-cyan) 0%, #0ea5e9 100%)',
              color: '#09090F',
              fontWeight: '700',
              fontSize: '13px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 16px var(--cyan-glow-color)',
            }}
          >
            <ShieldCheck size={16} />
            <span>Sign Off & Seal Candidate</span>
          </button>
        </div>
      )}

      {/* Stage: Complete */}
      {stage === 'COMPLETE' && (
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--elevated-surface)',
            border: '1px solid var(--default-border)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>🌱</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success)' }}>
            Maintenance Complete
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Evidence signed and preserved in SQLite durable store.
          </div>
        </div>
      )}
    </div>
  );
}
