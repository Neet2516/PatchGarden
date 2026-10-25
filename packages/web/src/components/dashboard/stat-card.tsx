'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accentColor?: string;
  glow?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  accentColor = 'var(--text-primary)',
  glow = false,
}: StatCardProps) {
  return (
    <div
      style={{
        padding: '18px 20px',
        background: 'var(--card-surface)',
        border: '1px solid var(--default-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: glow ? `0 0 20px ${accentColor}25` : 'none',
      }}
      className="surface-hover"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {Icon && <Icon size={16} style={{ color: accentColor }} />}
      </div>

      <div style={{ fontSize: '24px', fontWeight: '700', color: accentColor, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
