import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PatchGarden — AI Maintenance Engineer That Never Rushes a Patch',
  description: 'Slow and steady verified software repairs with Gemma 3, Temporal durable workflows, and human maintainer gates.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <header style={{
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 32px',
            background: 'rgba(10, 14, 20, 0.8)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--accent-green-glow)',
                fontSize: '20px',
              }}>
                🌱
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
                  PatchGarden
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Slow and Steady AI Maintenance • Hacktoberfest 2026
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-green)',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                }} className="pulse-indicator" />
                Gemma 3:4b Connected
              </div>
              <a
                href="https://github.com/Neet2516/patchgarden"
                target="_blank"
                rel="noreferrer"
                id="header-repo-link"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  transition: 'color 0.2s',
                }}
              >
                GitHub
              </a>
            </div>
          </header>

          <main style={{ flex: 1, padding: '32px' }}>
            {children}
          </main>

          <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '20px 32px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>PatchGarden — Verified maintenance over code volume</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Temporal Durable Execution</span>
              <span>Gemma 3 Local AI</span>
              <span>Sentry Traced</span>
              <span>MIT License</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
