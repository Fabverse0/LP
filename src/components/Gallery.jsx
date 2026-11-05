import React from "react";
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

export default function Gallery() {
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
                <span className="gallery__frame" style={{ aspectRatio: frame.aspect }}>
                  <FrameImage frame={frame} className="gallery__image" />
                </span>
                <figcaption className="gallery__caption">
                  <span className="gallery__number">{frameNumber(index)}</span>
                  <span className="gallery__text">{frame.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
