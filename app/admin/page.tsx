/**
 * ADMIN DASHBOARD PAGE — URL: /admin
 * Halaman utama admin setelah login.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  STAT CARDS (row)                                   │
 * │  [ Total Kamar ] [ Booking Aktif ] [ Tamu Hari ini ]│  ← angka ringkasan
 * │  [ Revenue Bulan Ini ]                              │
 * ├───────────────────────────┬─────────────────────────┤
 * │  BOOKING CHART            │  OCCUPANCY              │
 * │  (bar chart per bulan)    │  (donut: terisi/kosong) │  ← grafik visual
 * ├───────────────────────────┴─────────────────────────┤
 * │  RECENT BOOKINGS TABLE                              │
 * │  No | Tamu | Kamar | Check-in | Check-out | Status  │  ← 5-10 booking terbaru
 * └─────────────────────────────────────────────────────┘
 */
export default function AdminDashboardPage() {
  return (
    <div>
      {/* <StatCards /> */}
      {/* <BookingChart /> */}
      {/* <OccupancyOverview /> */}
      {/* <RecentBookings /> */}
    </div>
  );
}
