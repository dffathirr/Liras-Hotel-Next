export default function HeroSection() {
  return (
    <section className="liras-hero">
      {/* Background image */}
      <div className="liras-hero__bg" aria-hidden="true" />

      {/* Dark overlay */}
      <div className="liras-hero__overlay" aria-hidden="true" />

      {/* Content */}
      <div className="liras-hero__content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <p className="liras-hero__eyebrow">Selamat Datang di Liras Hotel</p>

              <h1 className="liras-hero__title">
                Tempat di Mana Setiap
                <br />
                Momen Jadi <em>Kenangan</em>
              </h1>

              <p className="liras-hero__subtitle">
                Nikmati pengalaman menginap terbaik di jantung kota —
                dengan layanan hangat dan fasilitas kelas dunia.
              </p>
            </div>
          </div>

          {/* Booking Bar */}
          {/* <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="liras-booking-bar">
                ...
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className="liras-hero__scroll" aria-hidden="true">
        <div className="liras-hero__scroll-line" />
        <span>Scroll</span>
      </div> */}
    </section>
  );
}
