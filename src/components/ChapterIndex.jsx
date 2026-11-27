import React, { useEffect, useState } from "react";
import {
  LAST_CHAPTER_EVENT,
  LAST_CHAPTER_KEY,
  availableChapters,
  chapters,
  getChapter,
  readChapterIds,
  READ_EVENT,
  readLastChapterId,
  readScroll,
  resetReading,
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

function useReadIds() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const sync = () => setIds(readChapterIds());
    sync();
    window.addEventListener(READ_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(READ_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return ids;
}

function useResumePercent(chapterId, readerOpen) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!chapterId) return undefined;
    // The reader saves its position after a short delay, so read it a beat later.
    const timer = window.setTimeout(() => setPercent(Math.round(readScroll(chapterId) * 100)), 450);
    return () => window.clearTimeout(timer);
  }, [chapterId, readerOpen]);

  return percent;
}

function useConfirmReset() {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  function press() {
    if (confirming) {
      resetReading();
      setConfirming(false);
      // The button disappears with the trail; hand focus to the section heading.
      document.getElementById("chapters-title")?.focus({ preventScroll: true });
    } else {
      setConfirming(true);
    }
  }

  return [confirming, press];
}

export default function ChapterIndex({ onOpen, readerOpen = false }) {
  const lastChapter = getChapter(useLastChapterId());
  const readIds = useReadIds();
  const resumePercent = useResumePercent(lastChapter?.id, readerOpen);
  const [confirmingReset, pressReset] = useConfirmReset();
  const hasTrail = Boolean(lastChapter) || readIds.length > 0;
  const openWord = String(countWords[availableChapters.length] ?? availableChapters.length);
  const openCount = openWord[0].toUpperCase() + openWord.slice(1);

  return (
    <section className="chapter-index chapter" id="chapters" aria-labelledby="chapters-title">
      <div className="chapter-index__layout">
        <header className="chapter-index__header">
          <p className="chapter-index__eyebrow" data-reveal>
            Kage · {chapters.length} bab
          </p>
          <h2 className="chapter-index__title" id="chapters-title" tabIndex={-1} data-reveal>
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
                  {resumePercent > 0 && ` · ${resumePercent}%`}
                </span>
                <Arrow />
              </button>
            )}
            {hasTrail && (
              <button className="chapter-index__reset" type="button" onClick={pressReset}>
                {confirmingReset ? "Yakin? Tekan lagi untuk menghapus" : "Hapus jejak baca"}
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
                  {available
                    ? `${readingMinutes(chapter)} menit baca${readIds.includes(chapter.id) ? " · Selesai" : ""}`
                    : "Segera"}
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
