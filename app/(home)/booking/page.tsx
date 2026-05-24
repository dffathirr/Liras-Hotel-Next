"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate } from "@/helpers/site";

type Kamar = {
  id: number;
  jenis_bed: string;
  no_kamar: string | null;
  harga: number;
  max_tamu: number;
};

type FormState = {
  jenis_bed: string;
  kamar_id: string;
  checkin: string;
  checkout: string;
  jml_tamu: string;
  nama: string;
  gender: string;
  no_telp: string;
  alamat: string;
  metode_pembayaran: string;
  uang_bayar: string;
};

export default function BookingPage() {
  const searchParams = useSearchParams();

  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [availableKamar, setAvailableKamar] = useState<Kamar[] | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [form, setForm] = useState<FormState>({
    jenis_bed: "",
    kamar_id: "",
    checkin: "",
    checkout: "",
    jml_tamu: "1",
    nama: "",
    gender: "L",
    no_telp: "",
    alamat: "",
    metode_pembayaran: "cash",
    uang_bayar: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    bookingId: number;
    totalHarga: number;
    nights: number;
  } | null>(null);

  // Pre-fill kamar_id dari URL param — applied setelah availability check selesai
  const pendingKamarId = useRef<string | null>(searchParams.get("kamar_id"));

  // Load semua kamar untuk opsi jenis_bed
  useEffect(() => {
    fetch("/api/kamar")
      .then((r) => r.json())
      .then((data: Kamar[]) => {
        setKamarList(data);
        // Jika ada pre-fill dari URL, set jenis_bed-nya sekarang
        if (pendingKamarId.current) {
          const pre = data.find((k) => k.id === Number(pendingKamarId.current));
          if (pre) {
            setForm((prev) => ({ ...prev, jenis_bed: pre.jenis_bed }));
          } else {
            pendingKamarId.current = null;
          }
        }
      })
      .catch(() => setKamarList([]));
  }, []);

  // Cek ketersediaan saat jenis_bed + tanggal sudah diisi
  useEffect(() => {
    if (!form.jenis_bed || !form.checkin || !form.checkout) return;

    const params = new URLSearchParams({
      checkin: form.checkin,
      checkout: form.checkout,
      jenis_bed: form.jenis_bed,
    });

    // Defer ke microtask agar tidak jadi synchronous setState dalam effect
    queueMicrotask(() => setLoadingAvail(true));
    fetch(`/api/kamar/available?${params}`)
      .then((r) => r.json())
      .then((data: Kamar[]) => {
        setAvailableKamar(data);
        // Terapkan pre-fill dari URL jika kamar tersedia
        if (pendingKamarId.current) {
          const found = data.some(
            (k) => k.id === Number(pendingKamarId.current),
          );
          if (found)
            setForm((prev) => ({ ...prev, kamar_id: pendingKamarId.current! }));
          pendingKamarId.current = null;
        }
      })
      .catch(() => setAvailableKamar([]))
      .finally(() => setLoadingAvail(false));
  }, [form.jenis_bed, form.checkin, form.checkout]);

  const jenisOptions = [...new Set(kamarList.map((k) => k.jenis_bed))].sort();
  const canCheckAvail = !!form.jenis_bed && !!form.checkin && !!form.checkout;
  // Derive: hide stale results when required fields aren't all filled
  const effectiveAvailable = canCheckAvail ? availableKamar : null;
  const selectedKamar = effectiveAvailable?.find(
    (k) => k.id === Number(form.kamar_id),
  );

  const nights = (() => {
    if (!form.checkin || !form.checkout) return 0;
    const diff =
      new Date(form.checkout).getTime() - new Date(form.checkin).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const estimasiHarga = selectedKamar ? selectedKamar.harga * nights : 0;
  const uangBayarNum   = Number(form.uang_bayar) || 0;
  const kembalian      = form.metode_pembayaran === "cash" ? uangBayarNum - estimasiHarga : 0;
  const cashKurang     = form.metode_pembayaran === "cash" && estimasiHarga > 0 && uangBayarNum < estimasiHarga;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Reset kamar_id setiap kali komponen penentu availability berubah
      if (["jenis_bed", "checkin", "checkout"].includes(name)) {
        next.kamar_id = "";
      }
      // Hapus checkout kalau checkin maju melewatinya
      if (name === "checkin" && prev.checkout && value >= prev.checkout) {
        next.checkout = "";
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.metode_pembayaran === "cash" && uangBayarNum < estimasiHarga) {
      setError("Uang bayar kurang dari total harga");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kamar_id: Number(form.kamar_id),
          jml_tamu: Number(form.jml_tamu),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Terjadi kesalahan");
      setSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const successKembalian =
      form.metode_pembayaran === "cash"
        ? Number(form.uang_bayar) - success.totalHarga
        : 0;
    const metodeLabel: Record<string, string> = {
      cash: "Tunai (Cash)",
      debit: "Kartu Debit",
      qris: "QRIS",
    };

    return (
      <section className="liras-booking">
        <div className="container">
          <div className="liras-booking__success">
            <div className="liras-booking__success-icon">
              <i className="ri-checkbox-circle-line" />
            </div>
            <h2>Booking Berhasil!</h2>
            <p>
              Terima kasih, <strong>{form.nama}</strong>. Pemesanan Anda telah
              kami terima.
            </p>
            <div className="liras-booking__success-detail">
              <div>
                <span>Nomor Booking</span>
                <strong>#{String(success.bookingId).padStart(5, "0")}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong className="liras-booking__status-pending">
                  Menunggu Konfirmasi
                </strong>
              </div>
              <div>
                <span>Check-in</span>
                <strong>{formatDate(form.checkin)}</strong>
              </div>
              <div>
                <span>Check-out</span>
                <strong>{formatDate(form.checkout)}</strong>
              </div>
              <div>
                <span>Durasi Menginap</span>
                <strong>{success.nights} malam</strong>
              </div>
              <div>
                <span>Total Harga</span>
                <strong>{formatPrice(success.totalHarga)}</strong>
              </div>
              <div>
                <span>Metode Pembayaran</span>
                <strong>{metodeLabel[form.metode_pembayaran] ?? form.metode_pembayaran}</strong>
              </div>
              {form.metode_pembayaran === "cash" && (
                <>
                  <div>
                    <span>Uang Bayar</span>
                    <strong>{formatPrice(Number(form.uang_bayar))}</strong>
                  </div>
                  <div className="liras-booking__success-detail--full">
                    <span>Kembalian</span>
                    <strong className="liras-booking__kembalian-value">
                      {formatPrice(successKembalian)}
                    </strong>
                  </div>
                </>
              )}
            </div>
            <p className="liras-booking__success-note">
              Tim kami akan menghubungi Anda melalui nomor telepon yang
              terdaftar untuk konfirmasi booking.
            </p>
            <Link href="/" className="liras-btn-book">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="liras-booking">
      <div className="container">
        <div className="liras-section-header">
          <p className="liras-section-eyebrow">Reservasi</p>
          <h1 className="liras-section-title">Formulir Pemesanan</h1>
          <p className="liras-section-subtitle">
            Isi data di bawah untuk melakukan reservasi kamar.
          </p>
        </div>

        <div className="liras-booking__grid">
          {/* Form */}
          <form className="liras-booking__form" onSubmit={handleSubmit}>
            <div className="liras-booking__form-section">
              <h3>Detail Kamar</h3>

              {/* Step 1 — Jenis Kamar */}
              <div className="liras-booking__field">
                <label htmlFor="jenis_bed">
                  Jenis Kamar <span>*</span>
                </label>
                <select
                  id="jenis_bed"
                  name="jenis_bed"
                  value={form.jenis_bed}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih jenis kamar --</option>
                  {jenisOptions.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2 — Tanggal */}
              <div className="liras-booking__row">
                <div className="liras-booking__field">
                  <label htmlFor="checkin">
                    Tanggal Check-in <span>*</span>
                  </label>
                  <input
                    type="date"
                    id="checkin"
                    name="checkin"
                    min={today}
                    value={form.checkin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="liras-booking__field">
                  <label htmlFor="checkout">
                    Tanggal Check-out <span>*</span>
                  </label>
                  <input
                    type="date"
                    id="checkout"
                    name="checkout"
                    min={form.checkin || today}
                    value={form.checkout}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Step 3 — Nomor Kamar (cek availability dulu) */}
              <div className="liras-booking__field">
                <label htmlFor="kamar_id">
                  Nomor Kamar <span>*</span>
                  {canCheckAvail &&
                    effectiveAvailable !== null &&
                    !loadingAvail && (
                      <em
                        className={`liras-booking__avail-badge${effectiveAvailable.length === 0 ? " liras-booking__avail-badge--none" : ""}`}
                      >
                        {effectiveAvailable.length} kamar tersedia
                      </em>
                    )}
                </label>
                {!canCheckAvail ? (
                  <p className="liras-booking__field-hint">
                    Pilih jenis kamar dan tanggal menginap terlebih dahulu.
                  </p>
                ) : loadingAvail ? (
                  <p className="liras-booking__field-hint liras-booking__field-hint--loading">
                    <i className="ri-loader-4-line" /> Mengecek ketersediaan
                    kamar&hellip;
                  </p>
                ) : effectiveAvailable && effectiveAvailable.length > 0 ? (
                  <select
                    id="kamar_id"
                    name="kamar_id"
                    value={form.kamar_id ?? ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih nomor kamar --</option>
                    {effectiveAvailable.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.no_kamar ? `No. ${k.no_kamar} — ` : ""}
                        {k.jenis_bed} · Maks. {k.max_tamu} tamu ·{" "}
                        {formatPrice(k.harga)}/malam
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="liras-booking__field-hint liras-booking__field-hint--unavail">
                    <i className="ri-emotion-sad-line" /> Tidak ada kamar{" "}
                    <strong>{form.jenis_bed}</strong> yang tersedia untuk
                    tanggal tersebut.
                  </p>
                )}
              </div>

              <div className="liras-booking__field">
                <label htmlFor="jml_tamu">
                  Jumlah Tamu <span>*</span>
                </label>
                <select
                  id="jml_tamu"
                  name="jml_tamu"
                  value={form.jml_tamu}
                  onChange={handleChange}
                  required
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Tamu
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="liras-booking__form-section">
              <h3>Data Tamu</h3>

              <div className="liras-booking__field">
                <label htmlFor="nama">
                  Nama Lengkap <span>*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="liras-booking__field">
                <label>
                  Jenis Kelamin <span>*</span>
                </label>
                <div className="liras-booking__radio-group">
                  <label className="liras-booking__radio">
                    <input
                      type="radio"
                      name="gender"
                      value="L"
                      checked={form.gender === "L"}
                      onChange={handleChange}
                    />
                    Laki-laki
                  </label>
                  <label className="liras-booking__radio">
                    <input
                      type="radio"
                      name="gender"
                      value="P"
                      checked={form.gender === "P"}
                      onChange={handleChange}
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              <div className="liras-booking__field">
                <label htmlFor="no_telp">
                  No. Telepon <span>*</span>
                </label>
                <input
                  type="tel"
                  id="no_telp"
                  name="no_telp"
                  placeholder="Contoh: 08123456789"
                  value={form.no_telp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="liras-booking__field">
                <label htmlFor="alamat">Alamat</label>
                <textarea
                  id="alamat"
                  name="alamat"
                  rows={3}
                  placeholder="Alamat lengkap (opsional)"
                  value={form.alamat}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="liras-booking__form-section">
              <h3>Metode Pembayaran</h3>

              <div className="liras-booking__field">
                <label>Metode <span>*</span></label>
                <div className="liras-booking__radio-group">
                  {[
                    { value: "cash",  label: "Tunai (Cash)",  icon: "ri-money-dollar-circle-line" },
                    { value: "debit", label: "Kartu Debit",   icon: "ri-bank-card-line" },
                    { value: "qris",  label: "QRIS",          icon: "ri-qr-code-line" },
                  ].map((m) => (
                    <label key={m.value} className="liras-booking__radio">
                      <input
                        type="radio"
                        name="metode_pembayaran"
                        value={m.value}
                        checked={form.metode_pembayaran === m.value}
                        onChange={handleChange}
                      />
                      <i className={m.icon} /> {m.label}
                    </label>
                  ))}
                </div>
              </div>

              {form.metode_pembayaran === "cash" && (
                <div className="liras-booking__field">
                  <label htmlFor="uang_bayar">
                    Uang Bayar <span>*</span>
                  </label>
                  <input
                    type="number"
                    id="uang_bayar"
                    name="uang_bayar"
                    min={0}
                    step={1000}
                    placeholder="Masukkan nominal uang"
                    value={form.uang_bayar}
                    onChange={handleChange}
                    required
                  />
                  {estimasiHarga > 0 && uangBayarNum > 0 && (
                    <p className={`liras-booking__cash-info${cashKurang ? " liras-booking__cash-info--kurang" : ""}`}>
                      {cashKurang
                        ? `Kurang ${formatPrice(estimasiHarga - uangBayarNum)}`
                        : `Kembalian: ${formatPrice(kembalian)}`}
                    </p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="liras-booking__error">
                <i className="ri-error-warning-line" /> {error}
              </p>
            )}

            <button
              type="submit"
              className="liras-btn-book liras-booking__submit"
              disabled={submitting || !form.kamar_id}
            >
              {submitting ? "Memproses..." : "Konfirmasi Pemesanan"}
            </button>
          </form>

          {/* Summary */}
          <aside className="liras-booking__summary">
            <h3>Ringkasan Pemesanan</h3>
            {selectedKamar ? (
              <>
                <div className="liras-booking__summary-row">
                  <span>Kamar</span>
                  <strong>
                    {selectedKamar.jenis_bed}
                    {selectedKamar.no_kamar
                      ? ` — No. ${selectedKamar.no_kamar}`
                      : ""}
                  </strong>
                </div>
                <div className="liras-booking__summary-row">
                  <span>Kapasitas</span>
                  <strong>Maks. {selectedKamar.max_tamu} Tamu</strong>
                </div>
                <div className="liras-booking__summary-row">
                  <span>Harga/malam</span>
                  <strong>{formatPrice(selectedKamar.harga)}</strong>
                </div>
                {nights > 0 && (
                  <>
                    <div className="liras-booking__summary-row">
                      <span>Durasi</span>
                      <strong>{nights} malam</strong>
                    </div>
                    <div className="liras-booking__summary-divider" />
                    <div className="liras-booking__summary-row liras-booking__summary-total">
                      <span>Total Estimasi</span>
                      <strong>{formatPrice(estimasiHarga)}</strong>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="liras-booking__summary-empty">
                Pilih kamar untuk melihat ringkasan.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
