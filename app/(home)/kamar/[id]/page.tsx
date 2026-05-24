import { query } from '@/config/database';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Room = { id: number; jenis_bed: string; harga: number; max_tamu: number };

const displayData: Record<number, { name: string; size: string; image: string; description: string }> = {
  1: {
    name: 'Kamar Deluxe',
    size: '32 m²',
    image: '/assets/images/kamar1.jpg',
    description: 'Kamar nyaman dengan sentuhan modern dan pemandangan kota yang indah. Dilengkapi fasilitas lengkap untuk menunjang istirahat Anda.',
  },
  2: {
    name: 'Kamar Superior',
    size: '40 m²',
    image: '/assets/images/kamar2.jpg',
    description: 'Ruang yang lebih luas dengan balkon pribadi dan bathtub premium. Cocok untuk pasangan yang menginginkan suasana romantis.',
  },
  3: {
    name: 'Kamar Suite',
    size: '65 m²',
    image: '/assets/images/kamar3.jpg',
    description: 'Suite mewah dengan ruang tamu terpisah dan pemandangan panoramik kota. Pengalaman menginap yang sesungguhnya.',
  },
  4: {
    name: 'Suite Presiden',
    size: '120 m²',
    image: '/assets/images/kamar4.jpg',
    description: 'Pilihan terbaik kami dengan dua kamar tidur, jacuzzi, dan layanan butler pribadi 24 jam penuh.',
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

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
    const rows = await query<Room[]>('SELECT * FROM kamar WHERE id = ?', [numId]);
    room = rows[0] ?? null;
  } catch {
    room = null;
  }

  if (!room) notFound();

  const display = displayData[room.id];
  if (!display) notFound();

  return (
    <section className="liras-kamar-detail">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="liras-kamar-detail__breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/kamar">Kamar</Link>
          <span>/</span>
          <span>{display.name}</span>
        </nav>

        <div className="liras-kamar-detail__grid">

          {/* Image */}
          <div className="liras-kamar-detail__img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={display.image} alt={display.name} />
          </div>

          {/* Info */}
          <div className="liras-kamar-detail__info">
            <h1 className="liras-kamar-detail__name">{display.name}</h1>

            <div className="liras-kamar-detail__meta">
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-expand-diagonal-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">Luas</span>
                  <span className="liras-kamar-detail__meta-value">{display.size}</span>
                </div>
              </div>
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-hotel-bed-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">Tipe Tempat Tidur</span>
                  <span className="liras-kamar-detail__meta-value">{room.jenis_bed}</span>
                </div>
              </div>
              <div className="liras-kamar-detail__meta-item">
                <i className="ri-user-line" />
                <div>
                  <span className="liras-kamar-detail__meta-label">Kapasitas</span>
                  <span className="liras-kamar-detail__meta-value">Maks. {room.max_tamu} Tamu</span>
                </div>
              </div>
            </div>

            <p className="liras-kamar-detail__desc">{display.description}</p>

            <div className="liras-kamar-detail__price">
              <span className="liras-kamar-detail__price-label">Harga per malam</span>
              <span className="liras-kamar-detail__price-value">{formatPrice(room.harga)}</span>
            </div>

            <div className="liras-kamar-detail__actions">
              <Link href={`/booking?kamar_id=${room.id}`} className="liras-btn-book">
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
