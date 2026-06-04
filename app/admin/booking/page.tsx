"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate } from "@/helpers/site";
import StatusBar from "./components/StatusBar";
import ExportButton from "./components/ExportButton";
import SearchButton from "./components/SearchButton";
import Table from "./components/Table";
import Pagination from "./components/Pagination";

type Booking = {
  id: number;
  status: string;
  created_at: string;
  customer_nama: string;
  customer_no_telp: string;
  no_kamar: string;
  jenis_bed: string;
  checkin: string;
  checkout: string;
  jml_tamu: number;
  harga: number;
  jenis_pembayaran: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; tabColor: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-warning text-dark",
    tabColor: "#fd7e14",
  },
  confirmed: {
    label: "Dikonfirmasi",
    badge: "bg-info text-white",
    tabColor: "#0dcaf0",
  },
  checked_in: {
    label: "Check-in",
    badge: "bg-success text-white",
    tabColor: "#198754",
  },
  checked_out: {
    label: "Check-out",
    badge: "bg-secondary text-white",
    tabColor: "#6c757d",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-danger text-white",
    tabColor: "#dc3545",
  },
};

const TABS = [
  { key: "", label: "Semua Booking" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "checked_in", label: "Check-in" },
  { key: "checked_out", label: "Check-out" },
  { key: "cancelled", label: "Dibatalkan" },
];

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled"],
  checked_in: ["checked_out"],
  checked_out: [],
  cancelled: [],
};

const ITEMS_PER_PAGE = 10;

// Sort priority for "Semua Booking" view: pending first, then confirmed, checked_in, checked_out, cancelled
const STATUS_PRIORITY: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  checked_in: 2,
  checked_out: 3,
  cancelled: 4,
};

function nights(checkin: string, checkout: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil(
    (new Date(checkout).getTime() - new Date(checkin).getTime()) / msPerDay,
  );
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking");
      if (!res.ok) throw new Error("Gagal memuat data");
      const data: Booking[] = await res.json();
      // Deduplicate by id (LEFT JOIN pembayaran can produce multiple rows per booking)
      const deduped = Array.from(new Map(data.map((b) => [b.id, b])).values());
      setBookings(deduped);
    } catch {
      setError("Gagal memuat data booking. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchBookings());
  }, [fetchBookings]);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    queueMicrotask(() => setCurrentPage(1));
  }, [activeTab, search]);

  async function updateStatus(id: number, newStatus: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
    } catch {
      alert("Gagal memperbarui status. Silakan coba lagi.");
    } finally {
      setUpdating(null);
    }
  }

  function exportCSV() {
    const headers = [
      "No. Booking",
      "Nama Tamu",
      "No. HP",
      "Kamar",
      "Jenis Bed",
      "Check-in",
      "Check-out",
      "Malam",
      "Total",
      "Metode",
      "Status",
    ];
    const rows = filtered.map((b) => [
      `#${String(b.id).padStart(4, "0")}`,
      b.customer_nama,
      b.customer_no_telp,
      b.no_kamar,
      b.jenis_bed,
      formatDate(b.checkin),
      formatDate(b.checkout),
      nights(b.checkin, b.checkout),
      formatPrice(b.harga),
      b.jenis_pembayaran ?? "",
      STATUS_CONFIG[b.status]?.label ?? b.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking-liras-hotel.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filtering + sorting
  const q = search.trim().toLowerCase();
  const filtered = bookings
    .filter((b) => !activeTab || b.status === activeTab)
    .filter((b) => {
      if (!q) return true;
      return (
        b.customer_nama.toLowerCase().includes(q) ||
        String(b.id).includes(q) ||
        b.customer_no_telp.includes(q)
      );
    })
    .slice()
    .sort((a, b) => {
      if (!activeTab) {
        // All tab: status priority first, then newest first
        const pd =
          (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9);
        if (pd !== 0) return pd;
      }
      // Within same priority (or single-status tab): newest first
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  function tabCount(key: string) {
    return key
      ? bookings.filter((b) => b.status === key).length
      : bookings.length;
  }

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2>Manajemen Kamar</h2>
        <p className="text-muted">Kelola data dan status kamar hotel</p>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-sm">
        {/* ── Tab Bar + Export ── */}
        <div
          className="d-flex align-items-center flex-wrap gap-2 px-3 pt-3 pb-0"
          style={{ borderBottom: "1px solid #e9ecef" }}
        >
          <StatusBar
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            statusConfig={STATUS_CONFIG}
            loading={loading}
            tabCount={tabCount}
          />
          <ExportButton
            onRefresh={fetchBookings}
            onExport={exportCSV}
            loading={loading}
            exportDisabled={loading || filtered.length === 0}
          />
        </div>

        {/* ── Search Bar ── */}
        <SearchButton value={search} onChange={setSearch} />

        {/* ── Table ── */}
        <Table
          error={error}
          loading={loading}
          paginated={paginated}
          search={search}
          activeTab={activeTab}
          statusConfig={STATUS_CONFIG}
          nextStatuses={NEXT_STATUSES}
          updating={updating}
          onUpdateStatus={updateStatus}
        />

        {/* ── Footer: Showing + Pagination ── */}
        {!loading && !error && filtered.length > 0 && (
          <Pagination
            start={start}
            end={Math.min(start + ITEMS_PER_PAGE, filtered.length)}
            filteredLength={filtered.length}
            totalPages={totalPages}
            safePage={safePage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
