import React from "react";
import { journeyPath, waypoints } from "../content/world.js";
import "./JourneyMap.css";

const RIDGE =
  "M0 260 L90 210 L160 236 L260 150 L330 196 L420 120 L500 170 L600 80 L690 150 L780 60 L860 110 L940 40 L1000 70";

export default function JourneyMap() {
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

        <figure className="journey__map">
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
            <path className="journey__route" d={journeyPath} pathLength="1" />
            {waypoints.map((point) => (
              <g
                key={point.id}
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
