'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: React.ReactNode;
  repoPath?: string;
  activeNav?: string;
  onNavSelect?: (tab: string) => void;
}

export function AppShell({
  children,
  repoPath = 'fixtures/broken-calc',
  activeNav,
  onNavSelect,
}: AppShellProps) {
  const [internalNav, setInternalNav] = useState('runs');
  const currentNav = activeNav ?? internalNav;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavSelect = (tab: string) => {
    setInternalNav(tab);
    onNavSelect?.(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--dp-color-ground)',
        color: 'var(--dp-color-ink)',
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={currentNav}
        setActiveTab={handleNavSelect}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
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

        {/* Global Newsprint Footer */}
        <footer
          style={{
            padding: '16px 28px',
            borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
            background: 'var(--surface-main)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            fontFamily: 'var(--dp-typography-display)',
            color: 'var(--dp-color-secondary)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong>PATCHGARDEN DISPATCH</strong> — AI Maintenance Engineer That Never Rushes a Patch • MIT License
          </div>
          <div style={{ display: 'flex', gap: '18px', fontWeight: 650 }}>
            <span>TEMPORAL CLOUD / DEV</span>
            <span>GOOGLE GEMMA 3 (LOCAL)</span>
            <span>SENTRY AGENT TRACING</span>
            <span style={{ color: 'var(--dp-color-accent)', fontWeight: 700 }}>HACKTOBERFEST 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
