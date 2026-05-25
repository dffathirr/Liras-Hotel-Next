import Link from "next/link";
import { formatPrice, formatDate } from "@/helpers/site";

type SuccessData = {
  bookingId: number;
  totalHarga: number;
  nights: number;
};

type FormSnapshot = {
  nama: string;
  checkin: string;
  checkout: string;
  metode_pembayaran: string;
  uang_bayar: string;
};

type Props = {
  success: SuccessData;
  form: FormSnapshot;
};

export default function Receipt({ success, form }: Props) {
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
              <strong>
                {metodeLabel[form.metode_pembayaran] ?? form.metode_pembayaran}
              </strong>
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
            Tim kami akan menghubungi Anda melalui nomor telepon yang terdaftar
            untuk konfirmasi booking.
          </p>
          <Link href="/" className="liras-btn-book">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
