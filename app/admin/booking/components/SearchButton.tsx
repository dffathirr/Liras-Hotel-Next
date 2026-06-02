type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function SearchButton({ value, onChange }: Props) {
  return (
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => onChange("")}
            title="Hapus pencarian"
          >
            <i className="fas fa-times" style={{ fontSize: "0.75rem" }} />
          </button>
        )}
      </div>
    </div>
  );
}