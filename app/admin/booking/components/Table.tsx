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

type StatusConfigItem = { label: string; badge: string; tabColor: string };

function nights(checkin: string, checkout: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil(
    (new Date(checkout).getTime() - new Date(checkin).getTime()) / msPerDay,
  );
}

type Props = {
  error: string;
  loading: boolean;
  paginated: Booking[];
  search: string;
  activeTab: string;
  statusConfig: Record<string, StatusConfigItem>;
  nextStatuses: Record<string, string[]>;
  updating: number | null;
  onUpdateStatus: (id: number, status: string) => void;
};

export default function Table({
  error,
  loading,
  paginated,
  search,
  activeTab,
  statusConfig,
  nextStatuses,
  updating,
  onUpdateStatus,
}: Props) {
  return (
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
                const cfg = statusConfig[b.status] ?? {
                  label: b.status,
                  badge: "bg-secondary text-white",
                  tabColor: "#6c757d",
                };
                const nextList = nextStatuses[b.status] ?? [];
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
                            const nextCfg = statusConfig[next];
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
                                onClick={() => onUpdateStatus(b.id, next)}
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
                        ></span>
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
  );
}