'use client';

import React from 'react';
import Link from 'next/link';
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
  X,
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Broadsheet Overview', icon: LayoutDashboard, href: '/' },
    { id: 'runs', label: 'Maintenance Runs', icon: GitPullRequest, badge: 'Active' },
    { id: 'patches', label: 'Candidate Patches', icon: FileCode },
    { id: 'evidence', label: 'Evidence Ledger', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 90,
          }}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: collapsed ? '68px' : '260px',
          background: 'var(--bg-sidebar)',
          borderRight: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
          display: 'flex',
          flexDirection: 'column',
          position: mobileOpen ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          bottom: mobileOpen ? 0 : 'auto',
          height: mobileOpen ? '100vh' : 'auto',
          minHeight: '100vh',
          zIndex: mobileOpen ? 100 : 30,
          flexShrink: 0,
          fontFamily: 'var(--dp-typography-display)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '66px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflow: 'hidden',
              color: 'var(--dp-color-ink)',
            }}
          >
            <div
              className="newsprint-button-primary"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '17px',
                flexShrink: 0,
                padding: 0,
              }}
            >
              🌱
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  PatchGarden
                </div>
                <div style={{ fontSize: '10px', color: 'var(--dp-color-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--dp-color-accent)', fontWeight: 700 }}>● DISPATCH</span> • v0.1.0
                </div>
              </div>
            )}
          </Link>

          {/* Close button for Mobile / Collapse button for Desktop */}
          {mobileOpen ? (
            <button
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className="newsprint-button"
              style={{ padding: '6px', border: 'none' }}
            >
              <X size={18} />
            </button>
          ) : !collapsed ? (
            <button
              onClick={() => setCollapsed(true)}
              id="btn-collapse-sidebar"
              aria-label="Collapse sidebar"
              className="newsprint-button"
              style={{ padding: '6px', border: 'none' }}
            >
              <ChevronLeft size={16} />
            </button>
          ) : null}
        </div>

        {/* Navigation List */}
        <nav
          aria-label="Sidebar Sections"
          style={{
            flex: 1,
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            const buttonContent = (
              <>
                <Icon
                  size={17}
                  style={{
                    color: isActive ? 'var(--dp-color-ground)' : 'var(--dp-color-ink)',
                    flexShrink: 0,
                  }}
                />
                {!collapsed && (
                  <span
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className="newsprint-badge-red"
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 6px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            );

            const commonStyles: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: collapsed ? '10px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 0,
              border: 'none',
              borderLeft: isActive ? '4px solid var(--dp-color-accent)' : '4px solid transparent',
              background: isActive ? 'var(--dp-color-ink)' : 'transparent',
              color: isActive ? 'var(--dp-color-ground)' : 'var(--dp-color-ink)',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--dp-typography-display)',
              boxShadow: 'none',
              transition: 'none',
            };

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  id={`nav-${item.id}`}
                  style={commonStyles}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile?.();
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  {buttonContent}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                id={`nav-${item.id}`}
                style={commonStyles}
                title={collapsed ? item.label : undefined}
              >
                {buttonContent}
              </button>
            );
          })}
        </nav>

        {/* Expand Button for Collapsed Mode */}
        {collapsed && (
          <div
            style={{
              padding: '12px',
              display: 'flex',
              justifyContent: 'center',
              borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
            }}
          >
            <button
              onClick={() => setCollapsed(false)}
              id="btn-expand-sidebar"
              aria-label="Expand sidebar"
              className="newsprint-button"
              style={{ padding: '8px' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Footer Editorial Colophon */}
        {!collapsed && (
          <div
            style={{
              padding: '14px 16px',
              borderTop: 'var(--dp-border-hairline) solid var(--dp-color-rule)',
              fontSize: '11px',
              color: 'var(--dp-color-secondary)',
              lineHeight: 1.4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--dp-color-accent)', textTransform: 'uppercase', marginBottom: '2px' }}>
              <Sparkles size={11} />
              <span>Slow and Steady</span>
            </div>
            <div>Hacktoberfest 2026 AI Challenge</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>MIT License © Navneet Sinha</div>
          </div>
        )}
      </aside>
    </>
  );
}
