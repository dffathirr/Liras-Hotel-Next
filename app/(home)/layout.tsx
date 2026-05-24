import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { ReactNode } from 'react';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="liras-page">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}