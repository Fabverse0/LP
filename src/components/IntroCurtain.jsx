import React, { useEffect, useRef, useState } from "react";
import "./IntroCurtain.css";

const STORAGE_KEY = "kage:intro-seen";
// Safety net: even if animationend never fires, the curtain is gone by then.
const MAX_DURATION = 2400;
// Matches the lift animation-delay in IntroCurtain.css.
const LIFT_DELAY = 1200;

function readSeen() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage can be blocked (private mode, sandboxed frames); the intro just plays again.
  }
}

function shouldShow() {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return !reduced && !readSeen();
}

export default function IntroCurtain() {
  const [visible, setVisible] = useState(shouldShow);
  const [skipping, setSkipping] = useState(false);
  const curtain = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;
    markSeen();

    const started = performance.now();
    // Once the regular lift has begun, restarting it as a skip would make it jump back down.
    const skip = () => {
      if (performance.now() - started < LIFT_DELAY) setSkipping(true);
    };
    const timeout = window.setTimeout(() => setVisible(false), MAX_DURATION);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={curtain}
      className={`intro-curtain${skipping ? " intro-curtain--skip" : ""}`}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === curtain.current) setVisible(false);
      }}
    >
      <svg className="intro-curtain__brush" viewBox="0 0 400 400" focusable="false">
        <defs>
          {/* Roughen the glyph edges so the type reads as ink pulled by a dry brush. */}
          <filter id="intro-curtain-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text
          className="intro-curtain__kanji"
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="central"
          filter="url(#intro-curtain-ink)"
        >
          影
        </text>
      </svg>
      <span className="intro-curtain__rule" />
      <span className="intro-curtain__word">Kage</span>
    </div>
  );
}
