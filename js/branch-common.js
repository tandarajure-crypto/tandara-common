/* TANDARA COMMON — jedini učitavač zajedničkog okvira stranice. */
(() => {
  "use strict";

  const loaderScript = document.currentScript;
  const body = document.body;
  const pageContent = document.querySelector("[data-page-content]") || document.querySelector("main");

  if (!loaderScript || !body || !pageContent) return;

  const lang = (document.documentElement.lang || body.dataset.lang || "hr").toLowerCase();
  const isHr = lang.startsWith("hr");
  const commonRoot = new URL("../", loaderScript.src);
  const siteRoot = new URL(body.dataset.siteRoot || "./", document.baseURI);
  const templateUrl = new URL("templates/branch-page-minimal.html", commonRoot);

  const siteUrl = (relativePath) => new URL(relativePath, siteRoot).href;
  const commonUrl = (relativePath) => new URL(relativePath, commonRoot).href;

  function localize(root) {
    root.querySelectorAll("[data-text-hr][data-text-en]").forEach((element) => {
      element.textContent = isHr ? element.dataset.textHr : element.dataset.textEn;
    });

    root.querySelectorAll("[data-label-hr][data-label-en]").forEach((element) => {
      element.setAttribute("aria-label", isHr ? element.dataset.labelHr : element.dataset.labelEn);
    });

    root.querySelectorAll("[data-route-hr][data-route-en]").forEach((link) => {
      link.href = siteUrl(isHr ? link.dataset.routeHr : link.dataset.routeEn);
    });

    root.querySelectorAll("[data-common-src]").forEach((image) => {
      image.src = commonUrl(image.dataset.commonSrc);
    });
  }

  function configureLanguageSwitch(sidebar) {
    const switcher = sidebar.querySelector('[data-role="language-switch"]');
    const hrLink = sidebar.querySelector('[data-role="hr-link"]');
    const enLink = sidebar.querySelector('[data-role="en-link"]');
    const hrPage = body.dataset.pageHr;
    const enPage = body.dataset.pageEn;

    if (!switcher || !hrLink || !enLink || !hrPage || !enPage) return;

    hrLink.href = siteUrl(hrPage);
    enLink.href = siteUrl(enPage);
    const activeLink = isHr ? hrLink : enLink;
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
    switcher.hidden = false;
  }

  function configureAuthorPhoto(sidebar) {
    const wrapper = sidebar.querySelector('[data-role="author-photo"]');
    const image = sidebar.querySelector('[data-role="author-image"]');
    const relativePath = body.dataset.authorImage;

    if (!wrapper || !image) return;
    if (!relativePath) {
      image.remove();
      return;
    }

    image.src = commonUrl(relativePath);
    wrapper.hidden = false;
  }

  function markCurrentPage(sidebar) {
    sidebar.querySelectorAll("a[href]").forEach((link) => {
      const linkUrl = new URL(link.href, document.baseURI);
      if (linkUrl.origin === location.origin && linkUrl.pathname === location.pathname) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function installShell(sidebar) {
    const existingLayout = pageContent.closest(".tandara-layout");
    if (existingLayout) {
      existingLayout.prepend(sidebar);
    } else {
      const layout = document.createElement("div");
      layout.className = "tandara-layout";
      pageContent.before(layout);
      layout.append(sidebar, pageContent);
    }

    pageContent.classList.add("tandara-page-content");
    body.classList.add("tandara-shell-ready");
    window.dispatchEvent(new CustomEvent("tandara:shell-ready"));
  }

  fetch(templateUrl, { cache: "force-cache", credentials: "omit" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((source) => {
      const parsed = new DOMParser().parseFromString(source, "text/html");
      const template = parsed.querySelector("#tandara-common-shell");
      const sidebar = template?.content?.firstElementChild?.cloneNode(true);
      if (!sidebar) throw new Error("Predložak ne sadrži #tandara-common-shell.");

      localize(sidebar);
      configureLanguageSwitch(sidebar);
      configureAuthorPhoto(sidebar);
      markCurrentPage(sidebar);
      installShell(sidebar);
    })
    .catch((error) => {
      body.classList.add("tandara-shell-unavailable");
      console.error("Tandara common okvir nije učitan:", error);
    });
})();
