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

  function markLoaded(name) {
    loaded.current.add(name);
    if (loaded.current.size === layers.length) setReady(true);
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
            onLoad={() => markLoaded(layer.name)}
          />
        ))}
      </div>
    </div>
  );
}
