"use client";

import { useEffect, useState } from "react";
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
              src={fixImage[active % fixImage.length]}
              alt={room.nama}
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

            <h3 className="liras-rooms__name">{room.nama}</h3>

            <div className="liras-rooms__meta">
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

            <p className="liras-rooms__desc">{room.description}</p>

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
