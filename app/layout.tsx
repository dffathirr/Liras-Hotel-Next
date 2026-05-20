import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Liras Hotel',
  description: 'Liras Hotel',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        {/* <Script src="" strategy="beforeInteractive" /> */}
      </body>
    </html>
  );
}
