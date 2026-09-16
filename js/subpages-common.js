/* TANDARA COMMON — zajednički okvir za 8 glavnih HR podstranica */
(() => {
  "use strict";

  const loaderScript = document.currentScript;
  const body = document.body;
  const main = document.querySelector("main");

  if (!loaderScript || !body || !main) return;

  const pageMap = {
    "autor-hr.html": {
      key: "autor",
      hr: "autor-hr.html",
      en: "autor-en.html"
    },
    "podrijetlo-hr.html": {
      key: "podrijetlo",
      hr: "podrijetlo-hr.html",
      en: "podrijetlo-en.html"
    },
    "rodoslovlje-hr.html": {
      key: "rodoslovlje",
      hr: "rodoslovlje-hr.html",
      en: "rodoslovlje-en.html"
    },
    "migracije-hr.html": {
      key: "migracije",
      hr: "migracije-hr.html",
      en: "migracije-en.html"
    },
    "zanimljivosti.html": {
      key: "zanimljivosti",
      hr: "zanimljivosti.html",
      en: "zanimljivosti-en.html"
    },
    "kontakti.html": {
      key: "kontakti",
      hr: "kontakti.html",
      en: "contacts.html"
    },
    "knjiga-poruka.html": {
      key: "knjiga-poruka",
      hr: "knjiga-poruka.html",
      en: "visitors-messages.html"
    },
    "privatnost.html": {
      key: "privatnost",
      hr: "privatnost.html",
      en: "privacy.html"
    }
  };

  const fileName =
    window.location.pathname.split("/").pop() || "index.html";

  const page = pageMap[fileName];

  const commonRoot = new URL("../", loaderScript.src);
  const templateUrl =
    new URL("templates/sidebar-hr.html", commonRoot);

  const siteRoot =
    new URL(body.dataset.siteRoot || "./", document.baseURI);

  const siteUrl = (path) =>
    new URL(path, siteRoot).href;

  function configureLinks(sidebar) {
    sidebar.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      link.href = siteUrl(href);
    });

    if (!page) return;

    const hrLink =
      sidebar.querySelector('[data-common-lang="hr"]');

    const enLink =
      sidebar.querySelector('[data-common-lang="en"]');

    if (hrLink) {
      hrLink.href = siteUrl(page.hr);
      hrLink.setAttribute("aria-current", "page");
    }

    if (enLink) {
      enLink.href = siteUrl(page.en);
    }

    const active =
      sidebar.querySelector(
        `[data-common-page="${page.key}"]`
      );

    if (active) {
      active.setAttribute("aria-current", "page");
    }
  }

  function activateFlagCounter(root) {
    root
      .querySelectorAll("img[data-flag-counter-src]")
      .forEach((image) => {
        const src =
          image.getAttribute("data-flag-counter-src");

        if (!src) return;

        image.src = src;
        image.removeAttribute("data-flag-counter-src");
      });
  }

  function createMobileTopbar(sidebar) {
    const nav = document.createElement("nav");
    nav.className = "mobile-box-topbar";
    nav.setAttribute(
      "aria-label",
      "Mobilna navigacija"
    );

    const homeSource =
      sidebar.querySelector(".home-button");

    const languageSource =
      sidebar.querySelector(".lang-switch");

    if (homeSource) {
      const home =
        homeSource.cloneNode(true);

      home.className = "mobile-box-home";
      nav.append(home);
    }

    if (languageSource) {
      const languages =
        languageSource.cloneNode(true);

      languages.className = "mobile-box-flags";
      nav.append(languages);
    }

    const oldTopbar =
      document.querySelector(".mobile-box-topbar");

    if (oldTopbar) {
      oldTopbar.replaceWith(nav);
    } else {
      body.prepend(nav);
    }
  }

  function installSidebar(sidebar) {
    const oldSidebar =
      document.querySelector(".left-menu");

    if (oldSidebar) {
      oldSidebar.replaceWith(sidebar);
      return;
    }

    const existingLayout =
      main.closest(".layout");

    if (existingLayout) {
      existingLayout.prepend(sidebar);
      return;
    }

    const layout =
      document.createElement("div");

    layout.className = "layout";

    main.before(layout);
    layout.append(sidebar, main);
  }

  fetch(templateUrl, {
    cache: "force-cache"
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `sidebar-hr.html: HTTP ${response.status}`
        );
      }

      return response.text();
    })
    .then((source) => {
      const parsed =
        new DOMParser().parseFromString(
          source,
          "text/html"
        );

      const sidebar =
        parsed.querySelector("#common-sidebar-hr");

      if (!sidebar) {
        throw new Error(
          "Nije pronađen #common-sidebar-hr."
        );
      }

      const commonSidebar =
        sidebar.cloneNode(true);

      configureLinks(commonSidebar);
      activateFlagCounter(commonSidebar);
      installSidebar(commonSidebar);
      createMobileTopbar(commonSidebar);

      body.classList.add(
        "tandara-subpages-common-ready"
      );
    })
    .catch((error) => {
      console.error(
        "TANDARA common sidebar nije učitan:",
        error
      );
    });
})();
