import React, { useEffect, useRef } from "react";
import "./Storyboard.css";

const PANELS = [
  {
    id: "ladang",
    title: "Ladang",
    kicker: "Bab 1 · Jalan tanpa tuan",
    line: "Rumput menutup bekas langkah. Matahari tinggal merah.",
    tone: "blue",
    image: {
      src: "/images/kage-ronin-4k.webp",
      alt: "Siluet ronin berdiri di rumput gelap di depan matahari merah.",
      position: "50% 62%",
    },
  },
  {
    id: "gerobak",
    title: "Gerobak",
    kicker: "Bab 1 · Roda di lumpur",
    line: "Sebuah roda tersangkut di lumpur. Untuk pertama kali, ia berhenti.",
    tone: "red",
    image: {
      src: "/images/kage-landscape-4k.webp",
      alt: "Jalan tanah turun dari ladang menuju pepohonan.",
      position: "24% 78%",
    },
  },
  {
    id: "sungai",
    title: "Sungai",
    kicker: "Bab 2 · Sungai yang sama",
    line: "Jembatan sudah dirobohkan. Mereka menyeberang di air setinggi lutut.",
    tone: "night",
    image: {
      src: "/images/kage-landscape-4k.webp",
      alt: "Lembah gelap di bawah langit senja.",
      position: "74% 88%",
    },
  },
  {
    id: "kain",
    title: "Kain tanpa lambang",
    kicker: "Bab 3 · Kain tanpa lambang",
    line: "Bekas jahitan membentuk lingkaran kosong. Ia tidak mau membawanya lagi.",
    tone: "paper",
    image: {
      src: "/images/kage-ronin-layer.webp",
      alt: "Siluet ronin tanpa latar, hanya bayangan.",
      position: "50% 58%",
    },
  },
  {
    id: "celah",
    title: "Celah gunung",
    kicker: "Bab 5 · Segera",
    line: "Jalan yang ditinggalkan kemarin masih menunggu jawabannya.",
    tone: "ember",
    image: {
      src: "/images/kage-landscape-4k.webp",
      alt: "Matahari merah besar di atas punggung gunung.",
      position: "50% 28%",
    },
  },
];

export default function Storyboard() {
  const section = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return undefined;

    // Rel horizontal hanya di layar lebar dan bila gerak tidak dikurangi.
    const query = window.matchMedia("(min-width: 680px) and (prefers-reduced-motion: no-preference)");
    let distance = 0;
    let raf = 0;
    let ticking = false;
    let listening = false;
    let visible = false;
    let pinned = false;

    let lastX = null;
    let speed = 0;

    const items = () => Array.from(rail.querySelectorAll(".storyboard__item"));

    const measure = () => {
      const width = window.innerWidth;
      distance = Math.max(0, rail.scrollWidth - width);
      root.style.height = `${Math.round(distance + window.innerHeight)}px`;
      // --o: posisi rel saat panel tepat di tengah layar (untuk paralaks dalam CSS).
      items().forEach((item) => {
        const center = item.offsetLeft - (width - item.offsetWidth) / 2;
        item.style.setProperty("--o", center.toFixed(1));
      });
    };

    const update = () => {
      ticking = false;
      const top = root.getBoundingClientRect().top;
      const x = Math.min(distance, Math.max(0, -top));

      // Kecepatan dihaluskan lalu dijepit ke -1..1 untuk miring/skala panel.
      speed = speed * 0.82 + (lastX === null ? 0 : x - lastX) * 0.18;
      lastX = x;
      if (Math.abs(speed) < 0.02) speed = 0;
      const velocity = Math.max(-1, Math.min(1, speed / 40));

      root.style.setProperty("--x", x.toFixed(1));
      root.style.setProperty("--p", distance > 0 ? (x / distance).toFixed(4) : "0");
      root.style.setProperty("--v", velocity.toFixed(3));
      root.style.setProperty("--va", Math.abs(velocity).toFixed(3));

      // Biarkan miring meluruh kembali ke nol setelah gulir berhenti.
      if (speed !== 0 && listening) request();
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      raf = window.requestAnimationFrame(update);
    };

    const resize = () => {
      measure();
      request();
    };

    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", request, { passive: true });
        request();
      } else {
        window.removeEventListener("scroll", request);
        window.cancelAnimationFrame(raf);
        ticking = false;
      }
    };

    const setPinned = (on) => {
      if (on === pinned) return;
      pinned = on;
      root.classList.toggle("is-pinned", on);
      if (on) {
        window.addEventListener("resize", resize);
        measure();
        update();
        listen(visible);
      } else {
        window.removeEventListener("resize", resize);
        listen(false);
        root.style.removeProperty("height");
        ["--x", "--p", "--v", "--va"].forEach((name) => root.style.removeProperty(name));
        items().forEach((item) => item.style.removeProperty("--o"));
        lastX = null;
        speed = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!pinned) return;
        listen(visible);
        if (!visible) update();
      },
      { rootMargin: "20% 0px" },
    );

    const applyQuery = () => setPinned(query.matches);

    observer.observe(root);
    applyQuery();
    query.addEventListener("change", applyQuery);

    return () => {
      observer.disconnect();
      query.removeEventListener("change", applyQuery);
      setPinned(false);
    };
  }, []);

  return (
    <section className="storyboard" id="storyboard" ref={section} aria-labelledby="storyboard-title">
      <div className="storyboard__stage">
        <div className="storyboard__track" ref={track}>
          <header className="storyboard__intro">
            <p className="storyboard__eyebrow">Papan cerita</p>
            <h2 className="storyboard__heading" id="storyboard-title">
              Lima adegan, satu jalan
            </h2>
            <p className="storyboard__hint" aria-hidden="true">
              <span>Gulir</span>
              <svg className="storyboard__arrow" viewBox="0 0 64 24" focusable="false">
                <path d="M0 12 H60 M48 2 L62 12 L48 22" />
              </svg>
            </p>
          </header>

          <ol className="storyboard__list">
            {PANELS.map((panel, index) => (
              <li key={panel.id} className="storyboard__item">
                <article
                  className={`storyboard__panel storyboard__panel--${panel.tone}`}
                  aria-labelledby={`storyboard-${panel.id}`}
                >
                  <span className="storyboard__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="storyboard__copy">
                    <p className="storyboard__kicker">{panel.kicker}</p>
                    <h3 className="storyboard__title" id={`storyboard-${panel.id}`}>
                      {panel.title}
                    </h3>
                    <p className="storyboard__line">{panel.line}</p>
                  </div>
                  <figure className="storyboard__art">
                    <img
                      className="storyboard__img"
                      src={panel.image.src}
                      alt={panel.image.alt}
                      style={{ objectPosition: panel.image.position }}
                      width="3840"
                      height="2160"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <div className="storyboard__meter" aria-hidden="true" />
      </div>
    </section>
  );
}
