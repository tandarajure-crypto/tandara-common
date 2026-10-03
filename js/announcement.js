(() => {
  "use strict";

  const script = document.currentScript;

  if (!script || !document.body || !document.head) {
    return;
  }

  const siteRoot = new URL(
    script.dataset.siteRoot || "/Tandara/",
    window.location.origin
  );
  const commonRoot = new URL("../", script.src);
  const stylesheetUrl = new URL("css/announcement.css", commonRoot);
  stylesheetUrl.search = new URL(script.src).search;

  function loadStylesheet() {
    return new Promise((resolve) => {
      const existing = document.querySelector(
        "link[data-tandara-announcement-style]"
      );

      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }

        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", resolve, { once: true });
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheetUrl.href;
      link.dataset.tandaraAnnouncementStyle = "true";
      link.addEventListener(
        "load",
        () => {
          link.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      link.addEventListener("error", resolve, { once: true });
      document.head.appendChild(link);
    });
  }

  function localized(value, language) {
    if (typeof value === "string") {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const selected = value[language] || value.hr || value.en || "";
      return typeof selected === "string" ? selected.trim() : "";
    }

    return "";
  }

  function parseBoundary(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (
      typeof value !== "string" ||
      !/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
    ) {
      return Number.NaN;
    }

    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : Number.NaN;
  }

  function isWithinSchedule(config) {
    const start = parseBoundary(config.startsAt);
    const end = parseBoundary(config.endsAt);

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      (start !== null && end !== null && start >= end)
    ) {
      return false;
    }

    const now = Date.now();
    return (start === null || now >= start) && (end === null || now < end);
  }

  function readDismissal(id) {
    try {
      return window.sessionStorage.getItem(
        `tandara-announcement-dismissed:${id}`
      ) === "1";
    } catch (_error) {
      return false;
    }
  }

  function saveDismissal(id) {
    try {
      window.sessionStorage.setItem(
        `tandara-announcement-dismissed:${id}`,
        "1"
      );
    } catch (_error) {
      // The announcement remains dismissible for this page if storage is blocked.
    }
  }

  function safeImageUrl(path) {
    if (typeof path !== "string" || !path.trim()) {
      return null;
    }

    try {
      const url = new URL(path, siteRoot);
      return url.origin === window.location.origin ? url.href : null;
    } catch (_error) {
      return null;
    }
  }

  function safeLinkUrl(path) {
    if (typeof path !== "string" || !path.trim()) {
      return null;
    }

    try {
      const url = new URL(path, siteRoot);
      return url.protocol === "https:" || url.protocol === "http:"
        ? url.href
        : null;
    } catch (_error) {
      return null;
    }
  }

  function makeDialog(config, language) {
    const title =
      localized(config.title, language) ||
      (language === "en" ? "Announcement" : "Obavijest");
    const message = localized(config.message, language);
    const imageAlt = localized(config.imageAlt, language) || title;
    const imageUrl = safeImageUrl(config.image);

    if (!imageUrl) {
      return null;
    }

    const dialog = document.createElement("dialog");
    dialog.className = "tandara-announcement";
    dialog.setAttribute("aria-labelledby", "tandara-announcement-title");

    const panel = document.createElement("div");
    panel.className = "tandara-announcement__panel";

    const heading = document.createElement("h2");
    heading.className = "tandara-announcement__title";
    heading.id = "tandara-announcement-title";
    heading.textContent = title;

    const closeButton = document.createElement("button");
    closeButton.className = "tandara-announcement__close";
    closeButton.type = "button";
    closeButton.setAttribute(
      "aria-label",
      language === "en" ? "Close announcement" : "Zatvori objavu"
    );
    closeButton.textContent = "×";

    const image = document.createElement("img");
    image.className = "tandara-announcement__image";
    image.src = imageUrl;
    image.alt = imageAlt;
    image.decoding = "async";
    image.fetchPriority = "high";

    panel.append(closeButton, heading, image);

    if (message) {
      const paragraph = document.createElement("p");
      paragraph.className = "tandara-announcement__message";
      paragraph.textContent = message;
      panel.appendChild(paragraph);
    }

    const linkUrl = safeLinkUrl(config.link);
    const linkLabel = localized(config.linkLabel, language);

    if (linkUrl && linkLabel) {
      const link = document.createElement("a");
      link.className = "tandara-announcement__link";
      link.href = linkUrl;
      link.textContent = linkLabel;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      panel.appendChild(link);
    }

    dialog.appendChild(panel);

    function dismiss() {
      saveDismissal(config.id);
      if (dialog.open) {
        if (typeof dialog.close === "function") {
          dialog.close();
        } else {
          dialog.removeAttribute("open");
        }
      }
      dialog.remove();
    }

    closeButton.addEventListener("click", dismiss);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      dismiss();
    });

    return dialog;
  }

  async function initialize() {
    await loadStylesheet();

    let config;
    try {
      const configUrl = new URL("objava.json", siteRoot);
      const response = await fetch(configUrl.href, {
        cache: "no-store",
        credentials: "omit"
      });

      if (!response.ok) {
        return;
      }

      config = await response.json();
    } catch (_error) {
      return;
    }

    if (
      !config ||
      config.enabled !== true ||
      typeof config.id !== "string" ||
      !config.id.trim() ||
      !isWithinSchedule(config) ||
      readDismissal(config.id)
    ) {
      return;
    }

    const language = document.documentElement.lang
      .trim()
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "hr";

    const dialog = makeDialog(config, language);
    if (!dialog) {
      return;
    }

    document.body.appendChild(dialog);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  initialize();
})();
