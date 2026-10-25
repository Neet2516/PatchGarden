'use client';

import React from 'react';
import { Cpu, Server, Shield, Activity } from 'lucide-react';

export function RuntimeInfoCard() {
  const specs = [
    { label: 'AI Model', value: 'Google Gemma 3 (4B)', sub: 'Open-weights reasoning', icon: Cpu, color: 'var(--neon-cyan)' },
    { label: 'Local Runtime', value: 'Ollama (Docker)', sub: 'Zero-cloud execution', icon: Server, color: 'var(--primary-purple)' },
    { label: 'Isolation', value: '100% On-Device', sub: 'Git worktree sandbox', icon: Shield, color: 'var(--success)' },
    { label: 'Observability', value: 'Sentry Agent Tracing', sub: 'Spans & error tracking', icon: Activity, color: 'var(--info-blue)' },
  ];

  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--card-surface)',
        border: '1px solid var(--default-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI Ops Infrastructure
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--success)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} className="status-pulse" />
          <span>Operational</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {specs.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--elevated-surface)',
                border: '1px solid var(--subtle-border)',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
