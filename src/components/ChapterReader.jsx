import React, { useEffect, useRef, useState } from "react";
import {
  availableChapters,
  chapters,
  getChapter,
  readingMinutes,
  rememberLastChapter,
} from "../content/chapters.js";
import "./ChapterReader.css";

const ordinals = ["pertama", "kedua", "ketiga", "keempat", "kelima", "keenam", "ketujuh"];

function ordinal(number) {
  return ordinals[number - 1] ?? `ke-${number}`;
}

function resolveChapterId(id) {
  const chapter = getChapter(id);
  return chapter?.status === "available" ? chapter.id : availableChapters[0].id;
}

function ArrowIcon({ direction }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "prev" ? "M20 12H4m6-6-6 6 6 6" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ChapterReader({
  isOpen,
  onClose,
  artwork,
  atmosphere,
  chapterId,
  onChapterChange,
}) {
  const dialog = useRef(null);
  const title = useRef(null);
  const navigated = useRef(false);
  const progress = useRef(null);
  const frame = useRef(0);
  const [currentId, setCurrentId] = useState(() => resolveChapterId(chapterId));
  const [requested, setRequested] = useState(null);

  // Sync to the requested chapter while rendering, so effects never see a stale chapter on open.
  const request = isOpen ? chapterId ?? "" : null;
  if (request !== requested) {
    setRequested(request);
    if (isOpen) setCurrentId(resolveChapterId(chapterId));
  }

  const index = availableChapters.findIndex((chapter) => chapter.id === currentId);
  const chapter = availableChapters[index];
  const previous = availableChapters[index - 1];
  const next = availableChapters[index + 1];
  const nextSoon = next ? null : chapters.find((entry) => entry.number === chapter.number + 1);

  useEffect(() => {
    if (!isOpen) return;

    const element = dialog.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    element.scrollTop = 0;

    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      navigated.current = false;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) rememberLastChapter(currentId);
  }, [currentId, isOpen]);

  function updateProgress() {
    frame.current = 0;
    const element = dialog.current;
    if (!element || !progress.current) return;
    const distance = element.scrollHeight - element.clientHeight;
    const ratio = distance > 0 ? Math.min(1, Math.max(0, element.scrollTop / distance)) : 0;
    progress.current.style.transform = `scaleX(${ratio})`;
  }

  function scheduleProgress() {
    if (!frame.current) frame.current = requestAnimationFrame(updateProgress);
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (!isOpen) return;
    dialog.current.scrollTop = 0;
    updateProgress();
    if (navigated.current) {
      title.current?.focus({ preventScroll: true });
      navigated.current = false;
    }
  }, [currentId, isOpen]);

  function goTo(target) {
    if (!target) return;
    navigated.current = true;
    setCurrentId(target.id);
    onChapterChange?.(target.id);
  }

  function changeChapterWithKeys(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select"))) {
      return;
    }
    const destination = event.key === "ArrowLeft" ? previous : next;
    if (!destination) return;
    event.preventDefault();
    goTo(destination);
  }

  function handleKeyDown(event) {
    changeChapterWithKeys(event);
    keepFocusInside(event);
  }

  function keepFocusInside(event) {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll("button:not([disabled]), a[href], [tabindex='0']")]
      .filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog
      ref={dialog}
      id="chapter-reader"
      className="reader"
      aria-labelledby="reader-title"
      aria-describedby="reader-intro"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onScroll={scheduleProgress}
      aria-keyshortcuts="ArrowLeft ArrowRight"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="reader__bar">
        <span className="reader__progress" aria-hidden="true">
          <span className="reader__progress-fill" ref={progress} />
        </span>
        <span className="reader__brand">Kage</span>
        <nav className="reader__nav" aria-label="Navigasi bab">
          <button
            className="reader__step"
            type="button"
            onClick={() => goTo(previous)}
            disabled={!previous}
            aria-label={previous ? `Bab sebelumnya: ${previous.title}` : "Tidak ada bab sebelumnya"}
          >
            <ArrowIcon direction="prev" />
          </button>
          <span className="reader__count">
            {index + 1} / {availableChapters.length}
          </span>
          <button
            className="reader__step"
            type="button"
            onClick={() => goTo(next)}
            disabled={!next}
            aria-label={next ? `Bab berikutnya: ${next.title}` : "Tidak ada bab berikutnya"}
          >
            <ArrowIcon direction="next" />
          </button>
        </nav>
        <button className="reader__close" type="button" onClick={onClose} autoFocus>
          Tutup
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </header>

      <article className="reader__chapter" key={chapter.id}>
        <header className="reader__heading">
          <p className="reader__label">
            Bab {ordinal(chapter.number)} · {readingMinutes(chapter)} menit baca · Kisah fiktif
          </p>
          <h2 id="reader-title" ref={title} tabIndex={-1}>{chapter.title}</h2>
          <p className="reader__intro" id="reader-intro">{chapter.intro}</p>
        </header>

        <figure className="reader__cover">
          <img
            src={artwork}
            width="3840"
            height="2160"
            alt="Ronin di tengah ladang, menghadap matahari di balik gunung."
          />
          <figcaption>Suasana {atmosphere.toLowerCase()}</figcaption>
        </figure>

        <div className="reader__prose">
          {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <footer className="reader__ending">
            <p>Akhir bab {ordinal(chapter.number)}.</p>
            <div className="reader__pager">
              {previous && (
                <button className="reader__turn reader__turn--prev" type="button" onClick={() => goTo(previous)}>
                  <span className="reader__turn-label">Sebelumnya</span>
                  <span className="reader__turn-title">{previous.title}</span>
                </button>
              )}
              {next ? (
                <button className="reader__turn reader__turn--next" type="button" onClick={() => goTo(next)}>
                  <span className="reader__turn-label">Bab berikutnya</span>
                  <span className="reader__turn-title">{next.title}</span>
                </button>
              ) : nextSoon && (
                <p className="reader__turn reader__turn--soon">
                  <span className="reader__turn-label">Segera</span>
                  <span className="reader__turn-title">{nextSoon.title}</span>
                </p>
              )}
            </div>
            <button className="reader__return" type="button" onClick={onClose}>
              Kembali ke perjalanan
              <span aria-hidden="true">↗</span>
            </button>
          </footer>
        </div>
      </article>
    </dialog>
  );
}
