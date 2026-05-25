import { query } from "@/config/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/helpers/site";

type Room = {
  id: number;
  nama: string;
  jenis_bed: string;
  size: string;
  harga: number;
  max_tamu: number;
  description: string;
};

const fixImage = [
  "/assets/images/kamar1.jpg",
  "/assets/images/kamar2.jpg",
  "/assets/images/kamar3.jpg",
  "/assets/images/kamar4.jpg",
];

export default async function KamarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) notFound();

  let room: Room | null = null;
  try {
    const rows = await query<Room[]>(
      "SELECT id, nama, jenis_bed, size, harga, max_tamu, description FROM kamar WHERE id = ?",
      [numId],
    );
    room = rows[0] ?? null;
  } catch {
    room = null;
  }

  if (!room) notFound();

  const image = fixImage[(numId - 1) % fixImage.length];

  return (
    <section className="liras-kamar-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="liras-kamar-detail__breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/kamar">Kamar</Link>
          <span>/</span>
          <span>{room.nama}</span>
        </nav>

        <div className="liras-kamar-detail__grid">
          {/* Image */}
          <div className="liras-kamar-detail__img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={room.nama} />
          </div>

          {/* Info */}
          <div className="liras-kamar-detail__info">
            <h1 className="liras-kamar-detail__name">{room.nama}</h1>

            <div className="liras-kamar-detail__meta">
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-expand-diagonal-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">Luas</span>
                  <span className="liras-kamar-detail__meta-value">
                    {room.size}
                  </span>
                </div>
              </div>
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-hotel-bed-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">
                    Tipe Tempat Tidur
                  </span>
                  <span className="liras-kamar-detail__meta-value">
                    {room.jenis_bed}
                  </span>
                </div>
              </div>
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-user-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">
                    Kapasitas
                  </span>
                  <span className="liras-kamar-detail__meta-value">
                    Maks. {room.max_tamu} Tamu
                  </span>
                </div>
              </div>
            </div>

            <p className="liras-kamar-detail__desc">{room.description}</p>

            <div className="liras-kamar-detail__price">
              <span className="liras-kamar-detail__price-label">
                Harga per malam
              </span>
              <span className="liras-kamar-detail__price-value">
                {formatPrice(room.harga)}
              </span>
            </div>

            <div className="liras-kamar-detail__actions">
              <Link href="/booking" className="liras-btn-book">
                Pesan Sekarang
              </Link>
              <Link href="/kamar" className="liras-kamar-detail__back">
                ← Kembali ke Daftar Kamar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
