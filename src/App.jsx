import React, { useCallback, useEffect, useState } from "react";
import HeroScene from "./components/HeroScene.jsx";
import ChapterReader from "./components/ChapterReader.jsx";
import Characters from "./components/Characters.jsx";
import QuoteMarquee from "./components/QuoteMarquee.jsx";
import Glossary from "./components/Glossary.jsx";
import JourneyMap from "./components/JourneyMap.jsx";
import EmberField from "./components/EmberField.jsx";
import IntroCurtain from "./components/IntroCurtain.jsx";
import FilmGrain from "./components/FilmGrain.jsx";
import AmbientSound from "./components/AmbientSound.jsx";
import Gallery from "./components/Gallery.jsx";
import ChapterIndex from "./components/ChapterIndex.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Newsletter from "./components/Newsletter.jsx";
import KeyboardHelp from "./components/KeyboardHelp.jsx";
import { readLastChapterId } from "./content/chapters.js";

const artwork = "/images/kage-ronin-4k.webp";

const shortcuts = [
  { keys: ["R"], label: "Baca bab terakhir" },
  { keys: ["1"], label: "Suasana senja" },
  { keys: ["2"], label: "Suasana sisa bara" },
  { keys: ["3"], label: "Suasana malam" },
  { keys: ["←", "→"], label: "Bab sebelumnya / berikutnya di pembaca" },
  { keys: ["?"], label: "Tampilkan pintasan ini" },
];

const navLinks = [
  { href: "#story", label: "Kisah" },
  { href: "#chapters", label: "Bab" },
  { href: "#characters", label: "Tokoh" },
  { href: "#world", label: "Dunia" },
  { href: "#gallery", label: "Bingkai" },
];

const hours = [
  {
    id: "dusk",
    label: "Senja",
    description: "Merah terakhir masih tertahan di atas ladang.",
  },
  {
    id: "ember",
    label: "Sisa bara",
    description: "Bara di cakrawala membuat rumput tampak menyala.",
  },
  {
    id: "night",
    label: "Malam",
    description: "Langit mendingin. Jalan di depan berwarna biru.",
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

    // A jump (End key, anchor, fast fling) can carry an element past the
    // viewport without it ever intersecting. Reveal anything already above.
    let frame = 0;
    const revealPassed = () => {
      frame = 0;
      targets.forEach((target) => {
        if (!target.classList.contains("is-visible") && target.getBoundingClientRect().top < 0) {
          target.classList.add("is-visible");
          observer.unobserve(target);
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(revealPassed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
      page.classList.remove("has-js");
    };
  }, []);
}

const HOUR_KEY = "kage:hour";

function readStoredHour() {
  try {
    const stored = window.localStorage.getItem(HOUR_KEY);
    return hours.some((hour) => hour.id === stored) ? stored : "dusk";
  } catch {
    return "dusk";
  }
}

function usePersistentHour() {
  const [activeHour, setActiveHour] = useState(readStoredHour);

  useEffect(() => {
    try {
      window.localStorage.setItem(HOUR_KEY, activeHour);
    } catch {
      // Storage can be blocked; the choice simply lasts for this visit.
    }
  }, [activeHour]);

  return [activeHour, setActiveHour];
}

function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

function usePageShortcuts({ onHour, onRead, disabled }) {
  useEffect(() => {
    if (disabled) return undefined;

    function handleKey(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const hourIndex = ["1", "2", "3"].indexOf(event.key);
      if (hourIndex !== -1) {
        onHour(hours[hourIndex].id);
      } else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        onRead();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onHour, onRead, disabled]);
}

function HourWipe({ hour }) {
  const [wipe, setWipe] = useState(null);
  const firstHour = React.useRef(hour);

  useEffect(() => {
    if (hour === firstHour.current && wipe === null) return;
    setWipe((count) => (count ?? 0) + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour]);

  if (wipe === null) return null;
  return <span key={wipe} className="hour-wipe" aria-hidden="true" />;
}

function readIntroDelay() {
  try {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The intro curtain only plays once per session; time the title to its lift.
    return reduced || window.sessionStorage.getItem("kage:intro-seen") === "1" ? 150 : 1650;
  } catch {
    return 150;
  }
}

function SplitWord({ word, offset }) {
  return (
    <span className="split-word" aria-hidden="true">
      {[...word].map((letter, index) => (
        <span className="split-word__mask" key={`${letter}-${index}`}>
          <span className="split-word__letter" style={{ "--i": offset + index }}>
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

function ArrowMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
      <path d="M9 31 31 9M11 9h20v20" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function App() {
  const [activeHour, setActiveHour] = usePersistentHour();
  const [readerOpen, setReaderOpen] = useState(false);
  const selectedHour = hours.find((hour) => hour.id === activeHour) ?? hours[0];
  const [introDelay] = useState(readIntroDelay);
  const [readerChapter, setReaderChapter] = useState(undefined);
  const openReader = useCallback(() => {
    setReaderChapter(readLastChapterId() ?? undefined);
    setReaderOpen(true);
  }, []);
  const openChapter = useCallback((chapterId) => {
    setReaderChapter(chapterId);
    setReaderOpen(true);
  }, []);

  useSectionReveal();
  usePageShortcuts({
    onHour: setActiveHour,
    onRead: openReader,
    disabled: readerOpen,
  });

  return (
    <div className="site-shell" data-hour={activeHour}>
      <IntroCurtain />
      <ScrollProgress />
      <HourWipe hour={activeHour} />
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>

      <SiteHeader links={navLinks} onRead={openReader} readControls="chapter-reader" />

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <HeroScene />
          <EmberField hour={activeHour} />
          <div className="hero__copy">
            <h1
              className="hero__title hero__title--split"
              id="hero-title"
              aria-label="Sisa senja"
              style={{ "--intro-delay": `${introDelay}ms` }}
            >
              <SplitWord word="Sisa" offset={0} />
              <SplitWord word="senja" offset={4} />
            </h1>
            <p className="hero__description" data-reveal>
              Kisah fiktif seorang ronin di bawah matahari merah.
            </p>
            <div className="hero-hours" role="group" aria-label="Pilih suasana halaman">
              {hours.map((hour) => (
                <button
                  type="button"
                  key={hour.id}
                  aria-pressed={activeHour === hour.id}
                  onClick={() => setActiveHour(hour.id)}
                >
                  {hour.label}
                </button>
              ))}
            </div>
          </div>

          <nav className="folder-stack" aria-label="Bab cerita">
            <a className="folder folder--story" href="#story" data-reveal>
              <span className="folder__tab">Kisah</span>
              <span className="folder__label">Jalan tanpa tuan</span>
            </a>
            <a className="folder folder--hour" href="#hour" data-reveal>
              <span className="folder__tab">Suasana</span>
              <span className="folder__label">Ubah suasana</span>
            </a>
            <button
              className="folder folder--read"
              type="button"
              onClick={openReader}
              aria-haspopup="dialog"
              aria-controls="chapter-reader"
              data-reveal
            >
              <span className="folder__tab">Kage</span>
              <span className="folder__label">Masuki kisah</span>
              <span className="folder__action">Baca <ArrowMark /></span>
            </button>
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
              aria-label="Siluet ronin di antara rumput gelap, menghadap matahari merah."
              data-reveal
            >
              <img className="story__art-image" src={artwork} alt="" aria-hidden="true" />
            </div>

            <div className="story__narrative">
              <p data-reveal>
                Ia tiba di tepi ladang saat matahari tinggal merah di cakrawala. Rumput gelap
                menutup jejaknya, sementara gunung di depan perlahan larut ke dalam kabut.
              </p>
              <p data-reveal>
                Tak ada panji yang menunggu. Tak ada suara yang memanggilnya pulang. Yang tersisa
                hanya jalan di hadapan dan keputusan untuk terus melangkah.
              </p>
              <button
                className="story__read"
                type="button"
                onClick={() => openChapter("jalan-tanpa-tuan")}
                aria-haspopup="dialog"
                aria-controls="chapter-reader"
              >
                Baca bab pertama <ArrowMark />
              </button>
            </div>
            <p className="story__aside" data-reveal>
              Sosok kecil. Cakrawala yang luas.
            </p>
          </div>
        </section>

        <ChapterIndex onOpen={openChapter} />

        <section className="hour chapter" id="hour" aria-labelledby="hour-title">
          <div className="hour__layout">
            <div className="hour__copy">
              <h2 id="hour-title" data-reveal>
                Ubah suasana
              </h2>
              <p className="hour__lead" data-reveal>
                Pilih suasana untuk seluruh perjalanan.
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
                    onClick={() => setActiveHour(hour.id)}
                  >
                    <span className="hour-index__label">{hour.label}</span>
                    <img
                      className="hour-index__preview"
                      src={artwork}
                      alt=""
                      data-hour={hour.id}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="hour__visual" data-reveal>
              <figure className={`hour-preview hour-preview--${activeHour}`}>
                <img className="hour-preview__image" src={artwork} alt="" aria-hidden="true" />
                <span className="hour-preview__caption">{selectedHour.label}</span>
              </figure>
              <p className="hour__credit">Satu artwork, tiga suasana warna.</p>
            </div>
          </div>
        </section>

        <Characters />

        <QuoteMarquee />

        <Glossary />

        <JourneyMap />

        <Newsletter />

        <Gallery />

        <button
          className="closing-band"
          type="button"
          onClick={openReader}
          aria-label="Baca bab pertama: Jalan tanpa tuan"
          aria-haspopup="dialog"
          aria-controls="chapter-reader"
        >
          <span className="closing-band__note" data-reveal>
            Kembali ke jalan yang sama.
          </span>
          <span className="closing-band__arrow" data-reveal>
            <ArrowMark />
          </span>
          <img
            className="closing-band__still"
            src={artwork}
            alt="Cakrawala merah dan siluet ronin, dipotong lebih dekat."
            data-reveal
          />
          <span className="closing-band__word" data-text="Baca" data-reveal>
            <span className="closing-band__word-base">Baca</span>
            <span className="closing-band__slash" aria-hidden="true" />
          </span>
        </button>
      </main>

      <footer className="site-footer" id="ending">
        <div className="site-footer__top">
          <p className="site-footer__note" data-reveal>
            Kisah visual fiktif, dibangun dari satu gambar.
          </p>
          <img
            className="site-footer__still"
            src={artwork}
            alt=""
            aria-hidden="true"
            data-reveal
          />
          <nav className="footer-nav" aria-label="Navigasi penutup" data-reveal>
            <a href="#story">Kisah</a>
            <a href="#hour">Suasana</a>
            <a href="#top">Kembali ke atas</a>
          </nav>
        </div>
        <div className="site-footer__bottom">
          <h2 className="site-footer__wordmark" data-reveal>
            KAGE
          </h2>
          <a
            className="site-footer__return"
            href="#top"
            aria-label="Kembali ke awal halaman"
            data-reveal
          >
            <span>Kembali ke awal</span>
            <ArrowMark />
          </a>
        </div>
      </footer>
      <BackToTop />
      <KeyboardHelp shortcuts={shortcuts} />
      <FilmGrain />
      <AmbientSound />
      <ChapterReader
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        artwork={artwork}
        atmosphere={selectedHour.label}
        chapterId={readerChapter}
        onChapterChange={setReaderChapter}
      />
    </div>
  );
}

export default App;
