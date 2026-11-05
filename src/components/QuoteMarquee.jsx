import React, { useState } from "react";
import { haiku, marqueeLines } from "../content/world.js";
import "./QuoteMarquee.css";

function Track() {
  return (
    <ul className="marquee__track">
      {marqueeLines.map((line) => (
        <li className="marquee__line" key={line}>
          {line}
          <span className="marquee__mark">影</span>
        </li>
      ))}
    </ul>
  );
}

export default function QuoteMarquee({ speed = 48 }) {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className={`marquee${paused ? " is-paused" : ""}`}
      aria-labelledby="marquee-title"
      style={{ "--marquee-duration": `${speed}s` }}
    >
      <h2 className="marquee__sr" id="marquee-title">
        {haiku.title}
      </h2>

      <blockquote className="marquee__sr">
        {haiku.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </blockquote>

      <div className="marquee__viewport" aria-hidden="true">
        <div className="marquee__belt">
          <Track />
          <Track />
        </div>
      </div>

      <button
        type="button"
        className="marquee__toggle"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "Putar pita" : "Jeda pita"}
      </button>
    </section>
  );
}
