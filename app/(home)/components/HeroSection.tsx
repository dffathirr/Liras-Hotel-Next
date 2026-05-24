import Link from 'next/link';

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
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="liras-booking-bar">
                <div className="liras-booking-bar__field">
                  <label htmlFor="checkin" className="liras-booking-bar__label">
                    Check-in
                  </label>
                  <input
                    type="date"
                    id="checkin"
                    className="liras-booking-bar__input"
                  />
                </div>

                <div className="liras-booking-bar__divider" aria-hidden="true" />

                <div className="liras-booking-bar__field">
                  <label htmlFor="checkout" className="liras-booking-bar__label">
                    Check-out
                  </label>
                  <input
                    type="date"
                    id="checkout"
                    className="liras-booking-bar__input"
                  />
                </div>

                <div className="liras-booking-bar__divider" aria-hidden="true" />

                <div className="liras-booking-bar__field">
                  <label htmlFor="guests" className="liras-booking-bar__label">
                    Tamu
                  </label>
                  <select id="guests" className="liras-booking-bar__input">
                    <option value="1">1 Tamu</option>
                    <option value="2">2 Tamu</option>
                    <option value="3">3 Tamu</option>
                    <option value="4">4 Tamu</option>
                    <option value="5">5+ Tamu</option>
                  </select>
                </div>

                <div className="liras-booking-bar__divider" aria-hidden="true" />

                <div className="liras-booking-bar__field">
                  <label htmlFor="room-type" className="liras-booking-bar__label">
                    Tipe Kamar
                  </label>
                  <select id="room-type" className="liras-booking-bar__input">
                    <option value="">Semua Tipe</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </div>

                <Link href="/booking" className="liras-booking-bar__btn">
                  Cari Kamar
                </Link>
              </div>
            </div>
          </div>
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
