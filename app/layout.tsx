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
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
        />
        <link rel="stylesheet" href="/assets/libs/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/styles.min.css" />
        <link rel="stylesheet" href="/assets/css/userstyles.css" />
        <link rel="stylesheet" href="/assets/css/mystyles.css" />
        <link rel="stylesheet" href="/assets/icon-fonts/fontawesome-free/css/all.min.css" />
      </head>
      <body>
        {children}
        {/* <Script src="" strategy="beforeInteractive" /> */}
      </body>
    </html>
  );
}
