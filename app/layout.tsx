import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Delta — Catch up on what changed',
  description: 'An explainable, checkpoint-aware market attention inbox.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
