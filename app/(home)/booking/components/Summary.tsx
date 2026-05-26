import { formatPrice } from "@/helpers/site";

type Kamar = {
  id: number;
  jenis_bed: string;
  no_kamar: string | null;
  harga: number;
  max_tamu: number;
};

type Props = {
  selectedKamar: Kamar | undefined;
  nights: number;
  estimasiHarga: number;
};

export default function Summary({ selectedKamar, nights, estimasiHarga }: Props) {
  return (
    <aside className="liras-booking__summary">
      <h3>Ringkasan Pemesanan</h3>
      {selectedKamar ? (
        <>
          <div className="liras-booking__summary-row">
            <span>Kamar</span>
            <strong>
              {selectedKamar.jenis_bed}
              {selectedKamar.no_kamar ? ` — No. ${selectedKamar.no_kamar}` : ""}
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
  );
}
