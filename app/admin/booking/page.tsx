"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate } from "@/helpers/site";

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
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h4 className="mb-0 fw-bold">Manajemen Booking</h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
          Kelola status pemesanan tamu hotel
        </p>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-sm">
        {/* ── Tab Bar + Export ── */}
        <div
          className="d-flex align-items-center flex-wrap gap-2 px-3 pt-3 pb-0"
          style={{ borderBottom: "1px solid #e9ecef" }}
        >
          {/* Tabs */}
          <div className="d-flex align-items-center flex-wrap gap-1 flex-grow-1">
            {TABS.map(({ key, label }) => {
              const isActive = activeTab === key;
              const cfg = key ? STATUS_CONFIG[key] : null;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="btn btn-sm d-flex align-items-center gap-1 mb-2"
                  style={{
                    borderRadius: "6px 6px 0 0",
                    borderBottom: isActive
                      ? `2px solid ${cfg?.tabColor ?? "var(--primary-color)"}`
                      : "2px solid transparent",
                    background: isActive ? "#f8f9fa" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? (cfg?.tabColor ?? "var(--primary-color)")
                      : "#6c757d",
                    fontSize: "0.82rem",
                    padding: "0.3rem 0.75rem",
                  }}
                >
                  {label}
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: isActive
                        ? (cfg?.tabColor ?? "var(--primary-color)")
                        : "#dee2e6",
                      color: isActive ? "#fff" : "#495057",
                      fontSize: "0.68rem",
                    }}
                  >
                    {loading ? "…" : tabCount(key)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Export + Refresh */}
          <div className="d-flex gap-2 mb-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchBookings}
              disabled={loading}
              title="Refresh data"
            >
              <i className={`fas fa-sync-alt${loading ? " fa-spin" : ""}`} />
            </button>
            <button
              className="btn btn-sm btn-success d-flex align-items-center gap-1"
              onClick={exportCSV}
              disabled={loading || filtered.length === 0}
            >
              <i className="fas fa-file-excel" />
              Export Excel
            </button>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div
          className="px-3 py-2"
          style={{ borderBottom: "1px solid #e9ecef" }}
        >
          <div
            className="input-group input-group-sm"
            style={{ maxWidth: "400px" }}
          >
            <span className="input-group-text bg-white border-end-0">
              <i
                className="fas fa-search text-muted"
                style={{ fontSize: "0.8rem" }}
              />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Cari nama tamu, kode booking, atau nomor HP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
                title="Hapus pencarian"
              >
                <i className="fas fa-times" style={{ fontSize: "0.75rem" }} />
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card-body p-0">
          {error ? (
            <div className="p-4 text-center text-danger">{error}</div>
          ) : loading ? (
            <div className="p-5 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
              <p className="mt-2 text-muted mb-0">Memuat data booking…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="fas fa-calendar-times fa-2x mb-3 d-block opacity-25" />
              Tidak ada data booking{search || activeTab ? " yang cocok" : ""}.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr style={{ fontSize: "0.82rem" }}>
                    <th className="ps-4">No. Booking</th>
                    <th>Tamu</th>
                    <th>Kamar</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th className="text-center">Malam</th>
                    <th>Total</th>
                    <th>Metode</th>
                    <th>Status</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => {
                    const cfg = STATUS_CONFIG[b.status] ?? {
                      label: b.status,
                      badge: "bg-secondary text-white",
                      tabColor: "#6c757d",
                    };
                    const nextList = NEXT_STATUSES[b.status] ?? [];
                    const n = nights(b.checkin, b.checkout);
                    const isUpdating = updating === b.id;

                    return (
                      <tr key={b.id}>
                        <td className="ps-4">
                          <span
                            className="fw-semibold text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            #{String(b.id).padStart(4, "0")}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold">{b.customer_nama}</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {b.customer_no_telp}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold">{b.no_kamar}</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {b.jenis_bed}
                          </div>
                        </td>
                        <td style={{ fontSize: "0.875rem" }}>
                          {formatDate(b.checkin)}
                        </td>
                        <td style={{ fontSize: "0.875rem" }}>
                          {formatDate(b.checkout)}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border">
                            {n}×
                          </span>
                        </td>
                        <td
                          className="fw-semibold"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {formatPrice(b.harga)}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border text-capitalize">
                            {b.jenis_pembayaran ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          {nextList.length > 0 ? (
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                            >
                              {nextList.map((next) => {
                                const nextCfg = STATUS_CONFIG[next];
                                const btnColor =
                                  next === "cancelled"
                                    ? "btn-outline-danger"
                                    : next === "confirmed"
                                      ? "btn-outline-info"
                                      : next === "checked_in"
                                        ? "btn-outline-success"
                                        : next === "checked_out"
                                          ? "btn-outline-secondary"
                                          : "btn-outline-primary";
                                return (
                                  <button
                                    key={next}
                                    className={`btn ${btnColor}`}
                                    onClick={() => updateStatus(b.id, next)}
                                    disabled={isUpdating}
                                    title={`Ubah ke: ${nextCfg?.label ?? next}`}
                                  >
                                    {isUpdating ? (
                                      <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                      (nextCfg?.label ?? next)
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.8rem" }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer: Showing + Pagination ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="card-footer bg-transparent d-flex align-items-center justify-content-between py-2 px-4">
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
              Showing {start + 1} to{" "}
              {Math.min(start + ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-sm btn-light border"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
                )
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                    acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`btn btn-sm ${safePage === p ? "btn-primary" : "btn-light border"}`}
                      onClick={() => setCurrentPage(p as number)}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                className="btn btn-sm btn-light border"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
