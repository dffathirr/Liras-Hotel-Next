import type { ReactNode } from 'react';
// import Navbar from '@/components/home/layout/Navbar';
// import Footer from '@/components/home/layout/Footer';

/**
 * HOME LAYOUT — berlaku untuk semua route user: /, /rooms, /booking, dll
 *
 * ┌─────────────────────────────────────────┐
 * │  NAVBAR                                 │  ← logo, menu, tombol "Book Now", login
 * ├─────────────────────────────────────────┤
 * │                                         │
 * │  {children}  ← konten tiap page         │
 * │                                         │
 * ├─────────────────────────────────────────┤
 * │  FOOTER                                 │  ← alamat, links, sosmed, copyright
 * └─────────────────────────────────────────┘
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Navbar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}