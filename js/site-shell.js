
/* =========================================================
   TANDARA — SITE SHELL

   Jedini posao ovog filea:
   - učitati templates/site-shell.html
   - postaviti zajednički lijevi stupac
   - postaviti HR / EN poveznice
   - postaviti glavni izbornik
   - postaviti zajedničke ikone
   - po potrebi prikazati fotografiju autora
   - označiti trenutno otvorenu stranicu

   OVA DATOTEKA NE SADRŽI:
   - početno obiteljsko stablo
   - hotspotove
   - rodoslovne grane
   - podatke osoba
   - dijagrame
   - print
   - modalne prozore
   - posebne zakrpe za pojedine stranice
   ========================================================= */

(() => {
  "use strict";

  const script =
    document.currentScript;

  if (!script) {
    return;
  }

  const body =
    document.body;

  if (!body) {
    return;
  }

  const content =
    document.querySelector(
      "[data-site-content]"
    ) ||
    document.querySelector("main");

  if (!content) {
    return;
  }


  /* =======================================================
     OSNOVNE PUTANJE
     ======================================================= */

  const commonRoot =
    new URL(
      "../",
      script.src
    );

  const siteRoot =
    new URL(
      body.dataset.siteRoot || "./",
      document.baseURI
    );

  const templateUrl =
    new URL(
      "templates/site-shell.html",
      commonRoot
    );

  templateUrl.search =
    new URL(script.src).search;


  function commonUrl(path) {
    return new URL(
      path,
      commonRoot
    ).href;
  }

  function siteUrl(path) {
    return new URL(
      path,
      siteRoot
    ).href;
  }


  /* =======================================================
     JEZIK
     ======================================================= */

  const language =
    (
      document.documentElement.lang ||
      body.dataset.lang ||
      "hr"
    ).toLowerCase();

  const isEnglish =
    language.startsWith("en");


  /* =======================================================
     ZAJEDNIČKI TEKSTOVI
     ======================================================= */

  const TEXT = Object.freeze({
    hr: Object.freeze({
      siteTitle:
        "TANDARA-PREZIME",

      shellLabel:
        "Glavna navigacija",

      languageLabel:
        "Odabir jezika",

      navigationLabel:
        "Glavna navigacija",

      home:
        "Početna stranica"
    }),

    en: Object.freeze({
      siteTitle:
        "TANDARA-SURNAME",

      shellLabel:
        "Main navigation",

      languageLabel:
        "Language selection",

      navigationLabel:
        "Main navigation",

      home:
        "Home"
    })
  });

  const text =
    isEnglish
      ? TEXT.en
      : TEXT.hr;


  /* =======================================================
     GLAVNI IZBORNIK

     Ovo je jedino mjesto u novom shell sustavu
     gdje su definirani tekstovi i rute izbornika.
     ======================================================= */

  const NAVIGATION =
    Object.freeze({
      author: Object.freeze({
        hr: Object.freeze({
          label:
            "O autoru i projektu",
          route:
            "autor-hr.html"
        }),

        en: Object.freeze({
          label:
            "About the author and project",
          route:
            "autor-en.html"
        })
      }),

      origin: Object.freeze({
        hr: Object.freeze({
          label:
            "Podrijetlo prezimena",
          route:
            "podrijetlo-hr.html"
        }),

        en: Object.freeze({
          label:
            "Surname origin",
          route:
            "podrijetlo-en.html"
        })
      }),

      genealogy: Object.freeze({
        hr: Object.freeze({
          label:
            "Rodoslovlje roda",
          route:
            "rodoslovlje-hr.html"
        }),

        en: Object.freeze({
          label:
            "Family genealogy",
          route:
            "rodoslovlje-en.html"
        })
      }),

      migration: Object.freeze({
        hr: Object.freeze({
          label:
            "Migracije i rasprostranjenost",
          route:
            "migracije-hr.html"
        }),

        en: Object.freeze({
          label:
            "Migration and distribution",
          route:
            "migracije-en.html"
        })
      }),

      facts: Object.freeze({
        hr: Object.freeze({
          label:
            "Zanimljivosti",
          route:
            "zanimljivosti.html"
        }),

        en: Object.freeze({
          label:
            "Interesting facts",
          route:
            "zanimljivosti-en.html"
        })
      }),

      contact: Object.freeze({
        hr: Object.freeze({
          label:
            "Kontakt i suradnja",
          route:
            "kontakti.html"
        }),

        en: Object.freeze({
          label:
            "Contact and collaboration",
          route:
            "contacts.html"
        })
      }),

      guestbook: Object.freeze({
        hr: Object.freeze({
          label:
            "Knjiga poruka",
          route:
            "knjiga-poruka.html"
        }),

        en: Object.freeze({
          label:
            "Guestbook",
          route:
            "visitors-messages.html"
        })
      }),

      privacy: Object.freeze({
        hr: Object.freeze({
          label:
            "Politika privatnosti",
          route:
            "privatnost.html"
        }),

        en: Object.freeze({
          label:
            "Privacy policy",
          route:
            "privacy.html"
        })
      })
    });


  /* =======================================================
     ZAJEDNIČKE SLIKE
     ======================================================= */

  const IMAGES =
    Object.freeze({
      home:
        "slike/ikone/pocetna.png",

      menu:
        "slike/ikone/stablo.png",

      hrFlag:
        "slike/ikone/zastava-hr.png",

      enFlag:
        "slike/ikone/zastava-uk.png"
    });


  /* =======================================================
     POMOĆNE FUNKCIJE
     ======================================================= */

  function currentPathname() {
    return new URL(
      window.location.href
    ).pathname;
  }

  function markCurrentLink(link) {
    if (!link || !link.href) {
      return;
    }

    const linkUrl =
      new URL(
        link.href,
        document.baseURI
      );

    if (
      linkUrl.origin ===
        window.location.origin &&
      linkUrl.pathname ===
        currentPathname()
    ) {
      link.setAttribute(
        "aria-current",
        "page"
      );
    }
  }


  /* =======================================================
     POČETNA
     ======================================================= */

  function configureHome(shell) {
    const link =
      shell.querySelector(
        '[data-role="home-link"]'
      );

    const icon =
      shell.querySelector(
        '[data-role="home-icon"]'
      );

    const label =
      shell.querySelector(
        '[data-role="home-label"]'
      );

    if (link) {
      link.href =
        siteUrl(
          isEnglish
            ? "index-en.html"
            : "index.html"
        );

      link.setAttribute(
        "aria-label",
        text.home
      );
    }

    if (icon) {
      icon.src =
        commonUrl(
          IMAGES.home
        );
    }

    if (label) {
      label.textContent =
        text.home;
    }
  }


  /* =======================================================
     JEZIČNI PREKIDAČ
     ======================================================= */

  function configureLanguages(shell) {
    const navigation =
      shell.querySelector(
        '[data-role="language-switch"]'
      );

    const hrLink =
      shell.querySelector(
        '[data-role="hr-link"]'
      );

    const enLink =
      shell.querySelector(
        '[data-role="en-link"]'
      );

    const hrFlag =
      shell.querySelector(
        '[data-role="hr-flag"]'
      );

    const enFlag =
      shell.querySelector(
        '[data-role="en-flag"]'
      );

    if (hrFlag) {
      hrFlag.src =
        commonUrl(
          IMAGES.hrFlag
        );
    }

    if (enFlag) {
      enFlag.src =
        commonUrl(
          IMAGES.enFlag
        );
    }

    const hrPage =
      body.dataset.pageHr;

    const enPage =
      body.dataset.pageEn;

    if (
      !navigation ||
      !hrLink ||
      !enLink ||
      !hrPage ||
      !enPage
    ) {
      return;
    }

    navigation.setAttribute(
      "aria-label",
      text.languageLabel
    );

    hrLink.href =
      siteUrl(hrPage);

    enLink.href =
      siteUrl(enPage);

    const activeLink =
      isEnglish
        ? enLink
        : hrLink;

    activeLink.setAttribute(
      "aria-current",
      "page"
    );

    navigation.hidden =
      false;
  }


  /* =======================================================
     NASLOV SHELLA
     ======================================================= */

  function configureTitle(shell) {
    const title =
      shell.querySelector(
        '[data-role="site-title"]'
      );

    if (!title) {
      return;
    }

    title.textContent =
      text.siteTitle;
  }


  /* =======================================================
     GLAVNI IZBORNIK
     ======================================================= */

  function configureNavigation(shell) {
    const navigation =
      shell.querySelector(
        '[data-role="main-navigation"]'
      );

    if (navigation) {
      navigation.setAttribute(
        "aria-label",
        text.navigationLabel
      );
    }

    shell
      .querySelectorAll(
        "[data-nav-key]"
      )
      .forEach((link) => {
        const key =
          link.dataset.navKey;

        const item =
          NAVIGATION[key];

        if (!item) {
          link.closest("li")
            ?.remove();

          return;
        }

        const config =
          isEnglish
            ? item.en
            : item.hr;

        link.href =
          siteUrl(
            config.route
          );

        const label =
          link.querySelector(
            "span"
          );

        if (label) {
          label.textContent =
            config.label;
        } else {
          link.textContent =
            config.label;
        }

        markCurrentLink(link);
      });

    shell
      .querySelectorAll(
        '[data-role="menu-icon"]'
      )
      .forEach((icon) => {
        icon.src =
          commonUrl(
            IMAGES.menu
          );
      });
  }


  /* =======================================================
     AUTOR
     ======================================================= */

  function configureAuthor(shell) {
    const wrapper =
      shell.querySelector(
        '[data-role="author"]'
      );

    const link =
      shell.querySelector(
        '[data-role="author-link"]'
      );

    const image =
      shell.querySelector(
        '[data-role="author-image"]'
      );

    if (
      !wrapper ||
      !link ||
      !image
    ) {
      return;
    }

    const imagePath =
      body.dataset.authorImage;

    if (!imagePath) {
      return;
    }

    image.src =
      commonUrl(
        imagePath
      );

    link.href =
      siteUrl(
        isEnglish
          ? NAVIGATION.author.en.route
          : NAVIGATION.author.hr.route
      );

    wrapper.hidden =
      false;
  }


  /* =======================================================
     ARIA OZNAKE SHELLA
     ======================================================= */

  function configureShellLabel(shell) {
    shell.setAttribute(
      "aria-label",
      text.shellLabel
    );
  }


  /* =======================================================
     POSTAVLJANJE U STRANICU
     ======================================================= */

  function installShell(shell) {
    if (
      document.querySelector(
        "[data-role='site-shell']"
      )
    ) {
      return;
    }

    const existingLayout =
      content.closest(
        ".site-layout"
      );

    if (existingLayout) {
      existingLayout.prepend(
        shell
      );
    } else {
      const layout =
        document.createElement(
          "div"
        );

      layout.className =
        "site-layout";

      content.before(
        layout
      );

      layout.append(
        shell,
        content
      );
    }

    content.classList.add(
      "site-content"
    );

    body.classList.add(
      "site-shell-ready"
    );
  }


  /* =======================================================
     UČITAVANJE TEMPLATEA
     ======================================================= */

  function loadTemplate() {
    return fetch(
      templateUrl,
      {
        cache:
          "force-cache",

        credentials:
          "omit"
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
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
          parsed.getElementById(
            "tandara-site-shell"
          );

        if (
          !template ||
          !template.content
        ) {
          throw new Error(
            "Nije pronađen template #tandara-site-shell."
          );
        }

        const shell =
          template.content
            .querySelector(
              '[data-role="site-shell"]'
            )
            ?.cloneNode(true);

        if (!shell) {
          throw new Error(
            "Site shell nije pronađen u templateu."
          );
        }

        return shell;
      });
  }


  /* =======================================================
     POKRETANJE
     ======================================================= */

  function init() {
    if (
      body.dataset
        .siteShellReady ===
      "true"
    ) {
      return;
    }

    loadTemplate()
      .then((shell) => {
        configureShellLabel(shell);
        configureHome(shell);
        configureLanguages(shell);
        configureTitle(shell);
        configureNavigation(shell);
        configureAuthor(shell);
        installShell(shell);

        body.dataset
          .siteShellReady =
            "true";

        window.dispatchEvent(
          new CustomEvent(
            "tandara:site-shell-ready"
          )
        );
      })
      .catch((error) => {
        body.classList.add(
          "site-shell-unavailable"
        );

        console.error(
          "TANDARA site shell nije učitan:",
          error
        );
      });
  }


  /* =======================================================
     JAVNO SUČELJE
     ======================================================= */

  window.TandaraSiteShell =
    Object.freeze({
      init
    });


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
