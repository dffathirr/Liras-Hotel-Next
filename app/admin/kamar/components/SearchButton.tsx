"use client";

type SearchButtonProps = {
  search: string;
  onChange: (val: string) => void;
  onAdd: () => void;
};

export default function SearchButton({
  search,
  onChange,
  onAdd,
}: SearchButtonProps) {
  return (
    <div className="card-header bg-white d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <div className="input-group input-group-sm" style={{ width: 270 }}>
          <span className="input-group-text bg-white border-end-0">
            <i
              className="fas fa-search text-muted"
              style={{ fontSize: "0.75rem" }}
            />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Cari no. kamar, nama, jenis bed…"
            value={search}
            onChange={(e) => onChange(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => onChange("")}
            >
              <i className="fas fa-times" style={{ fontSize: "0.75rem" }} />
            </button>
          )}
        </div>
      </div>
      <button
        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
        onClick={onAdd}
      >
        <i className="fas fa-plus" />
        Tambah Kamar
      </button>
    </div>
  );
}
