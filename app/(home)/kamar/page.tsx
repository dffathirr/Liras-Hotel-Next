import { query } from '@/config/database';
import Link from 'next/link';
import { formatPrice } from '@/helpers/site';

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

export default async function KamarPage() {
  let rooms: Room[] = [];

  try {
    rooms = await query<Room[]>('SELECT * FROM kamar ORDER BY id ASC');
  } catch {
    rooms = [];
  }

  return (
    <section className="liras-kamar-list">
      <div className="container">

        <div className="liras-section-header">
          <p className="liras-section-eyebrow">Pilihan Kamar</p>
          <h1 className="liras-section-title">Temukan Kamar Impian Anda</h1>
          <p className="liras-section-subtitle">
            Setiap kamar dirancang untuk memberikan kenyamanan terbaik dan pengalaman menginap yang tak terlupakan.
          </p>
        </div>

        {rooms.length === 0 ? (
          <p className="liras-kamar-list__empty">Data kamar tidak tersedia saat ini.</p>
        ) : (
          <div className="liras-kamar-grid">
            {rooms.map((room) => {
              const display = displayData[room.id];
              if (!display) return null;
              return (
                <div key={room.id} className="liras-kamar-card">
                  <div className="liras-kamar-card__img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={display.image} alt={display.name} />
                    <div className="liras-kamar-card__badge">
                      {formatPrice(room.harga)}<span>/malam</span>
                    </div>
                  </div>
                  <div className="liras-kamar-card__body">
                    <h3 className="liras-kamar-card__name">{display.name}</h3>
                    <div className="liras-kamar-card__meta">
                      <span><i className="ri-expand-diagonal-line" /> {display.size}</span>
                      <span><i className="ri-user-line" /> Maks. {room.max_tamu} Tamu</span>
                      <span><i className="ri-hotel-bed-line" /> {room.jenis_bed}</span>
                    </div>
                    <p className="liras-kamar-card__desc">{display.description}</p>
                    <Link href={`/kamar/${room.id}`} className="liras-btn-book">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
