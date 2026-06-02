type Tab = { key: string; label: string };
type StatusConfigItem = { label: string; badge: string; tabColor: string };

type Props = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  statusConfig: Record<string, StatusConfigItem>;
  loading: boolean;
  tabCount: (key: string) => number;
};

export default function StatusBar({
  tabs,
  activeTab,
  onTabChange,
  statusConfig,
  loading,
  tabCount,
}: Props) {
  return (
    <div className="d-flex align-items-center flex-wrap gap-1 flex-grow-1">
      {tabs.map(({ key, label }) => {
        const isActive = activeTab === key;
        const cfg = key ? statusConfig[key] : null;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
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
  );
}