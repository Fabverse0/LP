import React, { useEffect, useRef } from "react";
import "./KeyboardHelp.css";

function isTypingTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"));
}

/**
 * Native <dialog> listing keyboard shortcuts. Opens with "?" (Shift + /) unless the
 * reader is typing or another dialog is already open; Escape or "Tutup" closes it.
 * It only lists shortcuts; wiring the shortcuts themselves stays with the page.
 */
export default function KeyboardHelp({ shortcuts = [], title = "Pintasan papan ketik" }) {
  const dialog = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key !== "?" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.defaultPrevented || isTypingTarget(event.target)) return;

      const element = dialog.current;
      if (!element) return;

      if (element.open) {
        event.preventDefault();
        element.close();
        return;
      }

      // Don't stack on top of another modal (e.g. the chapter reader).
      if (document.querySelector("dialog[open]")) return;

      event.preventDefault();
      returnFocus.current = document.activeElement;
      element.showModal();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleClose() {
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target instanceof HTMLElement && target.isConnected) {
      target.focus({ preventScroll: true });
    }
  }

  return (
    <dialog
      ref={dialog}
      className="keyboard-help"
      id="keyboard-help"
      aria-labelledby="keyboard-help-title"
      aria-describedby="keyboard-help-hint"
      onClose={handleClose}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="keyboard-help__panel">
        <header className="keyboard-help__bar">
          <h2 className="keyboard-help__title" id="keyboard-help-title">
            {title}
          </h2>
          <form method="dialog">
            <button className="keyboard-help__close" type="submit" autoFocus>
              Tutup
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" focusable="false">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </form>
        </header>

        <dl className="keyboard-help__list">
          {shortcuts.map((shortcut) => (
            <div className="keyboard-help__item" key={`${shortcut.keys.join("+")}-${shortcut.label}`}>
              <dt className="keyboard-help__keys">
                {shortcut.keys.map((key, index) => (
                  <React.Fragment key={key}>
                    {index > 0 && (
                      <span className="keyboard-help__plus" aria-hidden="true">
                        +
                      </span>
                    )}
                    <kbd className="keyboard-help__key">{key}</kbd>
                  </React.Fragment>
                ))}
              </dt>
              <dd className="keyboard-help__label">{shortcut.label}</dd>
            </div>
          ))}
        </dl>

        <p className="keyboard-help__hint" id="keyboard-help-hint">
          Tekan <kbd className="keyboard-help__inline-key">?</kbd> kapan saja untuk membuka daftar
          ini, <kbd className="keyboard-help__inline-key">Esc</kbd> untuk menutup.
        </p>
      </div>
    </dialog>
  );
}
