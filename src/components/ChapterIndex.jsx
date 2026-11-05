import React, { useEffect, useState } from "react";
import {
  LAST_CHAPTER_EVENT,
  LAST_CHAPTER_KEY,
  availableChapters,
  chapters,
  getChapter,
  readLastChapterId,
  readingMinutes,
} from "../content/chapters.js";
import "./ChapterIndex.css";

const countWords = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh"];

function pad(number) {
  return String(number).padStart(2, "0");
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function useLastChapterId() {
  const [lastId, setLastId] = useState(null);

  useEffect(() => {
    setLastId(readLastChapterId());
    const sync = () => setLastId(readLastChapterId());
    const syncFromStorage = (event) => {
      if (event.key === null || event.key === LAST_CHAPTER_KEY) sync();
    };
    window.addEventListener(LAST_CHAPTER_EVENT, sync);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(LAST_CHAPTER_EVENT, sync);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  return lastId;
}

export default function ChapterIndex({ onOpen }) {
  const lastChapter = getChapter(useLastChapterId());
  const openWord = String(countWords[availableChapters.length] ?? availableChapters.length);
  const openCount = openWord[0].toUpperCase() + openWord.slice(1);

  return (
    <section className="chapter-index chapter" id="chapters" aria-labelledby="chapters-title">
      <div className="chapter-index__layout">
        <header className="chapter-index__header">
          <p className="chapter-index__eyebrow" data-reveal>
            Kage · {chapters.length} bab
          </p>
          <h2 className="chapter-index__title" id="chapters-title" data-reveal>
            Daftar bab
          </h2>
          <div className="chapter-index__aside">
            <p className="chapter-index__lead" data-reveal>
              Satu jalan, dibagi menjadi bab-bab pendek. {openCount} sudah
              terbuka. Sisanya masih di perjalanan.
            </p>
            {lastChapter && (
              <button
                className="chapter-index__resume"
                type="button"
                onClick={() => onOpen?.(lastChapter.id)}
              >
                <span>
                  Lanjutkan: <strong>{lastChapter.title}</strong>
                </span>
                <Arrow />
              </button>
            )}
          </div>
        </header>

        <ol className="chapter-index__list">
          {chapters.map((chapter) => {
            const available = chapter.status === "available";
            const content = (
              <>
                <span className="chapter-index__number">{pad(chapter.number)}</span>
                <span className="chapter-index__kanji" lang="ja" aria-hidden="true">
                  {chapter.kanji}
                </span>
                <span className="chapter-index__text">
                  <span className="chapter-index__name">{chapter.title}</span>
                  <span className="chapter-index__intro">{chapter.intro}</span>
                </span>
                <span className="chapter-index__meta">
                  {available ? `${readingMinutes(chapter)} menit baca` : "Segera"}
                </span>
                <span className="chapter-index__arrow">
                  <Arrow />
                </span>
              </>
            );

            return (
              <li className="chapter-index__item" key={chapter.id} data-reveal>
                {available ? (
                  <button
                    className="chapter-index__row"
                    type="button"
                    onClick={() => onOpen?.(chapter.id)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="chapter-index__row chapter-index__row--soon" aria-disabled="true">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
