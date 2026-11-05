import React, { useEffect, useRef } from "react";
import "./ScrollProgress.css";

function supportsScrollTimeline() {
  return typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()");
}

/** Thin decorative bar showing how far the page has been read. */
export default function ScrollProgress() {
  const root = useRef(null);

  useEffect(() => {
    // Native scroll-driven animation handles everything in CSS.
    if (supportsScrollTimeline()) return undefined;

    const element = root.current;
    let frame = 0;

    function update() {
      frame = 0;
      const scroller = document.documentElement;
      const max = scroller.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      element.style.setProperty("--scroll-progress", progress.toFixed(4));
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

  return (
    <div ref={root} className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" />
    </div>
  );
}
