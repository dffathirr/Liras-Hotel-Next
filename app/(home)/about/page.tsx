export default function AboutPage() {
  return (
    <div className="liras-page-about">
      {/* ── Page header ── */}
      <section className="liras-about-page__header">
        <div className="container">
          <p className="liras-section-eyebrow">Liras Hotel &amp; Resort</p>
          <h1 className="liras-about-page__title">Tentang Kami</h1>
          <p className="liras-about-page__lead">
            Lebih dari sekadar hotel — kami adalah rumah kedua bagi setiap tamu
            yang melangkah masuk.
          </p>
        </div>
      </section>

      {/* ── Cerita kami ── */}
      <section className="liras-about-page__story">
        <div className="container">
          <div className="liras-about__grid">
            {/* Gambar */}
            <div className="liras-about__images">
              <div className="liras-about__img-main">
                <img src="/assets/images/hotel.jpg" alt="Liras Hotel" />
              </div>
              <div className="liras-about__img-accent">
                <img
                  src="/assets/images/receptionist.jpg"
                  alt="Staf Liras Hotel"
                />
              </div>
            </div>

            {/* Teks */}
            <div className="liras-about__body">
              <p className="liras-section-eyebrow">Cerita Kami</p>
              <h2 className="liras-section-title">
                Keanggunan &amp; Kenyamanan
                <br />
                di Setiap Sudut
              </h2>
              <p className="liras-about__text">
                Liras Hotel &amp; Resort berdiri sejak 2009 dengan satu misi
                sederhana — memberikan pengalaman menginap terbaik yang
                memadukan kehangatan lokal dengan standar layanan internasional.
              </p>
              <p className="liras-about__text">
                Berlokasi strategis di pusat kota, kami menawarkan lebih dari
                sekadar tempat bermalam. Restoran fine dining, spa kelas dunia,
                kolam renang infinity, dan tim yang selalu siap melayani 24 jam
                penuh.
              </p>
              <p className="liras-about__text">
                Setiap detail dirancang dengan penuh perhatian — dari dekorasi
                kamar hingga alunan musik di lobi — agar setiap tamu merasa
                dihargai dan diistimewakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nilai kami ── */}
      <section className="liras-about-page__values">
        <div className="container">
          <div className="liras-section-header">
            <p className="liras-section-eyebrow">Nilai Kami</p>
            <h2 className="liras-section-title">Mengapa Memilih Liras?</h2>
          </div>

          <div className="liras-about-page__values-grid">
            <div className="liras-about-page__value-card">
              <div className="liras-about-page__value-icon">
                <i className="fa-solid fa-heart" />
              </div>
              <h3>Pelayanan Sepenuh Hati</h3>
              <p>
                Tim kami terlatih untuk memberikan layanan personal yang hangat,
                memastikan setiap kebutuhan tamu terpenuhi dengan senyum.
              </p>
            </div>

            <div className="liras-about-page__value-card">
              <div className="liras-about-page__value-icon">
                <i className="fa-solid fa-award" />
              </div>
              <h3>Standar Kualitas Tinggi</h3>
              <p>
                Fasilitas kami dipelihara sesuai standar internasional, dari
                kebersihan kamar hingga kualitas bahan makanan di restoran kami.
              </p>
            </div>

            <div className="liras-about-page__value-card">
              <div className="liras-about-page__value-icon">
                <i className="fa-solid fa-map-location-dot" />
              </div>
              <h3>Lokasi Strategis</h3>
              <p>
                Terletak di jantung kota, kami memberi akses mudah ke pusat
                bisnis, pusat perbelanjaan, dan destinasi wisata utama.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
