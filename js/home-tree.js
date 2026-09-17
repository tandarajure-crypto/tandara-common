/* =========================================================
   TANDARA — HOME TREE

   Jedini posao ovog filea:
   - pronaći početno obiteljsko stablo
   - napraviti 10 hotspotova
   - postaviti HR / EN nazive
   - postaviti HR / EN poveznice

   OVA DATOTEKA NE SADRŽI:
   - lijevi stupac
   - site shell
   - sadržaj rodoslovnih grana
   - podatke osoba
   - logiku dijagrama
   - print
   - modalne prozore
   - CSS
   - stare zakrpe
   ========================================================= */

(() => {
  "use strict";

  const body = document.body;

  if (!body) {
    return;
  }

  const tree =
    document.querySelector(
      "[data-home-tree]"
    );

  if (!tree) {
    return;
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
     PUTANJE
     ======================================================= */

  const siteRoot =
    new URL(
      body.dataset.siteRoot || "./",
      document.baseURI
    );

  function siteUrl(path) {
    return new URL(
      path,
      siteRoot
    ).href;
  }


  /* =======================================================
     10 HOTSPOTOVA

     Ovo je jedino mjesto gdje početno stablo
     definira svoje ciljne stranice.
     ======================================================= */

  const HOTSPOTS =
    Object.freeze([
      Object.freeze({
        key: "jurina",

        hr: Object.freeze({
          label: "Jurina grana",
          route: "jurinagrana.html"
        }),

        en: Object.freeze({
          label: "Jure's branch",
          route: "jurinagrana-en.html"
        })
      }),

      Object.freeze({
        key: "petrova",

        hr: Object.freeze({
          label: "Petrova grana",
          route: "petrovagrana.html"
        }),

        en: Object.freeze({
          label: "Petar's branch",
          route: "petrovagrana-en.html"
        })
      }),

      Object.freeze({
        key: "antina",

        hr: Object.freeze({
          label: "Antina grana",
          route: "antinagrana.html"
        }),

        en: Object.freeze({
          label: "Ante's branch",
          route: "antinagrana-en.html"
        })
      }),

      Object.freeze({
        key: "matina",

        hr: Object.freeze({
          label: "Matina grana",
          route: "matinagrana.html"
        }),

        en: Object.freeze({
          label: "Mate's branch",
          route: "matinagrana-en.html"
        })
      }),

      Object.freeze({
        key: "ivanov",

        hr: Object.freeze({
          label: "Ivan Tandara",
          route: "box1.html"
        }),

        en: Object.freeze({
          label: "Ivan Tandara",
          route: "box1-en.html"
        })
      }),

      Object.freeze({
        key: "jurin",

        hr: Object.freeze({
          label: "Jure Tandara",
          route: "box2a.html"
        }),

        en: Object.freeze({
          label: "Jure Tandara",
          route: "box2a-en.html"
        })
      }),

      Object.freeze({
        key: "petrov",

        hr: Object.freeze({
          label: "Petar Tandara",
          route: "box2b.html"
        }),

        en: Object.freeze({
          label: "Petar Tandara",
          route: "box2b-en.html"
        })
      }),

      Object.freeze({
        key: "antin",

        hr: Object.freeze({
          label: "Ante Tandara",
          route: "box2c.html"
        }),

        en: Object.freeze({
          label: "Ante Tandara",
          route: "box2c-en.html"
        })
      }),

      Object.freeze({
        key: "matin",

        hr: Object.freeze({
          label: "Mate Tandara",
          route: "box2d.html"
        }),

        en: Object.freeze({
          label: "Mate Tandara",
          route: "box2d-en.html"
        })
      }),

      Object.freeze({
        key: "livanjske",

        hr: Object.freeze({
          label: "Livanjske Tandare",
          route: "filipovagrana.html"
        }),

        en: Object.freeze({
          label: "Livno Tandara branch",
          route: "filipovagrana-en.html"
        })
      })
    ]);


  /* =======================================================
     IZRADa JEDNOG HOTSPOTA
     ======================================================= */

  function createHotspot(item) {
    const config =
      isEnglish
        ? item.en
        : item.hr;

    const link =
      document.createElement("a");

    link.className =
      [
        "home-tree__hotspot",
        `home-tree__hotspot--${item.key}`
      ].join(" ");

    link.dataset.hotspot =
      item.key;

    link.href =
      siteUrl(
        config.route
      );

    link.setAttribute(
      "aria-label",
      config.label
    );

    if (
      item.key === "livanjske"
    ) {
      link.textContent =
        isEnglish
          ? "LIVNO TANDARA"
          : "LIVANJSKE TANDARE";
    }

    return link;
  }


  /* =======================================================
     POSTAVLJANJE HOTSPOTOVA
     ======================================================= */

  function installHotspots() {
    if (
      tree.dataset
        .homeTreeReady ===
      "true"
    ) {
      return;
    }

    if (
      tree.querySelector(
        ".home-tree__hotspot"
      )
    ) {
      tree.dataset
        .homeTreeReady =
          "true";

      return;
    }

    const fragment =
      document.createDocumentFragment();

    HOTSPOTS.forEach(
      (item) => {
        fragment.append(
          createHotspot(item)
        );
      }
    );

    tree.append(fragment);

    tree.dataset
      .homeTreeReady =
        "true";

    window.dispatchEvent(
      new CustomEvent(
        "tandara:home-tree-ready"
      )
    );
  }


  /* =======================================================
     JAVNO SUČELJE
     ======================================================= */

  window.TandaraHomeTree =
    Object.freeze({
      init:
        installHotspots
    });


  /* =======================================================
     POKRETANJE
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      installHotspots,
      {
        once: true
      }
    );
  } else {
    installHotspots();
  }
})();
