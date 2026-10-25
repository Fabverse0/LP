import React, { useEffect, useRef } from "react";
import { firstChapter } from "../content/chapter.js";
import "./ChapterReader.css";

export default function ChapterReader({ isOpen, onClose, artwork, atmosphere }) {
  const dialog = useRef(null);

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
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

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
      onKeyDown={keepFocusInside}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="reader__bar">
        <span className="reader__brand">Kage</span>
        <button className="reader__close" type="button" onClick={onClose} autoFocus>
          Tutup
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </header>

      <article className="reader__chapter">
        <header className="reader__heading">
          <p className="reader__label">Bab pertama · Kisah fiktif</p>
          <h2 id="reader-title">{firstChapter.title}</h2>
          <p className="reader__intro" id="reader-intro">{firstChapter.intro}</p>
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
          {firstChapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <footer className="reader__ending">
            <p>Akhir bab pertama.</p>
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
