'use client';

import React from 'react';
import { Cpu, Server, Shield, Activity } from 'lucide-react';

export function RuntimeInfoCard() {
  const specs = [
    { label: 'AI Model', value: 'Google Gemma 3 (4B)', sub: 'Open-weights reasoning', icon: Cpu, color: 'var(--accent-cyan)' },
    { label: 'Local Runtime', value: 'Ollama (Docker)', sub: 'Zero-cloud execution', icon: Server, color: 'var(--accent-primary)' },
    { label: 'Isolation', value: '100% On-Device', sub: 'Git worktree sandbox', icon: Shield, color: 'var(--status-success)' },
    { label: 'Observability', value: 'Sentry Agent Tracing', sub: 'Spans & error tracking', icon: Activity, color: 'var(--status-info)' },
  ];

  return (
    <div
      className="clay-card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI Ops Infrastructure
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'var(--status-success)',
            fontWeight: '600',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--status-success-bg)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }} className="status-pulse" />
          <span>Operational</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {specs.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="clay-card-inset"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--surface-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--clay-shadow-button)',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} style={{ color: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
