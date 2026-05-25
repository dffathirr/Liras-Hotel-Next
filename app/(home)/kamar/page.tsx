import { query } from "@/config/database";
import Link from "next/link";
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

export default async function KamarPage() {
  let rooms: Room[] = [];

  try {
    rooms = await query<Room[]>(`
      SELECT MIN(id) AS id, ANY_VALUE(nama) AS nama, jenis_bed,
             ANY_VALUE(size) AS size, ANY_VALUE(harga) AS harga,
             ANY_VALUE(max_tamu) AS max_tamu, ANY_VALUE(description) AS description
      FROM kamar
      GROUP BY jenis_bed
      ORDER BY MIN(id) ASC
    `);
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
            Setiap kamar dirancang untuk memberikan kenyamanan terbaik dan
            pengalaman menginap yang tak terlupakan.
          </p>
        </div>

        {rooms.length === 0 ? (
          <p className="liras-kamar-list__empty">
            Data kamar tidak tersedia saat ini.
          </p>
        ) : (
          <div className="liras-kamar-grid">
            {rooms.map((room, index) => (
              <div key={room.id} className="liras-kamar-card">
                <div className="liras-kamar-card__img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fixImage[index % fixImage.length]}
                    alt={room.nama}
                  />
                  <div className="liras-kamar-card__badge">
                    {formatPrice(room.harga)}
                    <span>/malam</span>
                  </div>
                </div>
                <div className="liras-kamar-card__body">
                  <h3 className="liras-kamar-card__name">{room.nama}</h3>
                  <div className="liras-kamar-card__meta">
                    <span>
                      <i className="ri-expand-diagonal-line" /> {room.size}
                    </span>
                    <span>
                      <i className="ri-user-line" /> Maks. {room.max_tamu} Tamu
                    </span>
                    <span>
                      <i className="ri-hotel-bed-line" /> {room.jenis_bed}
                    </span>
                  </div>
                  <p className="liras-kamar-card__desc">{room.description}</p>
                  <Link href={`/kamar/${room.id}`} className="liras-btn-book">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
