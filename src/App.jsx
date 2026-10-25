import React, { useEffect, useState } from "react";

const artwork = "/images/kage-ronin.jpg";

const hours = [
  {
    id: "dusk",
    label: "Senja",
    description: "Warna asli dari artwork yang diberikan.",
  },
  {
    id: "ember",
    label: "Sisa bara",
    description: "Merah bertahan lebih lama di atas ladang.",
  },
  {
    id: "night",
    label: "Malam",
    description: "Cakrawala berubah dingin, sosoknya tetap terlihat.",
  },
];

function useSectionReveal() {
  useEffect(() => {
    const page = document.documentElement;
    const targets = [...document.querySelectorAll("[data-reveal]")];
    page.classList.add("has-js");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return () => page.classList.remove("has-js");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -4% 0px" },
    );

    targets.forEach((target, index) => {
      target.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      page.classList.remove("has-js");
    };
  }, []);
}

function ArrowMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
      <path d="M9 31 31 9M11 9h20v20" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function App() {
  const [activeHour, setActiveHour] = useState("dusk");
  const selectedHour = hours.find((hour) => hour.id === activeHour) ?? hours[0];

  useSectionReveal();

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kage, kembali ke awal">
          Kage
        </a>
        <nav className="top-nav" aria-label="Navigasi utama">
          <a href="#story">Kisah</a>
          <a href="#hour">Suasana</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div
            className="hero__art"
            role="img"
            aria-label="Seorang ronin berdiri di tengah ladang gelap, menghadap matahari merah di balik gunung."
          />
          <div className="hero__copy">
            <h1 className="hero__title" id="hero-title" data-reveal>
              <span>Sisa</span>
              <span>senja</span>
            </h1>
            <p className="hero__description" data-reveal>
              Kisah visual fiktif tentang seorang ronin di bawah matahari merah.
            </p>
          </div>

          <nav className="folder-stack" aria-label="Bab cerita">
            <a className="folder folder--story" href="#story" data-reveal>
              <span className="folder__tab">Kisah</span>
              <span className="folder__label">Jalan tanpa tuan</span>
              <span className="folder__hint">Buka bab</span>
            </a>
            <a className="folder folder--hour" href="#hour" data-reveal>
              <span className="folder__tab">Suasana</span>
              <span className="folder__label">Ubah suasana</span>
              <span className="folder__hint">Pilih waktu</span>
            </a>
            <a className="folder folder--read" href="#story" data-reveal>
              <span className="folder__tab">Kage</span>
              <span className="folder__label">Masuki kisah</span>
              <span className="folder__action">Baca <ArrowMark /></span>
            </a>
          </nav>
        </section>

        <section className="story chapter" id="story" aria-labelledby="story-title">
          <div className="story__layout">
            <div className="story__heading">
              <h2 id="story-title" data-reveal>
                Jalan tanpa tuan
              </h2>
              <p className="story__lead" data-reveal>
                Senja menyisakan satu jalan di hadapan seorang ronin.
              </p>
            </div>

            <div
              className="story__art"
              role="img"
              aria-label="Potongan artwork memperlihatkan siluet ronin dan rumput merah di bawah matahari senja."
              data-reveal
            />

            <div className="story__narrative">
              <p data-reveal>
                Ia tiba di tepi ladang saat matahari tinggal merah di cakrawala. Rumput gelap
                menutup jejaknya, sementara gunung di depan perlahan larut ke dalam kabut.
              </p>
              <p data-reveal>
                Tak ada panji yang menunggu. Tak ada suara yang memanggilnya pulang. Yang tersisa
                hanya jalan di hadapan dan keputusan untuk terus melangkah.
              </p>
            </div>
            <p className="story__aside" data-reveal>
              Sosok kecil. Cakrawala yang luas.
            </p>
          </div>
        </section>

        <section className="hour chapter" id="hour" aria-labelledby="hour-title">
          <div className="hour__layout">
            <div className="hour__copy">
              <h2 id="hour-title" data-reveal>
                Ubah suasana
              </h2>
              <p className="hour__lead" data-reveal>
                Lihat artwork yang sama pada jam yang berbeda.
              </p>
              <p className="hour__detail" aria-live="polite" aria-atomic="true">
                {selectedHour.description}
              </p>

              <div className="hour-index" role="group" aria-label="Pilih waktu pada adegan">
                {hours.map((hour) => (
                  <button
                    className={`hour-index__item${activeHour === hour.id ? " is-active" : ""}`}
                    type="button"
                    aria-pressed={activeHour === hour.id}
                    key={hour.id}
                    onPointerEnter={() => setActiveHour(hour.id)}
                    onFocus={() => setActiveHour(hour.id)}
                    onClick={() => setActiveHour(hour.id)}
                  >
                    <span className="hour-index__label">{hour.label}</span>
                    <span className="hour-index__preview" data-hour={hour.id} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="hour__visual" data-reveal>
              <div
                className={`hour-preview hour-preview--${activeHour}`}
                role="img"
                aria-label={`Preview artwork pada suasana ${selectedHour.label.toLowerCase()}.`}
              >
                <span className="hour-preview__caption">{selectedHour.label}</span>
              </div>
              <p className="hour__credit">Satu artwork, tiga suasana warna.</p>
            </div>
          </div>
        </section>

        <a className="closing-band" href="#story" aria-label="Baca kembali kisah Kage">
          <span className="closing-band__note">Kembali ke jalan yang sama.</span>
          <span className="closing-band__arrow">
            <ArrowMark />
          </span>
          <h2 className="closing-band__word">Baca</h2>
        </a>
      </main>

      <footer className="site-footer" id="ending">
        <div className="site-footer__top">
          <p className="site-footer__note">Kisah visual fiktif, dibangun dari satu gambar.</p>
          <nav className="footer-nav" aria-label="Navigasi penutup">
            <a href="#story">Kisah</a>
            <a href="#hour">Suasana</a>
            <a href="#top">Kembali ke atas</a>
          </nav>
        </div>
        <div className="site-footer__bottom">
          <h2 className="site-footer__wordmark">KAGE</h2>
          <a className="site-footer__return" href="#top" aria-label="Kembali ke awal halaman">
            <span>Kembali ke awal</span>
            <ArrowMark />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
