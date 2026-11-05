import React, { useEffect, useRef, useState } from "react";

const layers = [
  { name: "landscape", src: "/images/kage-landscape-4k.webp" },
  { name: "ronin", src: "/images/kage-ronin-layer.webp" },
  { name: "grass", src: "/images/kage-grass-layer.webp" },
];

export default function HeroScene() {
  const scene = useRef(null);
  const loaded = useRef(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = scene.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    const updatePlayback = () => {
      element.style.animationPlayState =
        inView && !document.hidden && !reducedMotion.matches ? "running" : "paused";
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          updatePlayback();
        })
      : null;

    observer?.observe(element);
    document.addEventListener("visibilitychange", updatePlayback);
    reducedMotion.addEventListener("change", updatePlayback);
    updatePlayback();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      reducedMotion.removeEventListener("change", updatePlayback);
    };
  }, []);

  useEffect(() => {
    const element = scene.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    function step() {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      element.style.setProperty("--mx", current.x.toFixed(4));
      element.style.setProperty("--my", current.y.toFixed(4));
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(step);
    }

    function handleMove(event) {
      if (window.scrollY > window.innerHeight) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(step);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  async function markLoaded(name, image) {
    try {
      // A load event can precede an async image's first decoded frame.
      // Keep the complete artwork visible until every layer can be painted.
      if (image.decode) await image.decode();
      loaded.current.add(name);
      if (loaded.current.size === layers.length) setReady(true);
    } catch {
      // A failed layer leaves the original artwork in place.
    }
  }

  return (
    <div
      ref={scene}
      className={`hero__art${ready ? " hero__art--ready" : ""}`}
      role="img"
      aria-label="Seorang ronin menghadap matahari merah. Ladang, sosok, dan rumput depan membentuk kedalaman adegan."
    >
      <div className="hero__layers" aria-hidden="true">
        {layers.map((layer) => (
          <img
            key={layer.name}
            className={`hero__layer hero__layer--${layer.name}`}
            src={layer.src}
            alt=""
            width="3840"
            height="2160"
            decoding="async"
            fetchPriority={layer.name === "landscape" ? "high" : "auto"}
            onLoad={(event) => markLoaded(layer.name, event.currentTarget)}
          />
        ))}
      </div>
    </div>
  );
}
