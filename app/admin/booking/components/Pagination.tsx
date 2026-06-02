type Props = {
  start: number;
  end: number;
  filteredLength: number;
  totalPages: number;
  safePage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  start,
  end,
  filteredLength,
  totalPages,
  safePage,
  onPageChange,
}: Props) {
  return (
    <div className="card-footer bg-transparent d-flex align-items-center justify-content-between py-2 px-4">
      <span className="text-muted" style={{ fontSize: "0.8rem" }}>
        Showing {start + 1} to {end} of {filteredLength}
      </span>
      <div className="d-flex align-items-center gap-1">
        <button
          className="btn btn-sm btn-light border"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
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
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </button>
            ),
          )}
        <button
          className="btn btn-sm btn-light border"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
        >
          ›
        </button>
      </div>
    </div>
  );
}