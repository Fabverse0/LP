import React, { useState } from "react";
import { characters } from "../content/world.js";
import "./Characters.css";

export default function Characters() {
  const [activeId, setActiveId] = useState(characters[0].id);

  return (
    <section className="characters" id="characters" aria-labelledby="characters-title">
      <div className="characters__layout">
        <header className="characters__heading" data-reveal>
          <p className="characters__eyebrow">Tokoh</p>
          <h2 id="characters-title">Empat orang di satu jalan</h2>
        </header>

        <div className="characters__list" role="tablist" aria-label="Pilih tokoh" aria-orientation="vertical">
          {characters.map((person, index) => {
            const selected = person.id === activeId;
            return (
              <button
                key={person.id}
                type="button"
                role="tab"
                id={`character-tab-${person.id}`}
                aria-selected={selected}
                aria-controls={`character-panel-${person.id}`}
                tabIndex={selected ? 0 : -1}
                className={`characters__tab${selected ? " is-active" : ""}`}
                onClick={() => setActiveId(person.id)}
              >
                <span className="characters__tab-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="characters__tab-name">{person.name}</span>
                <span className="characters__tab-kanji" lang="ja" aria-hidden="true">
                  {person.kanji}
                </span>
              </button>
            );
          })}
        </div>

        <div className="characters__stage">
          {characters.map((person) => {
            const selected = person.id === activeId;
            return (
              <article
                key={person.id}
                role="tabpanel"
                id={`character-panel-${person.id}`}
                aria-labelledby={`character-tab-${person.id}`}
                inert={!selected}
                tabIndex={selected ? 0 : -1}
                className={`characters__panel${selected ? " is-active" : ""}`}
              >
                <figure className="characters__portrait">
                  <img
                    className="characters__image"
                    src={person.image.src}
                    alt={person.image.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: person.image.position }}
                  />
                  <span className="characters__kanji" lang="ja" aria-hidden="true">
                    {person.kanji}
                  </span>
                </figure>
                <div className="characters__copy">
                  <p className="characters__role">
                    {person.role} <span lang="ja">· {person.reading}</span>
                  </p>
                  <h3 className="characters__name">{person.name}</h3>
                  {person.bio.map((line) => (
                    <p className="characters__bio" key={line}>
                      {line}
                    </p>
                  ))}
                  <blockquote className="characters__quote">
                    <p>“{person.quote}”</p>
                  </blockquote>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
