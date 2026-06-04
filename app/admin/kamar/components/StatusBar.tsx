"use client";

type StatusBarProps = {
  filterStatus: string;
  onFilterChange: (key: string) => void;
  kamarLength: number;
  availableCount: number;
  occupiedCount: number;
  loading: boolean;
  onRefresh: () => void;
};

export default function StatusBar({
  filterStatus,
  onFilterChange,
  kamarLength,
  availableCount,
  occupiedCount,
  loading,
  onRefresh,
}: StatusBarProps) {
  return (
    <div
      className="d-flex align-items-center flex-wrap gap-2 px-3 pt-3 pb-0"
      style={{ borderBottom: "1px solid #e9ecef" }}
    >
      <div className="d-flex align-items-center flex-wrap gap-1 flex-grow-1">
        {([
          { key: "",          label: "Semua Kamar", count: kamarLength,    color: "var(--primary-color)", badge: "bg-primary" },
          { key: "available", label: "Tersedia",    count: availableCount, color: "#198754",              badge: "bg-success" },
          { key: "occupied",  label: "Terisi",      count: occupiedCount,  color: "#dc3545",              badge: "bg-danger"  },
        ] as const).map(({ key, label, count, color, badge }) => {
          const isActive = filterStatus === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className="btn btn-sm d-flex align-items-center gap-1 mb-2"
              style={{
                borderRadius: "6px 6px 0 0",
                borderBottom: isActive
                  ? `2px solid ${color}`
                  : "2px solid transparent",
                background: isActive ? "#f8f9fa" : "transparent",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? color : "#6c757d",
                fontSize: "0.82rem",
                padding: "0.3rem 0.75rem",
              }}
            >
              {label}
              <span
                className={`badge rounded-pill ${isActive ? badge : ""}`}
                style={{
                  background: isActive ? undefined : "#dee2e6",
                  color: isActive ? "#fff" : "#495057",
                  fontSize: "0.68rem",
                }}
              >
                {loading ? "\u2026" : count}
              </span>
            </button>
          );
        })}
      </div>
      <button
        className="btn btn-sm btn-outline-secondary mb-2"
        onClick={onRefresh}
        disabled={loading}
        title="Refresh data"
      >
        <i className={`fas fa-sync-alt${loading ? " fa-spin" : ""}`} />
      </button>
    </div>
  );
}
