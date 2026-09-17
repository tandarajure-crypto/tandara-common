/* TANDARA — AUDIO PRONUNCIATION v4 */
(() => {
  "use strict";

  const status = document.getElementById("audioStatus");
  const buttons = [...document.querySelectorAll(".audio-icon-button[data-audio-src]")];
  const htmlPlayer = document.getElementById("pronunciationPlayer");
  if (!buttons.length) return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const cache = new Map();

  let currentSource = null;
  let activeButton = null;
  let requestId = 0;

  const setStatus = t => { if (status) status.textContent = t || ""; };

  const resetButtons = () => {
    buttons.forEach(b => {
      b.classList.remove("playing");
      b.setAttribute("aria-pressed", "false");
    });
    activeButton = null;
  };

  const stopCurrent = () => {
    if (currentSource) {
      try { currentSource.onended = null; currentSource.stop(); } catch (_) {}
      currentSource = null;
    }
    if (htmlPlayer) {
      htmlPlayer.pause();
      try { htmlPlayer.currentTime = 0; } catch (_) {}
    }
  };

  async function loadWithSilence(url) {
    if (cache.has(url)) return cache.get(url);

    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);

    const data = await response.arrayBuffer();
    const decoded = await ctx.decodeAudioData(data);

    /* 0,35 s tišine PRIJE izgovora — početno T se više ne može odrezati. */
    const silence = Math.round(decoded.sampleRate * 0.35);
    const padded = ctx.createBuffer(
      decoded.numberOfChannels,
      silence + decoded.length,
      decoded.sampleRate
    );

    for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
      padded.getChannelData(ch).set(decoded.getChannelData(ch), silence);
    }

    cache.set(url, padded);
    return padded;
  }

  async function playButton(button) {
    const src = button.dataset.audioSrc || "";
    const label = button.dataset.audioLabel || "izgovor";
    if (!src) return;

    if (activeButton === button && currentSource) {
      requestId++;
      stopCurrent();
      resetButtons();
      setStatus("Reprodukcija je zaustavljena.");
      return;
    }

    const id = ++requestId;
    stopCurrent();
    resetButtons();
    setStatus("Priprema zvuka...");

    try {
      if (ctx.state === "suspended") await ctx.resume();

      const url = new URL(src, document.baseURI).href;
      const buffer = await loadWithSilence(url);

      if (id !== requestId) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      currentSource = source;
      activeButton = button;

      button.classList.add("playing");
      button.setAttribute("aria-pressed", "true");
      setStatus("Reproducira se " + label + ".");

      source.onended = () => {
        if (currentSource !== source) return;
        currentSource = null;
        resetButtons();
        setStatus("");
      };

      source.start(0);

    } catch (_) {
      if (id !== requestId) return;
      stopCurrent();
      resetButtons();
      setStatus("Zvuk se nije mogao pokrenuti. Pokušajte ponovno.");
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => playButton(button));
  });
})();
