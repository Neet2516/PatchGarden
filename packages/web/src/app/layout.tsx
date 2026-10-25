import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'PatchGarden — Purple Claymorphism AI DevOps Dashboard',
  description: 'Slow and Steady AI maintenance engineer for open-source software with Google Gemma 3 local reasoning, Temporal durable workflows, and human maintainer gates.',
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
