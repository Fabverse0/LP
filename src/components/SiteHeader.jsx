import React, { useEffect, useRef, useState } from "react";
import "./SiteHeader.css";

function sectionIds(links) {
  return links
    .map((link) => link.href)
    .filter((href) => typeof href === "string" && href.startsWith("#") && href.length > 1)
    .map((href) => href.slice(1));
}

/**
 * Tracks which linked section crosses the middle band of the viewport.
 * Returns the id of that section, or null while none of them is in view (e.g. the hero).
 */
function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!("IntersectionObserver" in window) || ids.length === 0) return undefined;

    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const visible = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // Keep document order: the last visible section in the band wins.
        const current = ids.filter((id) => visible.has(id)).pop() ?? null;
        setActiveId(current);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}

const CONDENSE_AT = 80;
const HIDE_AFTER = 160;
const DELTA = 6;

/**
 * Solid + condensed after ~80px; slides away on scroll down and returns on scroll up.
 * `pinned` keeps it visible (e.g. while a menu is open or focus is inside the header).
 */
function useHeaderScroll(pinned) {
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pinnedRef = useRef(pinned);
  pinnedRef.current = pinned;

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      setCondensed(y > CONDENSE_AT);

      if (pinnedRef.current || y < HIDE_AFTER) {
        setHidden(false);
      } else if (delta > DELTA) {
        setHidden(true);
      } else if (delta < -DELTA) {
        setHidden(false);
      }

      if (Math.abs(delta) > DELTA) lastY = y;
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (pinned) setHidden(false);
  }, [pinned]);

  return { condensed, hidden };
}

export default function SiteHeader({
  links = [],
  onRead,
  readLabel = "Baca",
  readControls,
  homeHref = "#top",
}) {
  const header = useRef(null);
  const activeId = useActiveSection(sectionIds(links));
  const [focusWithin, setFocusWithin] = useState(false);
  const { condensed, hidden } = useHeaderScroll(focusWithin);

  const className = [
    "site-header",
    condensed && "site-header--solid",
    hidden && "site-header--hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      ref={header}
      className={className}
      id="site-header"
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
      }}
    >
      <div className="site-header__inner">
        <a className="site-header__wordmark" href={homeHref} aria-label="Kage, kembali ke awal">
          Kage
        </a>

        <nav className="site-header__nav" id="site-nav" aria-label="Navigasi utama">
          <ul className="site-header__list">
            {links.map((link) => {
              const isActive = link.href === `#${activeId}`;
              return (
                <li key={link.href}>
                  <a
                    className={`site-header__link${isActive ? " is-active" : ""}`}
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            className="site-header__cta"
            type="button"
            onClick={() => onRead?.()}
            aria-haspopup={readControls ? "dialog" : undefined}
            aria-controls={readControls}
          >
            {readLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
