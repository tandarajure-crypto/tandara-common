/* =========================================================
   TANDARA — SITE COMMON

   Jedini zajednički loader za:
   - index HR / EN / DE
   - 8 glavnih podstranica HR / EN / DE
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




  const mappedPage = window.TandaraLanguage?.pageInfo(fileName) || null;



  /* Language is resolved only by site-shell.js. */
  const currentLanguage = window.TandaraLanguage?.get() || "hr";

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

  // German navigation must remain available even on pages without
  // a dedicated German translation; use the German home page as fallback.
  const dePage =
    body.dataset.pageDe ||
    mappedPage?.de ||
    "index-de.html";



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
        "[data-text-hr][data-text-en], [data-text-de]"
      )
      .forEach((element) => {

        element.textContent =
          currentLanguage === "de"
            ? (element.dataset.textDe || element.dataset.textEn || element.dataset.textHr)
            : isHr
              ? element.dataset.textHr
              : element.dataset.textEn;

      });


    root
      .querySelectorAll(
        "[data-label-hr][data-label-en], [data-label-de]"
      )
      .forEach((element) => {

        element.setAttribute(
          "aria-label",
          currentLanguage === "de"
            ? (element.dataset.labelDe || element.dataset.labelEn || element.dataset.labelHr)
            : isHr
              ? element.dataset.labelHr
              : element.dataset.labelEn
        );

      });


    root
      .querySelectorAll(
        "[data-route-hr][data-route-en], [data-route-de]"
      )
      .forEach((link) => {

        const route =
          currentLanguage === "de"
            ? (link.dataset.routeDe || link.dataset.routeEn || link.dataset.routeHr)
            : isHr
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
    const hrLink = sidebar.querySelector('[data-role="hr-link"]');
    const enLink = sidebar.querySelector('[data-role="en-link"]');
    const deLink = sidebar.querySelector('[data-role="de-link"]');
    [[hrLink, hrPage, "hr"], [enLink, enPage, "en"], [deLink, dePage, "de"]].forEach(([link, page, language]) => {
      if (!link) return;
      if (page) link.href = siteUrl(page);
      else link.removeAttribute("href");
      if (currentLanguage === language) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      if (language === "de" && !page) link.hidden = true;
    });
  }


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
