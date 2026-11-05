import React, { useEffect, useRef, useState } from "react";
import "./AmbientSound.css";

const VOLUME = 0.42;
const FADE_IN = 1.8;
const FADE_OUT = 0.7;

function getAudioContextClass() {
  if (typeof window === "undefined") return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

// Brown noise (integrated white noise) gives the low body of wind;
// pink noise (Paul Kellet's filter) gives the airy hiss on top.
function makeNoiseBuffer(context, kind, seconds = 4) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    if (kind === "brown") {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  // Cross-fade the loop seam so there is no click every few seconds.
  const fade = Math.floor(context.sampleRate * 0.05);
  for (let i = 0; i < fade; i += 1) {
    const t = i / fade;
    data[length - fade + i] = data[length - fade + i] * (1 - t) + data[i] * t;
  }
  return buffer;
}

function loopNoise(context, buffer) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function lfo(context, frequency, depth, target) {
  const oscillator = context.createOscillator();
  const amount = context.createGain();
  oscillator.frequency.value = frequency;
  amount.gain.value = depth;
  oscillator.connect(amount).connect(target);
  oscillator.start();
  return oscillator;
}

function buildWind(context, destination) {
  // Low, rolling body of the wind.
  const body = loopNoise(context, makeNoiseBuffer(context, "brown"));
  const bodyFilter = context.createBiquadFilter();
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.value = 420;
  bodyFilter.Q.value = 0.6;
  const bodyGain = context.createGain();
  bodyGain.gain.value = 0.7;
  body.connect(bodyFilter).connect(bodyGain).connect(destination);

  // Thin whistle through the grass.
  const air = loopNoise(context, makeNoiseBuffer(context, "pink"));
  const airFilter = context.createBiquadFilter();
  airFilter.type = "bandpass";
  airFilter.frequency.value = 1100;
  airFilter.Q.value = 0.9;
  const airGain = context.createGain();
  airGain.gain.value = 0.12;
  air.connect(airFilter).connect(airGain).connect(destination);

  // Slow, incommensurate LFOs so gusts never fall into an audible loop.
  const modulators = [
    lfo(context, 0.071, 260, bodyFilter.frequency),
    lfo(context, 0.113, 0.28, bodyGain.gain),
    lfo(context, 0.047, 480, airFilter.frequency),
    lfo(context, 0.089, 0.07, airGain.gain),
  ];

  body.start();
  air.start(0, 1.7);
  return [body, air, ...modulators];
}

function Equalizer() {
  return (
    <span className="ambient-sound__eq" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function AmbientSound() {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const playingRef = useRef(false);

  useEffect(() => {
    setSupported(Boolean(getAudioContextClass()));
  }, []);

  function fadeTo(value, seconds) {
    const { context, master } = audio.current;
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  async function start() {
    if (!audio.current) {
      // Created only after a user gesture, as autoplay policies require.
      const AudioContextClass = getAudioContextClass();
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      audio.current = { context, master, nodes: buildWind(context, master), suspendTimer: 0 };
    }
    const current = audio.current;
    window.clearTimeout(current.suspendTimer);
    if (current.context.state !== "running") await current.context.resume();
    // The user may have switched it off again while resume() was pending.
    if (!playingRef.current || document.hidden) return;
    fadeTo(VOLUME, FADE_IN);
  }

  function stop() {
    const current = audio.current;
    if (!current) return;
    fadeTo(0, FADE_OUT);
    window.clearTimeout(current.suspendTimer);
    // Suspend after the fade so the audio thread stops working entirely.
    current.suspendTimer = window.setTimeout(() => {
      if (!playingRef.current || document.hidden) current.context.suspend();
    }, FADE_OUT * 1000 + 80);
  }

  async function toggle() {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    try {
      if (next) await start();
      else stop();
    } catch {
      playingRef.current = false;
      setPlaying(false);
    }
  }

  useEffect(() => {
    function onVisibility() {
      if (!audio.current || !playingRef.current) return;
      if (document.hidden) stop();
      else start().catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => () => {
    const current = audio.current;
    if (!current) return;
    window.clearTimeout(current.suspendTimer);
    current.context.close().catch(() => {});
    audio.current = null;
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`ambient-sound${playing ? " ambient-sound--on" : ""}`}
      aria-pressed={playing}
      aria-label={playing ? "Matikan suara" : "Nyalakan suara angin"}
      title={playing ? "Matikan suara" : "Nyalakan suara angin"}
      onClick={toggle}
    >
      <Equalizer />
      <span className="ambient-sound__label">Suara</span>
    </button>
  );
}
