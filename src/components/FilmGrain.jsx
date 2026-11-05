import React from "react";
import "./FilmGrain.css";

// Purely decorative. The noise is a tiny SVG tile rasterised once; the
// "animation" only jumps that layer between offsets, so it stays on the compositor.
export default function FilmGrain() {
  return <div className="film-grain" aria-hidden="true" />;
}
