'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'fa-chart-bar', label: 'Dashboard' },
  { href: '/admin/booking',   icon: 'fa-calendar-check', label: 'Booking' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Halaman login tidak pakai sidebar
  if (pathname === '/admin/login') return <>{children}</>;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="app-container">

      {/* ── SIDEBAR ── */}
      <aside className="app-sidebar sticky" id="sidebar">
        <div className="main-sidebar-header d-flex align-items-center px-3 py-3">
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <span className="fw-bold fs-5" style={{ color: 'var(--primary-color)' }}>
              🏨 Liras Admin
            </span>
          </Link>
        </div>

        <div className="main-sidebar" id="sidebar-scroll">
          <nav className="main-menu-inner">
            <ul className="main-menu-list list-unstyled">
              <li className="slide__category">
                <span className="category-name px-3 text-uppercase text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                  Menu
                </span>
              </li>

              {NAV_ITEMS.map(({ href, icon, label }) => {
                const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
                return (
                  <li key={href} className="slide">
                    <Link href={href} className={`side-menu__item${isActive ? ' active' : ''}`}>
                      <i className={`fas ${icon} side-menu__icon`} />
                      <span className="side-menu__label">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="app-content">

        {/* Header */}
        <header className="app-header">
          <div className="main-header-container container-fluid h-100 d-flex align-items-center justify-content-between">
            <span className="fw-semibold text-muted" style={{ fontSize: '0.9rem' }}>
              Panel Manajemen — Liras Hotel
            </span>
            <div className="d-flex align-items-center gap-2">
              <Link href="/" className="btn btn-sm btn-light border">
                <i className="fas fa-home me-1" />
                Ke Website
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
                <i className="fas fa-sign-out-alt me-1" />
                Keluar
              </button>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="main-content">
          <div className="container-xl py-4">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}