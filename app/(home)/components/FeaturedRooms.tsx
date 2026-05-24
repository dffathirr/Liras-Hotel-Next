"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  id: number;
  jenis_bed: string;
  harga: number;
  max_tamu: number;
};

const displayData = [
  {
    name: "Kamar Deluxe",
    size: "32 m²",
    image: "/assets/images/kamar1.jpg",
    description: "Kamar nyaman dengan sentuhan modern dan pemandangan kota yang indah. Dilengkapi fasilitas lengkap untuk menunjang istirahat Anda.",
  },
  {
    name: "Kamar Superior",
    size: "40 m²",
    image: "/assets/images/kamar2.jpg",
    description: "Ruang yang lebih luas dengan balkon pribadi dan bathtub premium. Cocok untuk pasangan yang menginginkan suasana romantis.",
  },
  {
    name: "Kamar Suite",
    size: "65 m²",
    image: "/assets/images/kamar3.jpg",
    description: "Suite mewah dengan ruang tamu terpisah dan pemandangan panoramik kota. Pengalaman menginap yang sesungguhnya.",
  },
  {
    name: "Suite Presiden",
    size: "120 m²",
    image: "/assets/images/kamar4.jpg",
    description: "Pilihan terbaik kami dengan dua kamar tidur, jacuzzi, dan layanan butler pribadi 24 jam penuh.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/kamar")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data kamar");
        return res.json();
      })
      .then((data: Room[]) => setRooms(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setActive((i) => (i === 0 ? rooms.length - 1 : i - 1));
  const next = () => setActive((i) => (i === rooms.length - 1 ? 0 : i + 1));

  if (loading) {
    return (
      <section className="liras-rooms">
        <div className="container">
          <div className="liras-rooms__loading">Memuat kamar...</div>
        </div>
      </section>
    );
  }

  if (error || rooms.length === 0) {
    return (
      <section className="liras-rooms">
        <div className="container">
          <div className="liras-rooms__loading">
            {error ?? "Tidak ada data kamar."}
          </div>
        </div>
      </section>
    );
  }

  const room = rooms[active];
  const display = displayData[active] ?? displayData[0];

  return (
    <section className="liras-rooms">
      <div className="container">
        <div className="liras-section-header">
          <p className="liras-section-eyebrow">Kamar Kami</p>
          <h2 className="liras-section-title">Pilihan Kamar Kami</h2>
          <p className="liras-section-subtitle">
            Setiap kamar dirancang untuk memberikan kenyamanan maksimal dan
            pengalaman menginap yang tak terlupakan.
          </p>
        </div>

        <div className="liras-rooms__slider">
          <div className="liras-rooms__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={room.id}
              src={display.image}
              alt={display.name}
              className="liras-rooms__image"
            />
            <div className="liras-rooms__image-badge">
              {formatPrice(room.harga)}
              <span>/malam</span>
            </div>
          </div>

          <div className="liras-rooms__info">
            <div className="liras-rooms__counter">
              <span className="liras-rooms__counter-current">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="liras-rooms__counter-sep"> / </span>
              <span className="liras-rooms__counter-total">
                {String(rooms.length).padStart(2, "0")}
              </span>
            </div>

            <h3 className="liras-rooms__name">{display.name}</h3>

            <div className="liras-rooms__meta">
              <span>
                <i className="ri-expand-diagonal-line" /> {display.size}
              </span>
              <span>
                <i className="ri-user-line" /> Maks. {room.max_tamu} Tamu
              </span>
              <span>
                <i className="ri-hotel-bed-line" /> {room.jenis_bed}
              </span>
            </div>

            <p className="liras-rooms__desc">{display.description}</p>

            <div className="liras-rooms__actions">
              <Link href={`/kamar/${room.id}`} className="liras-btn-book">
                Lihat Detail
              </Link>
              <div className="liras-rooms__nav">
                <button
                  onClick={prev}
                  aria-label="Previous room"
                  className="liras-rooms__nav-btn"
                >
                  <i className="fa-solid fa-arrow-left" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next room"
                  className="liras-rooms__nav-btn"
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="liras-rooms__dots">
          {rooms.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Room ${i + 1}`}
              className={`liras-rooms__dot${i === active ? " active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
