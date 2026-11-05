import React from "react";
import { glossary } from "../content/world.js";
import "./Glossary.css";

export default function Glossary() {
  return (
    <section className="glossary" id="world" aria-labelledby="glossary-title">
      <div className="glossary__layout">
        <header className="glossary__heading" data-reveal>
          <p className="glossary__eyebrow">Dunia</p>
          <h2 id="glossary-title">Kata-kata yang dibawa angin</h2>
          <p className="glossary__lead">
            Delapan kata dari jalan menuju gunung. Buka satu, dan dengar maknanya.
          </p>
        </header>

        <div className="glossary__list">
          {glossary.map((entry, index) => (
            <details className="glossary__item" key={entry.id} name="kage-glossary">
              <summary className="glossary__summary">
                <span className="glossary__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="glossary__term">{entry.term}</h3>
                <span className="glossary__kanji" lang="ja" aria-hidden="true">
                  {entry.kanji}
                </span>
                <span className="glossary__marker" aria-hidden="true" />
              </summary>
              <div className="glossary__body">
                <p className="glossary__romaji">
                  <span lang="ja">{entry.kanji}</span>
                  <span className="glossary__sep" aria-hidden="true">
                    {" "}
                    ·{" "}
                  </span>
                  <i lang="ja-Latn">{entry.romaji}</i>
                </p>
                <p className="glossary__meaning">{entry.meaning}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
