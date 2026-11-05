import React, { useEffect, useRef, useState } from "react";
import "./EmberField.css";

const MAX_DPR = 2;
const AREA_PER_PARTICLE = 16000;
const MIN_PARTICLES = 60;
const MAX_PARTICLES = 120;

// Each hour changes what is in the air: dusk embers, a denser hotter ember
// storm, and at night a few slow, pale fireflies that wander more than rise.
const palettes = {
  dusk: {
    colors: ["255, 112, 64", "232, 64, 52", "255, 158, 86"],
    density: 0.8,
    size: [1.1, 2.6],
    rise: [14, 34],
    sway: [8, 22],
    span: [5, 11],
    glow: 5,
  },
  ember: {
    colors: ["255, 150, 60", "255, 196, 104", "255, 110, 44", "255, 226, 160"],
    density: 1,
    size: [1.2, 3],
    rise: [24, 52],
    sway: [10, 28],
    span: [4, 8],
    glow: 6,
  },
  night: {
    colors: ["196, 232, 255", "150, 214, 236", "220, 248, 230"],
    density: 0.32,
    size: [1, 2],
    rise: [3, 9],
    sway: [18, 42],
    span: [7, 14],
    glow: 7,
  },
};

const random = (min, max) => min + Math.random() * (max - min);

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

// A soft radial sprite per colour is far cheaper than shadowBlur on every arc.
function makeSprite(rgb, glow) {
  const radius = 8 * glow;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = radius * 2;
  const context = sprite.getContext("2d");
  const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, `rgba(${rgb}, 1)`);
  gradient.addColorStop(0.18, `rgba(${rgb}, 0.85)`);
  gradient.addColorStop(0.45, `rgba(${rgb}, 0.22)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, radius * 2, radius * 2);
  return sprite;
}

function spawn(particle, palette, width, height, scattered) {
  particle.x = random(0, width);
  // Fireflies at night hover anywhere in the lower field rather than rising from below.
  if (palette === palettes.night) particle.y = random(height * 0.35, height);
  else particle.y = scattered ? random(0, height) : height + random(4, 40);
  particle.size = random(...palette.size);
  particle.rise = random(...palette.rise);
  particle.sway = random(...palette.sway);
  particle.swaySpeed = random(0.35, 1.1);
  particle.phase = random(0, Math.PI * 2);
  particle.flicker = random(1.5, 4.5);
  particle.sprite = Math.floor(random(0, palette.colors.length));
  particle.life = scattered ? random(0, palette.span[0]) : 0;
  particle.span = random(...palette.span);
  return particle;
}

export default function EmberField({ hour = "dusk" }) {
  const canvas = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!context) return undefined;

    const palette = palettes[hour] ?? palettes.dusk;
    const sprites = palette.colors.map((rgb) => makeSprite(rgb, palette.glow));
    let particles = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nextWidth = element.clientWidth;
      const nextHeight = element.clientHeight;
      if (!nextWidth || !nextHeight) return;

      // Keep existing embers in place proportionally rather than re-seeding.
      for (const particle of particles) {
        particle.x *= nextWidth / (width || nextWidth);
        particle.y *= nextHeight / (height || nextHeight);
      }
      width = nextWidth;
      height = nextHeight;
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const byArea = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, (width * height) / AREA_PER_PARTICLE));
      const target = Math.round(byArea * palette.density);
      if (particles.length > target) particles.length = target;
      while (particles.length < target) particles.push(spawn({}, palette, width, height, true));
    }

    function draw(now) {
      const delta = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        particle.life += delta;
        particle.y -= particle.rise * delta;
        const drift = Math.sin(now / 1000 * particle.swaySpeed + particle.phase) * particle.sway;
        const x = particle.x + drift;

        if (particle.y < -30 || particle.life > particle.span) {
          spawn(particle, palette, width, height, false);
          continue;
        }

        // Fade in quickly, burn, then cool off before the end of its span.
        const progress = particle.life / particle.span;
        const envelope = Math.min(1, progress * 6) * (1 - progress * progress);
        const wave = Math.sin(now / 1000 * particle.flicker + particle.phase);
        // Embers flicker; fireflies breathe slowly on and almost fully off.
        const flicker = palette === palettes.night
          ? Math.max(0, wave) ** 2
          : 0.75 + 0.25 * wave;
        const sprite = sprites[particle.sprite];
        const size = particle.size * palette.glow * 2.2;

        context.globalAlpha = Math.max(0, envelope * flicker);
        context.drawImage(sprite, x - size, particle.y - size, size * 2, size * 2);
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    }

    // Only spend frames while the hero is on screen and the tab is visible.
    let inView = true;
    function updatePlayback() {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !frame) {
        last = 0; // avoid a jump after a long pause
        frame = requestAnimationFrame(draw);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    resize();
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(element);
    if (!resizeObserver) window.addEventListener("resize", resize);

    const intersection = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          updatePlayback();
        })
      : null;
    intersection?.observe(element);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver?.disconnect();
      intersection?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [reducedMotion, hour]);

  if (reducedMotion) return null;

  return <canvas ref={canvas} className="ember-field" aria-hidden="true" />;
}
