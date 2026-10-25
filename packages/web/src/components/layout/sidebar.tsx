'use client';

import React from 'react';
import {
  LayoutDashboard,
  GitPullRequest,
  FileCode,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'runs', label: 'Maintenance Runs', icon: GitPullRequest, badge: '1 Active' },
    { id: 'patches', label: 'Candidate Patches', icon: FileCode },
    { id: 'evidence', label: 'Evidence Ledger', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '68px' : '250px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--default-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '64px',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--default-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--deep-purple) 0%, var(--primary-purple) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 0 16px var(--purple-glow-color)',
              flexShrink: 0,
            }}
          >
            🌱
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                PatchGarden
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--neon-cyan)' }}>AI Ops</span> • v0.1.0
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            id="btn-collapse-sidebar"
            aria-label="Collapse sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? 'var(--purple-border)' : 'transparent',
                background: isActive ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: 'var(--primary-purple)',
                    boxShadow: '0 0 8px var(--primary-purple)',
                  }}
                />
              )}
              <Icon
                size={18}
                style={{
                  color: isActive ? 'var(--bright-purple)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: 'rgba(34, 211, 238, 0.15)',
                    color: 'var(--neon-cyan)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    fontWeight: '600',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expand Button for Collapsed Mode */}
      {collapsed && (
        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--default-border)' }}>
          <button
            onClick={() => setCollapsed(false)}
            id="btn-expand-sidebar"
            aria-label="Expand sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Footer Banner */}
      {!collapsed && (
        <div style={{ padding: '14px', borderTop: '1px solid var(--default-border)' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--card-surface)',
              border: '1px solid var(--default-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--bright-purple)', fontWeight: '600' }}>
              <Sparkles size={12} />
              <span>Hacktoberfest 2026</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Theme: <strong>Slow & Steady</strong>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
