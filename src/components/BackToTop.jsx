import React, { useEffect, useRef, useState } from "react";
import "./BackToTop.css";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Square button that appears after one viewport of scrolling. The ring around the arrow
 * fills with page progress. Clicking returns to `#targetId` and moves focus there.
 */
export default function BackToTop({ targetId = "top", label = "Kembali ke atas" }) {
  const ring = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ring.current?.style.setProperty("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
      setVisible(window.scrollY > window.innerHeight);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function goToTop() {
    const target = document.getElementById(targetId);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });

    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }

  return (
    <button
      className={`back-to-top${visible ? " is-visible" : ""}`}
      type="button"
      onClick={goToTop}
      aria-label={label}
      title={label}
      inert={!visible}
    >
      <svg className="back-to-top__icon" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
        <circle className="back-to-top__track" cx="26" cy="26" r={RADIUS} />
        <circle
          ref={ring}
          className="back-to-top__ring"
          cx="26"
          cy="26"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
        <path className="back-to-top__arrow" d="M26 35V17M18 25l8-8 8 8" />
      </svg>
    </button>
  );
}
