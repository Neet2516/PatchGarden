'use client';

import React from 'react';
import {
  FolderGit2,
  Cpu,
  Workflow,
  Github,
  Bell,
  Search,
  Menu,
} from 'lucide-react';

interface TopbarProps {
  repoPath: string;
  onMobileMenuToggle?: () => void;
}

export function Topbar({ repoPath, onMobileMenuToggle }: TopbarProps) {
  return (
    <header
      style={{
        height: '64px',
        padding: '0 24px',
        background: 'rgba(9, 9, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--default-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left side: Project workspace indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            id="btn-mobile-menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--card-surface)',
            border: '1px solid var(--default-border)',
            fontSize: '13px',
          }}
        >
          <FolderGit2 size={16} style={{ color: 'var(--primary-purple)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Workspace:</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{repoPath}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--subtle-border)',
          }}
        >
          <span style={{ color: 'var(--neon-cyan)', fontWeight: '600' }}>main</span>
          <span>•</span>
          <span>Slow & Steady Gate Active</span>
        </div>
      </div>

      {/* Right side: AI Status Badges & GitHub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Gemma 3 Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(34, 211, 238, 0.08)',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            fontSize: '12px',
            color: 'var(--neon-cyan)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--neon-cyan)',
              boxShadow: '0 0 8px var(--neon-cyan)',
            }}
            className="status-pulse"
          />
          <Cpu size={14} />
          <span style={{ fontWeight: '600' }}>Gemma 3:4b</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Local Ollama</span>
        </div>

        {/* Temporal Durable Engine Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            fontSize: '12px',
            color: 'var(--bright-purple)',
          }}
        >
          <Workflow size={14} />
          <span style={{ fontWeight: '600' }}>Temporal</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Durable</span>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/Neet2516/PatchGarden"
          target="_blank"
          rel="noreferrer"
          id="topbar-github-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--card-surface)',
            border: '1px solid var(--default-border)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.15s ease',
          }}
          className="surface-hover"
        >
          <Github size={15} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
