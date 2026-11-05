import React, { useEffect, useRef, useState } from "react";
import "./Newsletter.css";

const STORAGE_KEY = "kage:subscribed";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

function readSubscription() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function saveSubscription(email) {
  const record = { email, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage can be blocked; the confirmation still shows for this visit.
  }
  return record;
}

function clearSubscription() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}

function validate(value) {
  const email = value.trim();
  if (!email) return "Tulis alamat surelmu dulu.";
  if (!EMAIL_PATTERN.test(email)) return "Alamat surel belum lengkap. Contoh: nama@domain.com";
  return "";
}

/**
 * Demo sign-up: validates on the client and remembers the address in localStorage only.
 * Nothing is sent over the network.
 */
export default function Newsletter() {
  const [subscription, setSubscription] = useState(readSubscription);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const input = useRef(null);
  const confirmation = useRef(null);

  useEffect(() => {
    if (justSubscribed) confirmation.current?.focus();
  }, [justSubscribed]);

  function handleChange(event) {
    setEmail(event.target.value);
    // Only re-check live after the first attempt, so typing isn't interrupted by errors.
    if (submitted) setError(validate(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const message = validate(email);
    setError(message);
    if (message) {
      input.current?.focus();
      return;
    }
    setSubscription(saveSubscription(email.trim()));
    setJustSubscribed(true);
  }

  function handleReset() {
    clearSubscription();
    setSubscription(null);
    setJustSubscribed(false);
    setSubmitted(false);
    setError("");
    setEmail("");
    window.requestAnimationFrame(() => input.current?.focus());
  }

  const describedBy = ["newsletter-note", error && "newsletter-error"].filter(Boolean).join(" ");

  return (
    <section className="newsletter" id="join" aria-labelledby="newsletter-title">
      <div className="newsletter__layout">
        <h2 className="newsletter__title" id="newsletter-title">
          <span>Kabari</span> <span>aku</span>
        </h2>

        <div className="newsletter__body">
          <p className="newsletter__lead">Bab baru terbit saat bulan purnama. Satu surat, tanpa bising.</p>

          {subscription ? (
            <div
              ref={confirmation}
              className="newsletter__done"
              role="status"
              tabIndex={-1}
            >
              <p className="newsletter__done-title">Namamu sudah tercatat di jalan.</p>
              <p className="newsletter__done-detail">
                {justSubscribed ? "Kami akan mengabari " : "Kamu sudah terdaftar sebagai "}
                <strong>{subscription.email}</strong>.
              </p>
              <button className="newsletter__reset" type="button" onClick={handleReset}>
                Ganti alamat
              </button>
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
              <label className="newsletter__label" htmlFor="newsletter-email">
                Alamat surel
              </label>
              <div className="newsletter__row">
                <input
                  ref={input}
                  className="newsletter__input"
                  id="newsletter-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="nama@domain.com"
                  required
                  value={email}
                  onChange={handleChange}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={describedBy}
                />
                <button className="newsletter__submit" type="submit">
                  Catat aku
                </button>
              </div>
              {error && (
                <p className="newsletter__error" id="newsletter-error">
                  {error}
                </p>
              )}
            </form>
          )}

          <p className="newsletter__note" id="newsletter-note">
            Ini hanya demo. Alamatmu disimpan di perangkat ini saja; tidak ada data yang dikirim.
          </p>
        </div>
      </div>
    </section>
  );
}
