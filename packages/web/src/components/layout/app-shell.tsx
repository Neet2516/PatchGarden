'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: React.ReactNode;
  repoPath?: string;
}

export function AppShell({ children, repoPath = 'fixtures/broken-calc' }: AppShellProps) {
  const [activeTab, setActiveTab] = useState('runs');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)', transition: 'background-color 0.25s ease' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          repoPath={repoPath}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main style={{ flex: 1, padding: '28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>

        {/* Global Footer */}
        <footer
          style={{
            padding: '18px 28px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--surface-main)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '12px',
            transition: 'background-color 0.25s ease',
          }}
        >
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>PatchGarden</strong> — AI Maintenance Engineer That Never Rushes a Patch • MIT License
          </div>
          <div style={{ display: 'flex', gap: '18px', fontWeight: '500' }}>
            <span>Temporal Workflows</span>
            <span>Google Gemma 3 (Local)</span>
            <span>Sentry Traced</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Hacktoberfest 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
