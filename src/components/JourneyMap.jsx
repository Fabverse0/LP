import React, { useEffect, useRef } from "react";
import { journeyPath, waypoints } from "../content/world.js";
import "./JourneyMap.css";

const RIDGE =
  "M0 260 L90 210 L160 236 L260 150 L330 196 L420 120 L500 170 L600 80 L690 150 L780 60 L860 110 L940 40 L1000 70";

// Seberapa jauh (0..1) setiap titik berada di sepanjang jalur.
function measureStops(path) {
  const total = path.getTotalLength();
  const samples = 240;
  return waypoints.map((point) => {
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i <= samples; i += 1) {
      const at = path.getPointAtLength((total * i) / samples);
      const distance = (at.x - point.x) ** 2 + (at.y - point.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i / samples;
      }
    }
    return best;
  });
}

export default function JourneyMap() {
  const figure = useRef(null);
  const route = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const frame = figure.current;
    const path = route.current;
    if (!frame || !path) return undefined;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stops = measureStops(path);
    let ticking = false;
    let raf = 0;

    const paint = (progress) => {
      path.style.strokeDashoffset = String(1 - progress);
      points.current.forEach((node, index) => {
        node?.classList.toggle("is-reached", progress >= stops[index] - 0.002);
      });
    };

    const update = () => {
      ticking = false;
      if (motion.matches) {
        paint(1);
        return;
      }
      const rect = frame.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.85;
      const distance = rect.height + viewport * 0.35;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
      paint(progress);
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      raf = window.requestAnimationFrame(update);
    };

    frame.classList.add("is-scrubbed");
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    motion.addEventListener("change", request);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      motion.removeEventListener("change", request);
      frame.classList.remove("is-scrubbed");
      path.style.strokeDashoffset = "";
    };
  }, []);

  return (
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <div className="journey__layout">
        <header className="journey__heading" data-reveal>
          <p className="journey__eyebrow">Perjalanan</p>
          <h2 id="journey-title">Dari ladang ke celah gunung</h2>
          <p className="journey__lead">
            Lima bab, satu jalan. Garisnya mengikuti langkah yang belum selesai.
          </p>
        </header>

        <figure className="journey__map" ref={figure}>
          <svg
            className="journey__svg"
            viewBox="0 0 1000 600"
            role="img"
            aria-labelledby="journey-map-title"
            preserveAspectRatio="xMidYMid meet"
          >
            <title id="journey-map-title">
              Peta jalur Kage dari ladang, melewati persimpangan, jalan sungai, dan jembatan, menuju celah
              gunung.
            </title>
            <path className="journey__ridge" d={RIDGE} />
            <path className="journey__route-ghost" d={journeyPath} pathLength="1" />
            <path className="journey__route" d={journeyPath} pathLength="1" ref={route} />
            {waypoints.map((point, index) => (
              <g
                key={point.id}
                ref={(node) => {
                  points.current[index] = node;
                }}
                className={`journey__point${point.released ? "" : " journey__point--soon"}`}
                transform={`translate(${point.x} ${point.y})`}
                aria-hidden="true"
              >
                <circle className="journey__dot" r="11" />
                <text className="journey__num" y="-26" textAnchor="middle">
                  {String(point.chapter).padStart(2, "0")}
                </text>
                <text className="journey__label" y="44" textAnchor="middle">
                  {point.place}
                </text>
              </g>
            ))}
          </svg>
        </figure>

        <ol className="journey__legend">
          {waypoints.map((point) => (
            <li
              key={point.id}
              className={`journey__stop${point.released ? "" : " journey__stop--soon"}`}
            >
              <span className="journey__stop-num" aria-hidden="true">
                {String(point.chapter).padStart(2, "0")}
              </span>
              <h3 className="journey__stop-place">
                <span className="journey__sr">Bab {point.chapter}: </span>
                {point.place}
              </h3>
              <p className="journey__stop-title">{point.title}</p>
              <p className="journey__stop-note">{point.note}</p>
              {!point.released && <span className="journey__badge">Segera</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
