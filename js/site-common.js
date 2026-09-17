/* =========================================================
   TANDARA — SITE COMMON

   Jedini zajednički loader za:
   - index HR / EN
   - 8 glavnih podstranica HR / EN
   - grane
   - dijagrame
   - box stranice

   Ovaj file NE sadrži:
   - sadržaj stranica
   - dijagrame
   - hotspotove
   - genealogiju
   - posebne funkcije pojedinih stranica
   ========================================================= */

(() => {
  "use strict";


  /* =======================================================
     OSNOVNI PODACI
     ======================================================= */

  const loaderScript =
    document.currentScript;

  const body =
    document.body;

  const pageContent =
    document.querySelector("[data-page-content]") ||
    document.querySelector("main");


  if (
    !loaderScript ||
    !body ||
    !pageContent
  ) {
    return;
  }


  const fileName =
    window.location.pathname
      .split("/")
      .pop() ||
    "index.html";


  const commonRoot =
    new URL(
      "../",
      loaderScript.src
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


  const commonUrl = (path) =>
    new URL(
      path,
      commonRoot
    ).href;



  /* =======================================================
     8 GLAVNIH PODSTRANICA

     Ovdje se NE nalazi njihov sadržaj.
     Samo odnos HR ↔ EN i ključ aktivnog menija.
     ======================================================= */

  const pageMap = {

    "autor-hr.html": {
      key: "autor",
      lang: "hr",
      hr: "autor-hr.html",
      en: "autor-en.html"
    },

    "autor-en.html": {
      key: "autor",
      lang: "en",
      hr: "autor-hr.html",
      en: "autor-en.html"
    },


    "podrijetlo-hr.html": {
      key: "podrijetlo",
      lang: "hr",
      hr: "podrijetlo-hr.html",
      en: "podrijetlo-en.html"
    },

    "podrijetlo-en.html": {
      key: "podrijetlo",
      lang: "en",
      hr: "podrijetlo-hr.html",
      en: "podrijetlo-en.html"
    },


    "rodoslovlje-hr.html": {
      key: "rodoslovlje",
      lang: "hr",
      hr: "rodoslovlje-hr.html",
      en: "rodoslovlje-en.html"
    },

    "rodoslovlje-en.html": {
      key: "rodoslovlje",
      lang: "en",
      hr: "rodoslovlje-hr.html",
      en: "rodoslovlje-en.html"
    },


    "migracije-hr.html": {
      key: "migracije",
      lang: "hr",
      hr: "migracije-hr.html",
      en: "migracije-en.html"
    },

    "migracije-en.html": {
      key: "migracije",
      lang: "en",
      hr: "migracije-hr.html",
      en: "migracije-en.html"
    },


    "zanimljivosti.html": {
      key: "zanimljivosti",
      lang: "hr",
      hr: "zanimljivosti.html",
      en: "zanimljivosti-en.html"
    },

    "zanimljivosti-en.html": {
      key: "zanimljivosti",
      lang: "en",
      hr: "zanimljivosti.html",
      en: "zanimljivosti-en.html"
    },


    "kontakti.html": {
      key: "kontakti",
      lang: "hr",
      hr: "kontakti.html",
      en: "contacts.html"
    },

    "contacts.html": {
      key: "kontakti",
      lang: "en",
      hr: "kontakti.html",
      en: "contacts.html"
    },


    "knjiga-poruka.html": {
      key: "knjiga-poruka",
      lang: "hr",
      hr: "knjiga-poruka.html",
      en: "visitors-messages.html"
    },

    "visitors-messages.html": {
      key: "knjiga-poruka",
      lang: "en",
      hr: "knjiga-poruka.html",
      en: "visitors-messages.html"
    },


    "privatnost.html": {
      key: "privatnost",
      lang: "hr",
      hr: "privatnost.html",
      en: "privacy.html"
    },

    "privacy.html": {
      key: "privatnost",
      lang: "en",
      hr: "privatnost.html",
      en: "privacy.html"
    }

  };


  const mappedPage =
    pageMap[fileName] || null;



  /* =======================================================
     JEZIK

     Prioritet:
     1. <html lang="">
     2. pageMap
     3. body data-lang
     4. HR kao sigurni fallback
     ======================================================= */

  const htmlLanguage =
    (
      document.documentElement.lang ||
      ""
    )
      .trim()
      .toLowerCase();


  let currentLanguage = "hr";


  if (htmlLanguage.startsWith("en")) {

    currentLanguage = "en";

  } else if (htmlLanguage.startsWith("hr")) {

    currentLanguage = "hr";

  } else if (mappedPage?.lang) {

    currentLanguage =
      mappedPage.lang;

  } else if (
    (
      body.dataset.lang ||
      ""
    )
      .toLowerCase()
      .startsWith("en")
  ) {

    currentLanguage = "en";

  }


  const isHr =
    currentLanguage === "hr";



  /* =======================================================
     HR / EN PAR TRENUTNE STRANICE

     Za index, grane, dijagrame i boxove koristi:
       data-page-hr
       data-page-en

     Za 8 glavnih podstranica koristi pageMap.
     ======================================================= */

  const hrPage =
    body.dataset.pageHr ||
    mappedPage?.hr ||
    null;


  const enPage =
    body.dataset.pageEn ||
    mappedPage?.en ||
    null;



  /* =======================================================
     UČITAJ JEDINI ZAJEDNIČKI CSS

     HTML stranice ne trebaju ponavljati
     <link> za site-common.css.
     ======================================================= */

  function ensureCommonCss() {

    const existing =
      document.querySelector(
        'link[data-tandara-site-common]'
      );


    if (existing) {
      return;
    }


    const link =
      document.createElement("link");


    link.rel =
      "stylesheet";


    link.href =
      commonUrl(
        "css/site-common.css"
      );


    link.dataset.tandaraSiteCommon =
      "true";


    document.head.append(link);

  }



  /* =======================================================
     LOKALIZACIJA TEMPLATEA
     ======================================================= */

  function localize(root) {

    root
      .querySelectorAll(
        "[data-text-hr][data-text-en]"
      )
      .forEach((element) => {

        element.textContent =
          isHr
            ? element.dataset.textHr
            : element.dataset.textEn;

      });


    root
      .querySelectorAll(
        "[data-label-hr][data-label-en]"
      )
      .forEach((element) => {

        element.setAttribute(
          "aria-label",
          isHr
            ? element.dataset.labelHr
            : element.dataset.labelEn
        );

      });


    root
      .querySelectorAll(
        "[data-route-hr][data-route-en]"
      )
      .forEach((link) => {

        const route =
          isHr
            ? link.dataset.routeHr
            : link.dataset.routeEn;


        if (!route) {
          return;
        }


        link.href =
          siteUrl(route);

      });


    root
      .querySelectorAll(
        "[data-common-src]"
      )
      .forEach((image) => {

        const path =
          image.dataset.commonSrc;


        if (!path) {
          return;
        }


        image.src =
          commonUrl(path);

      });

  }



  /* =======================================================
     HR I EN ZASTAVE

     data-page-hr / data-page-en omogućuju da isti
     loader radi i na svim budućim dijagramima.
     ======================================================= */

  function configureLanguageLinks(sidebar) {

    const hrLink =
      sidebar.querySelector(
        '[data-role="hr-link"]'
      );


    const enLink =
      sidebar.querySelector(
        '[data-role="en-link"]'
      );


    if (hrLink) {

      if (hrPage) {

        hrLink.href =
          siteUrl(hrPage);

      } else {

        hrLink.removeAttribute(
          "href"
        );

      }


      if (isHr) {

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

      if (enPage) {

        enLink.href =
          siteUrl(enPage);

      } else {

        enLink.removeAttribute(
          "href"
        );

      }


      if (!isHr) {

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

  }



  /* =======================================================
     AKTIVNI PODNASLOV

     Za osam glavnih stranica dobiva se automatski.

     Za neku buduću posebnu stranicu može se koristiti:
       data-page-key="autor"
     itd.
     ======================================================= */

  function markActiveMenu(sidebar) {

    const activeKey =
      body.dataset.pageKey ||
      mappedPage?.key ||
      null;


    if (!activeKey) {
      return;
    }


    const active =
      sidebar.querySelector(
        `[data-page-key="${activeKey}"]`
      );


    if (!active) {
      return;
    }


    active.setAttribute(
      "aria-current",
      "page"
    );

  }



  /* =======================================================
     FLAGCOUNTER

     Izvor se aktivira tek nakon što je template učitan.
     ======================================================= */

  function activateFlagCounter(sidebar) {

    sidebar
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



  /* =======================================================
     UKLANJANJE STAROG ZAJEDNIČKOG SIDEBARA

     Ovo sprječava slučajno dvostruko prikazivanje
     tijekom prijelaza na novi sustav.
     ======================================================= */

  function removeOldCommonSidebars() {

    document
      .querySelectorAll(
        [
          "#common-sidebar-hr",
          "#common-sidebar-en",
          "#common-sidebar",
          "#tandara-common-sidebar",
          ".left-menu",
          ".tandara-sidebar"
        ].join(",")
      )
      .forEach((sidebar) => {

        sidebar.remove();

      });

  }



  /* =======================================================
     JEDINI ZAJEDNIČKI SHELL

     Ako već postoji stari .layout ili .tandara-layout,
     koristi se postojeći wrapper.

     Ne izrađuje se drugi wrapper.
     ======================================================= */

  function installSidebar(sidebar) {

    removeOldCommonSidebars();


    const existingLayout =
      pageContent.closest(
        ".tandara-layout, .layout"
      );


    if (existingLayout) {

      existingLayout.classList.remove(
        "layout"
      );


      existingLayout.classList.add(
        "tandara-layout"
      );


      existingLayout.prepend(
        sidebar
      );


    } else {

      const layout =
        document.createElement(
          "div"
        );


      layout.className =
        "tandara-layout";


      pageContent.before(
        layout
      );


      layout.append(
        sidebar,
        pageContent
      );

    }


    pageContent.classList.add(
      "tandara-page-content"
    );


    body.classList.add(
      "tandara-site-common-ready"
    );


    window.dispatchEvent(
      new CustomEvent(
        "tandara:site-common-ready"
      )
    );

  }



  /* =======================================================
     UČITAVANJE JEDINOG TEMPLATEA
     ======================================================= */

  function loadSidebar() {

    const templateUrl =
      new URL(
        "templates/sidebar-common.html",
        commonRoot
      );


    /*
      Ako site-common.js ima ?v=...
      isti broj dobiva i template.

      Tako se cache može osvježiti na jednom mjestu.
    */

    const scriptUrl =
      new URL(
        loaderScript.src
      );


    templateUrl.search =
      scriptUrl.search;


    fetch(
      templateUrl,
      {
        cache: "force-cache",
        credentials: "omit"
      }
    )

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            `sidebar-common.html: HTTP ${response.status}`
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


        const template =
          parsed.querySelector(
            "#tandara-common-sidebar-template"
          );


        const sidebar =
          template
            ?.content
            ?.firstElementChild
            ?.cloneNode(true);


        if (!sidebar) {

          throw new Error(
            "Nije pronađen #tandara-common-sidebar-template."
          );

        }


        localize(
          sidebar
        );


        configureLanguageLinks(
          sidebar
        );


        markActiveMenu(
          sidebar
        );


        activateFlagCounter(
          sidebar
        );


        installSidebar(
          sidebar
        );

      })


      .catch((error) => {

        body.classList.add(
          "tandara-site-common-unavailable"
        );


        console.error(
          "TANDARA zajednički sidebar nije učitan:",
          error
        );

      });

  }



  /* =======================================================
     POKRETANJE
     ======================================================= */

  ensureCommonCss();

  loadSidebar();

})();
