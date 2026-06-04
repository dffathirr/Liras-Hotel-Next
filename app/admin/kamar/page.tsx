"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBar from "./components/StatusBar";
import SearchButton from "./components/SearchButton";
import Table from "./components/Table";
import { KamarModal, DeleteModal } from "./components/KamarModal";

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

type FormData = {
  nama: string;
  jenis_bed: string;
  no_kamar: string;
  size: string;
  harga: string;
  max_tamu: string;
  description: string;
};

const EMPTY_FORM: FormData = {
  nama: "",
  jenis_bed: "",
  no_kamar: "",
  size: "",
  harga: "",
  max_tamu: "",
  description: "",
};

export default function AdminKamarPage() {
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete" | null>(
    null,
  );
  const [selectedKamar, setSelectedKamar] = useState<Kamar | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchKamar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kamar");
      if (!res.ok) throw new Error();
      const data: Kamar[] = await res.json();
      setKamarList(data);
    } catch {
      setError("Gagal memuat data kamar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchKamar());
  }, [fetchKamar]);

  const filtered = kamarList.filter((k) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      k.no_kamar.toLowerCase().includes(q) ||
      k.nama.toLowerCase().includes(q) ||
      k.jenis_bed.toLowerCase().includes(q);
    const matchStatus =
      !filterStatus ||
      (filterStatus === "available" && !k.is_occupied) ||
      (filterStatus === "occupied" && k.is_occupied);
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setFormData(EMPTY_FORM);
    setFormError("");
    setSelectedKamar(null);
    setModalMode("add");
  }

  function openEdit(k: Kamar) {
    setFormData({
      nama: k.nama ?? "",
      jenis_bed: k.jenis_bed ?? "",
      no_kamar: k.no_kamar ?? "",
      size: k.size ?? "",
      harga: String(k.harga ?? ""),
      max_tamu: String(k.max_tamu ?? ""),
      description: k.description ?? "",
    });
    setFormError("");
    setSelectedKamar(k);
    setModalMode("edit");
  }

  function openDelete(k: Kamar) {
    setSelectedKamar(k);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedKamar(null);
  }

  function setField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const { nama, jenis_bed, no_kamar, harga, max_tamu } = formData;
    if (
      !nama.trim() ||
      !jenis_bed.trim() ||
      !no_kamar.trim() ||
      !harga ||
      !max_tamu
    ) {
      setFormError(
        "Nama, jenis bed, no. kamar, harga, dan max tamu wajib diisi.",
      );
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const url =
        modalMode === "add"
          ? "/api/kamar"
          : `/api/kamar/${selectedKamar!.id}`;
      const method = modalMode === "add" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          harga: Number(formData.harga),
          max_tamu: Number(formData.max_tamu),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message ?? "Terjadi kesalahan.");
        return;
      }
      closeModal();
      fetchKamar();
    } catch {
      setFormError("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedKamar) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/kamar/${selectedKamar.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message ?? "Gagal menghapus kamar.");
        return;
      }
      closeModal();
      fetchKamar();
    } catch {
      alert("Gagal menghapus kamar.");
    } finally {
      setSaving(false);
    }
  }

  const availableCount = kamarList.filter((k) => !k.is_occupied).length;
  const occupiedCount = kamarList.filter((k) => k.is_occupied).length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h4 className="mb-0 fw-bold">Manajemen Kamar</h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
          Kelola data dan status kamar hotel
        </p>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-sm">
        <StatusBar
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          kamarLength={kamarList.length}
          availableCount={availableCount}
          occupiedCount={occupiedCount}
          loading={loading}
          onRefresh={fetchKamar}
        />
        <SearchButton
          search={search}
          onChange={setSearch}
          onAdd={openAdd}
        />
        <Table
          error={error}
          loading={loading}
          filtered={filtered}
          search={search}
          filterStatus={filterStatus}
          onEdit={openEdit}
          onDelete={openDelete}
        />
        {!loading && !error && kamarList.length > 0 && (
          <div className="card-footer bg-transparent py-2 px-4">
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
              Menampilkan {filtered.length} dari {kamarList.length} kamar
            </span>
          </div>
        )}
      </div>

      {(modalMode === "add" || modalMode === "edit") && (
        <KamarModal
          mode={modalMode}
          formData={formData}
          formError={formError}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
          onFieldChange={setField}
        />
      )}

      {modalMode === "delete" && selectedKamar && (
        <DeleteModal
          kamar={selectedKamar}
          saving={saving}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
