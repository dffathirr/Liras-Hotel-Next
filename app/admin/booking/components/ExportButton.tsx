type Props = {
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  exportDisabled: boolean;
};

export default function ExportButton({
  onRefresh,
  onExport,
  loading,
  exportDisabled,
}: Props) {
  return (
    <div className="d-flex gap-2 mb-2">
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={onRefresh}
        disabled={loading}
        title="Refresh data"
      >
        <i className={`fas fa-sync-alt${loading ? " fa-spin" : ""}`} />
      </button>
      <button
        className="btn btn-sm btn-success d-flex align-items-center gap-1"
        onClick={onExport}
        disabled={exportDisabled}
      >
        <i className="fas fa-file-excel" />
        Export Excel
      </button>
    </div>
  );
}