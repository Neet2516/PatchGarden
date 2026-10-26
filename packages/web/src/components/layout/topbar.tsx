'use client';

import React from 'react';
import {
  FolderGit2,
  Cpu,
  Workflow,
  Github,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';

interface TopbarProps {
  repoPath: string;
  onMobileMenuToggle?: () => void;
}

export function Topbar({ repoPath, onMobileMenuToggle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        height: '66px',
        padding: '0 24px',
        background: 'var(--surface-main)',
        borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left side: Workspace & Branch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            id="btn-mobile-menu"
            aria-label="Toggle Navigation Drawer"
            className="clay-button"
            style={{
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Menu size={18} />
          </button>
        )}

        <div
          className="clay-surface"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
          }}
        >
          <FolderGit2 size={16} style={{ color: 'var(--accent-violet)' }} />
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
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>main</span>
          <span>•</span>
          <span>Slow & Steady Gate Active</span>
        </div>
      </div>

      {/* Right side: AI Status Badges, Theme Switcher & GitHub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Gemma 3 Status Badge */}
        <div
          className="clay-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(103, 232, 249, 0.3)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 8px var(--accent-cyan)',
            }}
            className="status-pulse"
          />
          <Cpu size={14} />
          <span style={{ fontWeight: '600' }}>Gemma 3:4b</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Local</span>
        </div>

        {/* Temporal Durable Workflow Badge */}
        <div
          className="clay-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-purple)',
          }}
        >
          <Workflow size={14} />
          <span style={{ fontWeight: '600' }}>Temporal</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Durable</span>
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          id="btn-theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="clay-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} style={{ color: '#FCD34D' }} />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={15} style={{ color: 'var(--accent-primary)' }} />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/Neet2516/PatchGarden"
          target="_blank"
          rel="noreferrer"
          id="topbar-github-link"
          className="clay-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          <Github size={15} />
          <span>GitHub</span>
        </a>

      </div>
    </header>
  );
}
