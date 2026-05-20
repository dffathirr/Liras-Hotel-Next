import type { ReactNode } from 'react';
// import Sidebar from '@/components/admin/layout/Sidebar';
// import Header from '@/components/admin/layout/Header';

/**
 * ADMIN LAYOUT — berlaku untuk semua route: /admin, /admin/rooms, /admin/bookings, dll
 *
 * ┌──────────┬──────────────────────────────┐
 * │          │  HEADER                      │  ← hamburger, search, notif, user menu
 * │ SIDEBAR  ├──────────────────────────────┤
 * │          │                              │
 * │ - Dashboard        {children}           │
 * │ - Rooms            ← konten tiap page   │
 * │ - Bookings                              │
 * │ - Guests                                │
 * │ - Reports                               │
 * │ - Settings                              │
 * │          │                              │
 * └──────────┴──────────────────────────────┘
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-container">
      {/* <Sidebar /> */}
      <div className="main-content">
        {/* <Header /> */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}