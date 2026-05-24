export default function AboutSection() {
  return (
    <section className="liras-about">
      <div className="container">
        <div className="liras-about__grid">

          {/* Image block */}
          <div className="liras-about__images">
            <div className="liras-about__img-main">
              <img src="/assets/images/hotel.jpg" alt="Liras Hotel" />
            </div>
            <div className="liras-about__img-accent">
              <img src="/assets/images/receptionist.jpg" alt="Liras Hotel receptionist" />
            </div>
          </div>

          {/* Text block */}
          <div className="liras-about__body">
            <p className="liras-section-eyebrow">Tentang Kami</p>
            <h2 className="liras-section-title">
              Keanggunan & Kenyamanan<br />di Setiap Sudut
            </h2>
            <p className="liras-about__text">
              Liras Hotel & Resort berdiri sejak 2009 dengan satu misi sederhana —
              memberikan pengalaman menginap terbaik yang memadukan kehangataan
              lokal dengan standar layanan internasional.
            </p>
            <p className="liras-about__text">
              Berlokasi strategis di pusat kota, kami menawarkan lebih dari sekadar
              tempat bermalam. Restoran fine dining, spa kelas dunia, kolam renang
              infinity, dan tim yang selalu siap melayani 24 jam.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
