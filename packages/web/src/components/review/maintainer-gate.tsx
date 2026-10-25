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
      className="clay-card-raised"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={19} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Maintainer Review Gate
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            background: stage === 'COMPLETE' ? 'var(--status-success-bg)' : 'rgba(139, 92, 246, 0.12)',
            color: stage === 'COMPLETE' ? 'var(--status-success)' : 'var(--accent-primary)',
            border: `1px solid ${stage === 'COMPLETE' ? 'var(--status-success)' : 'var(--border-purple)'}`,
            fontWeight: '700',
            letterSpacing: '0.04em',
          }}
        >
          {stage === 'COMPLETE' ? 'SEALED' : 'GATE REQUIRED'}
        </span>
      </div>

      {/* Philosophy note */}
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        PatchGarden enforces a <strong>Slow and Steady</strong> policy. The AI never commits, merges, or pushes code autonomously. All repair proposals require explicit human maintainer verification.
      </div>

      {/* Stage: Proposal Review */}
      {stage === 'AWAITING_PROPOSAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            className="clay-card-inset"
            style={{
              padding: '14px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>What approval authorizes:</strong>
            <p style={{ margin: '4px 0 0 0', lineHeight: 1.5 }}>
              Provisions an isolated temporary Git worktree and applies the minimal diff to execute the regression test suite. Does not touch the active branch.
            </p>
          </div>

          <button
            id="btn-gate-approve-proposal"
            onClick={onApproveProposal}
            disabled={isProcessing}
            className="clay-button-primary"
            style={{
              padding: '13px 20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isProcessing ? 0.7 : 1,
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
              className="clay-button"
              style={{
                padding: '10px 16px',
                border: '1px solid var(--status-error)',
                background: 'var(--status-error-bg)',
                color: 'var(--status-error)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={15} />
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
                className="clay-button"
                style={{
                  flex: 1,
                  padding: '9px',
                  border: 'none',
                  background: 'var(--status-error)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowConfirmReject(false)}
                className="clay-button"
                style={{
                  padding: '9px 16px',
                  fontSize: '12px',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            className="clay-card-inset"
            style={{
              padding: '14px',
              fontSize: '12px',
              color: 'var(--status-success)',
              fontWeight: '600',
            }}
          >
            ✓ <strong>Verification Succeeded:</strong> 0 regressions detected in candidate worktree.
          </div>

          <button
            id="btn-gate-approve-final"
            onClick={onApproveFinal}
            disabled={isProcessing}
            className="clay-button-primary"
            style={{
              padding: '13px 20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0891b2 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px var(--accent-cyan-glow), var(--clay-inset-button-primary)',
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
          className="clay-card-inset"
          style={{
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌱</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--status-success)' }}>
            Maintenance Complete
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Evidence signed and sealed in SQLite durable store.
          </div>
        </div>
      )}
    </div>
  );
}
