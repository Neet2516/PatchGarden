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
        width: collapsed ? '70px' : '256px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease',
        position: 'relative',
        zIndex: 30,
        flexShrink: 0,
        boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '66px',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div
            className="clay-button-primary"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
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
                <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>AI Ops</span> • v0.1.0
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            id="btn-collapse-sidebar"
            aria-label="Collapse sidebar"
            className="clay-button"
            style={{
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-${item.id}`}
              className={isActive ? 'clay-card-raised' : 'clay-button'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: isActive ? 'var(--border-purple)' : 'transparent',
                background: isActive ? 'var(--surface-elevated)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                position: 'relative',
                boxShadow: isActive ? 'var(--clay-shadow-button), var(--clay-inset-highlight)' : 'none',
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
                    background: 'var(--accent-primary)',
                    boxShadow: '0 0 8px var(--accent-primary)',
                  }}
                />
              )}
              <Icon
                size={18}
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
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
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: '700',
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
        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setCollapsed(false)}
            id="btn-expand-sidebar"
            aria-label="Expand sidebar"
            className="clay-button"
            style={{ padding: '8px' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Footer Banner */}
      {!collapsed && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-default)' }}>
          <div
            className="clay-card-inset"
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '700' }}>
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
