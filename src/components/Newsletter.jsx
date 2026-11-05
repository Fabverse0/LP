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

function copyWithTextarea(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithTextarea(text);
  }
}

/** "Bagikan": native share sheet when available, otherwise copies the link. */
function ShareButton() {
  const [status, setStatus] = useState("");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function announce(message) {
    window.clearTimeout(timer.current);
    setStatus(message);
    timer.current = window.setTimeout(() => setStatus(""), 2600);
  }

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}`;
    const data = {
      title: document.title || "Kage — The Last Light",
      text: "Kage, kisah fiktif seorang ronin di bawah matahari merah.",
      url,
    };

    if (navigator.share && (navigator.canShare?.(data) ?? true)) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        // The reader closed the share sheet: respect that and stay quiet.
        if (error?.name === "AbortError") return;
      }
    }

    announce((await copyText(url)) ? "Tautan disalin" : `Salin tautan ini: ${url}`);
  }

  return (
    <div className="newsletter__share">
      <button className="newsletter__share-button" type="button" onClick={handleShare}>
        Bagikan
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" focusable="false">
          <path d="M12 15V3M7 8l5-5 5 5M5 13v8h14v-8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <p className="newsletter__share-status" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </div>
  );
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

          <ShareButton />
        </div>
      </div>
    </section>
  );
}
