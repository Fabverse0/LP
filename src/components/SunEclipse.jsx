import React, { useEffect, useRef } from "react";
import "./SunEclipse.css";

const LINES = ["Matahari", "tidak", "menunggu"];

export default function SunEclipse() {
  const section = useRef(null);
  const sun = useRef(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return undefined;

    let raf = 0;
    let ticking = false;

    // Skala yang dibutuhkan matahari agar menutup sudut layar terjauh.
    const measure = () => {
      const disc = sun.current;
      if (!disc) return;
      const radius = disc.offsetWidth / 2 || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerY = height * 0.6;
      const reach = Math.hypot(width / 2, Math.max(centerY, height - centerY));
      root.style.setProperty("--sun-cover", ((reach / radius) * 1.08).toFixed(3));
    };

    const update = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      root.style.setProperty("--p", progress.toFixed(4));
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      raf = window.requestAnimationFrame(update);
    };

    const resize = () => {
      measure();
      request();
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let listening = false;
    let visible = false;

    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", resize);
        resize();
      } else {
        window.removeEventListener("scroll", request);
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(raf);
        ticking = false;
      }
    };

    // Gerak dikurangi: tidak ada pin, cukup satu komposisi diam.
    const applyMotion = () => {
      const still = motion.matches;
      root.classList.toggle("is-still", still);
      if (still) {
        listen(false);
        root.style.removeProperty("--p");
      } else {
        listen(visible);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!motion.matches) listen(visible);
        // Saat keluar layar, kunci ke ujung terdekat agar tidak tertinggal di tengah fase.
        if (!visible && !motion.matches) update();
      },
      { rootMargin: "25% 0px" },
    );

    measure();
    applyMotion();
    observer.observe(root);
    motion.addEventListener("change", applyMotion);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", applyMotion);
      listen(false);
      root.classList.remove("is-still");
    };
  }, []);

  return (
    <section className="sun-eclipse" id="eclipse" ref={section} aria-labelledby="eclipse-title">
      <div className="sun-eclipse__stage">
        <p className="sun-eclipse__eyebrow">
          <span>Gerhana</span>
          <span>Senja tidak datang pelan.</span>
        </p>

        <div className="sun-eclipse__sky" aria-hidden="true">
          <div className="sun-eclipse__sun" ref={sun} />
        </div>

        <div className="sun-eclipse__ground" aria-hidden="true">
          <div className="sun-eclipse__grass" />
          <div className="sun-eclipse__ronin" />
        </div>

        <h2 className="sun-eclipse__lines" id="eclipse-title">
          {LINES.map((line) => (
            <React.Fragment key={line}>
              <span className="sun-eclipse__line">{line}</span>{" "}
            </React.Fragment>
          ))}
        </h2>

        <div className="sun-eclipse__night">
          <div className="sun-eclipse__ground sun-eclipse__ground--ember" aria-hidden="true">
            <div className="sun-eclipse__grass" />
            <div className="sun-eclipse__ronin" />
          </div>
          <p className="sun-eclipse__step">Tapi ia masih punya satu langkah.</p>
        </div>

        <div className="sun-eclipse__meter" aria-hidden="true">
          <span className="sun-eclipse__meter-label">Gerhana</span>
          <span className="sun-eclipse__meter-track" />
        </div>
      </div>
    </section>
  );
}
