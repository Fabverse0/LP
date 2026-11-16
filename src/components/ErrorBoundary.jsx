import React from "react";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Kage failed to render", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="error-page" id="main">
        <p className="error-page__mark">Kage</p>
        <h1 className="error-page__title">Jalannya terputus</h1>
        <p className="error-page__text">
          Halaman gagal dimuat. Tidak ada yang hilang: bab yang sudah Anda baca tetap
          tersimpan di perangkat ini.
        </p>
        <button className="error-page__retry" type="button" onClick={() => window.location.reload()}>
          Muat ulang halaman
        </button>
      </main>
    );
  }
}
