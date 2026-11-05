import React, { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const RONIN = "/images/kage-ronin-4k.webp";
const LANDSCAPE = "/images/kage-landscape-4k.webp";

// Each frame is a crop of one of the two 4K plates. `focus` is the point of the
// plate that should sit in the frame (object-position) and `zoom` scales around it.
// Both plates carry letterbox bars, so every crop zooms at least enough to lose them.
export const frames = [
  {
    id: "matahari",
    src: RONIN,
    focus: "49.5% 44%",
    zoom: 2.1,
    aspect: "3 / 4",
    caption: "Matahari turun pelan, seperti tak ingin melihat akhir hari.",
    label: "Matahari",
  },
  {
    id: "ronin",
    src: RONIN,
    focus: "48.6% 62%",
    zoom: 2.7,
    aspect: "4 / 5",
    caption: "Ia berjalan tanpa menoleh. Pedangnya diam di sisi.",
    label: "Ronin",
  },
  {
    id: "rumput",
    src: LANDSCAPE,
    focus: "22% 78%",
    zoom: 2.2,
    aspect: "21 / 9",
    caption: "Rumput menyimpan sisa cahaya terakhir.",
    label: "Rumput",
  },
  {
    id: "gunung",
    src: LANDSCAPE,
    focus: "58% 58%",
    zoom: 2.4,
    aspect: "16 / 10",
    caption: "Gunung itu sudah ada sebelum ia lahir, dan tetap ada sesudahnya.",
    label: "Gunung",
  },
  {
    id: "jalan",
    src: LANDSCAPE,
    focus: "48% 84%",
    zoom: 2.6,
    aspect: "1 / 1",
    caption: "Jalan setapak yang hanya terlihat oleh yang pernah lewat.",
    label: "Jalan",
  },
  {
    id: "bentang",
    src: RONIN,
    focus: "50% 50%",
    zoom: 1.14,
    aspect: "16 / 9",
    caption: "Satu sosok, satu matahari, satu ladang yang luas.",
    label: "Bentang",
  },
  {
    id: "langit",
    src: LANDSCAPE,
    focus: "16% 26%",
    zoom: 2.2,
    aspect: "3 / 2",
    caption: "Langit merah, tanpa satu burung pun.",
    label: "Langit",
  },
];

export const frameNumber = (index) => String(index + 1).padStart(2, "0");

export function FrameImage({ frame, className, loading = "lazy" }) {
  return (
    <img
      className={className}
      src={frame.src}
      alt=""
      width="3840"
      height="2160"
      loading={loading}
      decoding="async"
      style={{ "--gallery-focus": frame.focus, "--gallery-zoom": frame.zoom }}
    />
  );
}

const SWIPE_DISTANCE = 48;

const aspectRatio = (aspect) => {
  const [width, height] = aspect.split("/").map(Number);
  return width / height;
};

function Lightbox({ index, onNavigate, onClose, returnFocus }) {
  const dialog = useRef(null);
  const swipe = useRef(null);
  const isOpen = index !== null;
  const frame = isOpen ? frames[index] : null;

  useEffect(() => {
    if (!isOpen) return undefined;
    const element = dialog.current;
    // Safari does not focus buttons on click, so the opener is passed in explicitly.
    const trigger = returnFocus.current ?? document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();

    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  function step(direction) {
    onNavigate((index + direction + frames.length) % frames.length);
  }

  function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  }

  function onPointerDown(event) {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.4) {
      step(dx < 0 ? 1 : -1);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="gallery-lightbox"
      aria-labelledby="gallery-lightbox-caption"
      onKeyDown={onKeyDown}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {frame && (
        <div className="gallery-lightbox__body">
          <header className="gallery-lightbox__bar">
            <span className="gallery-lightbox__count">
              {frameNumber(index)} <span aria-hidden="true">/</span>
              <span className="gallery-lightbox__sr"> dari </span> {frameNumber(frames.length - 1)}
            </span>
            <button className="gallery-lightbox__close" type="button" onClick={onClose} autoFocus>
              Tutup
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" />
              </svg>
            </button>
          </header>

          <figure className="gallery-lightbox__figure">
            <div
              className="gallery-lightbox__frame"
              style={{ aspectRatio: frame.aspect, "--gallery-ratio": aspectRatio(frame.aspect) }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => { swipe.current = null; }}
            >
              <FrameImage
                key={frame.id}
                frame={frame}
                className="gallery__image gallery-lightbox__image"
                loading="eager"
              />
            </div>
            <figcaption id="gallery-lightbox-caption" className="gallery-lightbox__caption">
              <span className="gallery__number">{frame.label}</span>
              <span>{frame.caption}</span>
            </figcaption>
          </figure>

          <nav className="gallery-lightbox__nav" aria-label="Navigasi bingkai">
            <button type="button" className="gallery-lightbox__step" onClick={() => step(-1)}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" />
              </svg>
              Sebelumnya
            </button>
            <button type="button" className="gallery-lightbox__step" onClick={() => step(1)}>
              Berikutnya
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </dialog>
  );
}

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null);
  const opener = useRef(null);

  return (
    <section id="gallery" className="gallery" aria-labelledby="gallery-title">
      <div className="gallery__inner">
        <header className="gallery__header">
          <h2 id="gallery-title" className="gallery__title">Bingkai</h2>
          <p className="gallery__lead">
            Tujuh potongan dari satu senja. Dekati matahari, rumput, dan punggung
            seorang ronin yang tidak pernah menoleh.
          </p>
        </header>

        <ol className="gallery__grid">
          {frames.map((frame, index) => (
            <li
              key={frame.id}
              className={`gallery__item gallery__item--${frame.id}`}
            >
              <figure className="gallery__figure">
                <button
                  type="button"
                  className="gallery__frame"
                  style={{ aspectRatio: frame.aspect }}
                  aria-haspopup="dialog"
                  aria-label={`Buka bingkai ${frameNumber(index)}: ${frame.label}`}
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setOpenIndex(index);
                  }}
                >
                  <FrameImage frame={frame} className="gallery__image" />
                </button>
                <figcaption className="gallery__caption">
                  <span className="gallery__number">{frameNumber(index)}</span>
                  <span className="gallery__text">{frame.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <Lightbox
        index={openIndex}
        onNavigate={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        returnFocus={opener}
      />
    </section>
  );
}
