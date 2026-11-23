/* TANDARA COMMON — zajednički okvir za HR, EN i DE podstranice */

(() => {
  "use strict";


  const loaderScript =
    document.currentScript;

  const body =
    document.body;

  const main =
    document.querySelector("main");


  if (
    !loaderScript ||
    !body ||
    !main
  ) {
    return;
  }


  const pageMap = {
    "autor-hr.html": { key: "autor", lang: "hr", hr: "autor-hr.html", en: "autor-en.html", de: "autor-de.html" },
    "autor-en.html": { key: "autor", lang: "en", hr: "autor-hr.html", en: "autor-en.html", de: "autor-de.html" },
    "autor-de.html": { key: "autor", lang: "de", hr: "autor-hr.html", en: "autor-en.html", de: "autor-de.html" },
    "podrijetlo-hr.html": { key: "podrijetlo", lang: "hr", hr: "podrijetlo-hr.html", en: "podrijetlo-en.html", de: "podrijetlo-de.html" },
    "podrijetlo-en.html": { key: "podrijetlo", lang: "en", hr: "podrijetlo-hr.html", en: "podrijetlo-en.html", de: "podrijetlo-de.html" },
    "podrijetlo-de.html": { key: "podrijetlo", lang: "de", hr: "podrijetlo-hr.html", en: "podrijetlo-en.html", de: "podrijetlo-de.html" },
    "rodoslovlje-hr.html": { key: "rodoslovlje", lang: "hr", hr: "rodoslovlje-hr.html", en: "rodoslovlje-en.html", de: "rodoslovlje-de.html" },
    "rodoslovlje-en.html": { key: "rodoslovlje", lang: "en", hr: "rodoslovlje-hr.html", en: "rodoslovlje-en.html", de: "rodoslovlje-de.html" },
    "rodoslovlje-de.html": { key: "rodoslovlje", lang: "de", hr: "rodoslovlje-hr.html", en: "rodoslovlje-en.html", de: "rodoslovlje-de.html" },
    "migracije-hr.html": { key: "migracije", lang: "hr", hr: "migracije-hr.html", en: "migracije-en.html", de: "migracije-de.html" },
    "migracije-en.html": { key: "migracije", lang: "en", hr: "migracije-hr.html", en: "migracije-en.html", de: "migracije-de.html" },
    "migracije-de.html": { key: "migracije", lang: "de", hr: "migracije-hr.html", en: "migracije-en.html", de: "migracije-de.html" },
    "zanimljivosti.html": { key: "zanimljivosti", lang: "hr", hr: "zanimljivosti.html", en: "zanimljivosti-en.html", de: "zanimljivosti-de.html" },
    "zanimljivosti-en.html": { key: "zanimljivosti", lang: "en", hr: "zanimljivosti.html", en: "zanimljivosti-en.html", de: "zanimljivosti-de.html" },
    "zanimljivosti-de.html": { key: "zanimljivosti", lang: "de", hr: "zanimljivosti.html", en: "zanimljivosti-en.html", de: "zanimljivosti-de.html" },
    "kontakti.html": { key: "kontakti", lang: "hr", hr: "kontakti.html", en: "contacts.html", de: "kontakti-de.html" },
    "contacts.html": { key: "kontakti", lang: "en", hr: "kontakti.html", en: "contacts.html", de: "kontakti-de.html" },
    "kontakti-de.html": { key: "kontakti", lang: "de", hr: "kontakti.html", en: "contacts.html", de: "kontakti-de.html" },
    "knjiga-poruka.html": { key: "knjiga-poruka", lang: "hr", hr: "knjiga-poruka.html", en: "visitors-messages.html", de: "knjiga-poruka-de.html" },
    "visitors-messages.html": { key: "knjiga-poruka", lang: "en", hr: "knjiga-poruka.html", en: "visitors-messages.html", de: "knjiga-poruka-de.html" },
    "knjiga-poruka-de.html": { key: "knjiga-poruka", lang: "de", hr: "knjiga-poruka.html", en: "visitors-messages.html", de: "knjiga-poruka-de.html" },
    "privatnost.html": { key: "privatnost", lang: "hr", hr: "privatnost.html", en: "privacy.html", de: "privatnost-de.html" },
    "privacy.html": { key: "privatnost", lang: "en", hr: "privatnost.html", en: "privacy.html", de: "privatnost-de.html" },
    "privatnost-de.html": { key: "privatnost", lang: "de", hr: "privatnost.html", en: "privacy.html", de: "privatnost-de.html" }
  };


  const fileName =
    window.location.pathname
      .split("/")
      .pop() ||
    "index.html";


  const page =
    pageMap[fileName];


  const currentLanguage =
    page?.lang || "hr";


  const commonRoot =
    new URL(
      "../",
      loaderScript.src
    );


  const templateName = currentLanguage === "de" ? "templates/sidebar-de.html" : currentLanguage === "en" ? "templates/sidebar-en.html" : "templates/sidebar-hr.html";

  const templateUrl =
    new URL(
      templateName,
      commonRoot
    );


  const siteRoot =
    new URL(
      body.dataset.siteRoot || "./",
      document.baseURI
    );


  const siteUrl = (path) =>
    new URL(
      path,
      siteRoot
    ).href;



  function configureLinks(sidebar) {

    sidebar
      .querySelectorAll("a[href]")
      .forEach((link) => {

        const href =
          link.getAttribute("href");


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


        link.href =
          siteUrl(href);

      });


    if (!page) {
      return;
    }


    const hrLink =
      sidebar.querySelector(
        '[data-common-lang="hr"]'
      );


    const enLink =
      sidebar.querySelector(
        '[data-common-lang="en"]'
      );


    if (hrLink) {

      hrLink.href =
        siteUrl(page.hr);

      if (page.lang === "hr") {

        hrLink.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        hrLink.removeAttribute(
          "aria-current"
        );

      }

    }


    if (enLink) {

      enLink.href =
        siteUrl(page.en);

      if (page.lang === "en") {

        enLink.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        enLink.removeAttribute(
          "aria-current"
        );

      }

    }


    const germanLink = sidebar.querySelector('[data-common-lang="de"]');
    if (germanLink) {
      germanLink.href = siteUrl(page.de);
      if (page.lang === "de") germanLink.setAttribute("aria-current", "page");
      else germanLink.removeAttribute("aria-current");
    }

    const active =
      sidebar.querySelector(
        `[data-common-page="${page.key}"]`
      );


    if (active) {

      active.setAttribute(
        "aria-current",
        "page"
      );

    }

  }



  function activateFlagCounter(root) {

    root
      .querySelectorAll(
        "img[data-flag-counter-src]"
      )
      .forEach((image) => {

        const src =
          image.getAttribute(
            "data-flag-counter-src"
          );


        if (!src) {
          return;
        }


        image.src = src;

        image.removeAttribute(
          "data-flag-counter-src"
        );

      });

  }



  function createMobileTopbar(sidebar) {

    const nav =
      document.createElement("nav");


    nav.className =
      "mobile-box-topbar";


    nav.setAttribute(
      "aria-label",
      currentLanguage === "de" ? "Mobile Navigation" : currentLanguage === "en" ? "Mobile navigation" : "Mobilna navigacija"
    );


    const homeSource =
      sidebar.querySelector(
        ".home-button"
      );


    const languageSource =
      sidebar.querySelector(
        ".lang-switch"
      );


    if (homeSource) {

      const home =
        homeSource.cloneNode(true);


      home.className =
        "mobile-box-home";


      nav.append(home);

    }


    if (languageSource) {

      const languages =
        languageSource.cloneNode(true);


      languages.className =
        "mobile-box-flags";


      nav.append(languages);

    }


    const oldTopbar =
      document.querySelector(
        ".mobile-box-topbar"
      );


    if (oldTopbar) {

      oldTopbar.replaceWith(nav);

    } else {

      body.prepend(nav);

    }

  }



  function installSidebar(sidebar) {

    const oldSidebar =
      document.querySelector(
        ".left-menu"
      );


    if (oldSidebar) {

      oldSidebar.replaceWith(sidebar);

      return;

    }


    const existingLayout =
      main.closest(".layout");


    if (existingLayout) {

      existingLayout.prepend(
        sidebar
      );

      return;

    }


    const layout =
      document.createElement(
        "div"
      );


    layout.className =
      "layout";


    main.before(layout);


    layout.append(
      sidebar,
      main
    );

  }



  fetch(
    templateUrl,
    {
      cache: "force-cache"
    }
  )

    .then((response) => {

      if (!response.ok) {

        throw new Error(
          `${templateName}: HTTP ${response.status}`
        );

      }


      return response.text();

    })


    .then((source) => {

      const parsed =
        new DOMParser()
          .parseFromString(
            source,
            "text/html"
          );


      const sidebarId = currentLanguage === "de" ? "#common-sidebar-de" : currentLanguage === "en" ? "#common-sidebar-en" : "#common-sidebar-hr";


      const sidebar =
        parsed.querySelector(
          sidebarId
        );


      if (!sidebar) {

        throw new Error(
          `Nije pronađen ${sidebarId}.`
        );

      }


      const commonSidebar =
        sidebar.cloneNode(true);


      configureLinks(
        commonSidebar
      );


      activateFlagCounter(
        commonSidebar
      );


      installSidebar(
        commonSidebar
      );


      createMobileTopbar(
        commonSidebar
      );


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
