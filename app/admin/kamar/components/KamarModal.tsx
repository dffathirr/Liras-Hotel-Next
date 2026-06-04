"use client";

type FormData = {
  nama: string;
  jenis_bed: string;
  no_kamar: string;
  size: string;
  harga: string;
  max_tamu: string;
  description: string;
};

type KamarModalProps = {
  mode: "add" | "edit";
  formData: FormData;
  formError: string;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof FormData, value: string) => void;
};

type Kamar = {
  id: number;
  no_kamar: string;
  nama: string;
};

type DeleteModalProps = {
  kamar: Kamar;
  saving: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function KamarModal({
  mode,
  formData,
  formError,
  saving,
  onClose,
  onSave,
  onFieldChange,
}: KamarModalProps) {
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">
                {mode === "add" ? "Tambah Kamar" : "Edit Kamar"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {formError && (
                <div
                  className="alert alert-danger py-2"
                  style={{ fontSize: "0.875rem" }}
                >
                  {formError}
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    No. Kamar <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.no_kamar}
                    onChange={(e) => onFieldChange("no_kamar", e.target.value)}
                    placeholder="mis. 101"
                    maxLength={5}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    Nama Kamar <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.nama}
                    onChange={(e) => onFieldChange("nama", e.target.value)}
                    placeholder="mis. Deluxe Room"
                    maxLength={50}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    Jenis Bed <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.jenis_bed}
                    onChange={(e) => onFieldChange("jenis_bed", e.target.value)}
                    placeholder="mis. King Bed"
                    maxLength={15}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    Ukuran
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.size}
                    onChange={(e) => onFieldChange("size", e.target.value)}
                    placeholder="mis. 32 m²"
                    maxLength={10}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    Harga / Malam (Rp) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.harga}
                    onChange={(e) => onFieldChange("harga", e.target.value)}
                    placeholder="mis. 500000"
                    min={0}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm fw-semibold">
                    Max Tamu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.max_tamu}
                    onChange={(e) => onFieldChange("max_tamu", e.target.value)}
                    placeholder="mis. 2"
                    min={1}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label form-label-sm fw-semibold">
                    Deskripsi
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      onFieldChange("description", e.target.value)
                    }
                    placeholder="Deskripsi kamar…"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-sm btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Batal
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Menyimpan…
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

export function DeleteModal({
  kamar,
  saving,
  onClose,
  onDelete,
}: DeleteModalProps) {
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold text-danger">
                Hapus Kamar
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p>
                Yakin ingin menghapus kamar{" "}
                <strong>
                  {kamar.no_kamar} – {kamar.nama}
                </strong>
                ?
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-sm btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Batal
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={onDelete}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Menghapus…
                  </>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
