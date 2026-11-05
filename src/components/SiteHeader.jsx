import React, { useEffect, useState } from "react";
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

export default function SiteHeader({
  links = [],
  onRead,
  readLabel = "Baca",
  readControls,
  homeHref = "#top",
}) {
  const activeId = useActiveSection(sectionIds(links));

  return (
    <header className="site-header" id="site-header">
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
