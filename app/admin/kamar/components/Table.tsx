"use client";

import { formatPrice } from "@/helpers/site";

type Kamar = {
  id: number;
  nama: string;
  jenis_bed: string;
  no_kamar: string;
  size: string;
  harga: number;
  max_tamu: number;
  description: string;
  is_occupied: number;
};

type TableProps = {
  error: string;
  loading: boolean;
  filtered: Kamar[];
  search: string;
  filterStatus: string;
  onEdit: (k: Kamar) => void;
  onDelete: (k: Kamar) => void;
};

export default function Table({
  error,
  loading,
  filtered,
  search,
  filterStatus,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="card-body p-0">
      {error ? (
        <div className="p-4 text-center text-danger">{error}</div>
      ) : loading ? (
        <div className="p-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p className="mt-2 text-muted mb-0">Memuat data kamar…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-5 text-center text-muted">
          <i className="fas fa-bed fa-2x mb-3 d-block opacity-25" />
          Tidak ada kamar{search || filterStatus ? " yang cocok" : ""}.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: "0.82rem" }}>
                <th className="ps-4">No. Kamar</th>
                <th>Nama</th>
                <th>Jenis Bed</th>
                <th>Ukuran</th>
                <th>Harga / Malam</th>
                <th className="text-center">Max Tamu</th>
                <th className="text-center">Status</th>
                <th className="text-center pe-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr key={k.id}>
                  <td className="ps-4">
                    <span className="fw-semibold">{k.no_kamar}</span>
                  </td>
                  <td>{k.nama}</td>
                  <td>
                    <span className="badge bg-light text-dark border text-capitalize">
                      {k.jenis_bed}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.875rem" }}>{k.size || "—"}</td>
                  <td
                    className="fw-semibold"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {formatPrice(k.harga)}
                  </td>
                  <td className="text-center">{k.max_tamu}</td>
                  <td className="text-center">
                    {k.is_occupied ? (
                      <span className="badge bg-danger">Terisi</span>
                    ) : (
                      <span className="badge bg-success">Tersedia</span>
                    )}
                  </td>
                  <td className="text-center pe-4">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(k)}
                        title="Edit kamar"
                      >
                        <i className="fas fa-edit" />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(k)}
                        disabled={!!k.is_occupied}
                        title={
                          k.is_occupied
                            ? "Tidak bisa dihapus: kamar sedang terisi"
                            : "Hapus kamar"
                        }
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
