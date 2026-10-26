'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ElementType;
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
      className={glow ? 'clay-card-raised' : 'clay-card'}
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        {Icon && (
          <div
            className="clay-card-inset"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
            }}
          >
            <Icon size={16} style={{ color: accentColor }} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '26px', fontWeight: '700', color: accentColor, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
