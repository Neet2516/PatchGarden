import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PatchGarden — Neon Noir AI Operations Console',
  description: 'Slow and Steady AI maintenance engineer for open-source repositories with Google Gemma 3 local inference and Temporal durable workflows.',
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
        {children}
      </body>
    </html>
  );
}
