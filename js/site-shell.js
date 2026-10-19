/* =========================================================
   TANDARA — SITE SHELL

   Zajednički loader lijevog stupca za:
   - index HR / EN
   - glavne podstranice
   - glavne rodoslovne grane HR / EN

   OVA DATOTEKA POSTAVLJA:
   - HR zastavu
   - HOME
   - EN zastavu
   - naslov
   - glavni izbornik
   - AUTOR / AUTHOR
   - fotografiju autora
   - Jure / Tandara
   - FlagCounter
   - pokreće zajedničku objavu iz zasebnog modula

   OVA DATOTEKA NE SADRŽI:
   - početno obiteljsko stablo
   - hotspotove
   - rodoslovne podatke
   - dijagrame
   - print
   - izgled i ponašanje modalne objave
   - posebne zakrpe pojedinih grana
   ========================================================= */

(() => {
  "use strict";


  /* =======================================================
     OSNOVNI ELEMENTI
     ======================================================= */

  const script =
    document.currentScript;

  const body =
    document.body;

  if (
    !script ||
    !body
  ) {
    return;
  }


  // Owner-confirmed deceased portraits, 2026-10-19. Only these three IDs are changed.
  (() => {
    const records = [
      ['4.1.1.4.5-K1', 'Dragica Nikolina', 'Dragica Nikolina', '1937', '2015', 'matinagrana/dragicanikolina.jpg'],
      ['3.1.1.1.4.1.1-SP-1', 'Marija rođ. Lekić', 'Marija née Lekić', '1939', '2021', 'antinagrana/marijanikolina.jpg'],
      ['3.1.2.3.2.2-SP-1', 'Danica rođ. Malenica', 'Danica née Malenica', '1935', '2016', 'antinagrana/danicamatina.jpg']
    ];
    const en = (document.documentElement.lang || '').startsWith('en');
    const dataEl = document.getElementById('diagramData');
    const data = dataEl ? JSON.parse(dataEl.textContent) : null;
    for (const [code, hr, english, birth, death, file] of records) {
      const name = en ? english : hr;
      const src = 'https://tandarajure-crypto.github.io/tandara-common/slike/' + file;
      const dates = en ? `(${birth}–${death})` : `(${birth}.–${death}.)`;
      if (data) {
        for (const group of [data.nodes, data.primary]) {
          const person = group && group[code];
          if (!person) continue;
          const wasProtected = person.protected;
          Object.assign(person, {label:hr, labelEn:english, birth, death, protected:false,
            photo:src, photoEn:src, photoAlt:hr, photoAltEn:english,
            photoCaption:hr, photoCaptionEn:english,
            photos:[{src, caption:name, alt:name}]});
          if (wasProtected) {
            person.detail = `${hr} (${birth}.–${death}.)`;
            person.detailEn = `${english} (${birth}–${death})`;
          }
        }
        continue;
      }
      const entry = [...document.querySelectorAll('span[data-person-code]')].find(el => el.dataset.personCode === code);
      if (!entry) continue;
      const strong = document.createElement('strong'); strong.textContent = code;
      const life = document.createElement('span'); life.className = 'life-date'; life.textContent = dates;
      entry.replaceChildren(strong, document.createTextNode(' ' + name + ' '), life);
      const list = entry.closest('.family-code-list') || entry.closest('p');
      if (!list) continue;
      // Correct the existing family paragraph without copying any other family data.
      const paragraph = list.previousElementSibling;
      if (paragraph && paragraph.tagName === 'P') {
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          let value = walker.currentNode.textContent;
          if (code === '3.1.1.1.4.1.1-SP-1') value = value.replace(/Marija (?:rođ\. |née )?Lukić/g, name);
          if (code === '3.1.2.3.2.2-SP-1') value = value.replace(/Danica Malenica \((?:godine nisu poznate|years unknown)\)/g, name + ' ' + dates);
          if (code === '4.1.1.4.5-K1') value = value.replace(/Dragica \(1937\.?[–-]\)/g, name + ' ' + dates);
          walker.currentNode.textContent = value;
        }
      }
      if (document.querySelector(`[data-memorial-code="${code}"]`)) continue;
      const gallery = document.createElement('div'); gallery.className = 'person-photo-gallery'; gallery.dataset.memorialCode = code;
      const figure = document.createElement('figure'); figure.className = 'person-photo'; figure.dataset.personCode = code;
      const a = document.createElement('a'); a.href = src; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const img = document.createElement('img'); img.src = src; img.alt = name; img.loading = 'lazy'; img.decoding = 'async';
      const caption = document.createElement('figcaption'); caption.textContent = name + ' ' + dates;
      a.append(img); figure.append(a, caption); gallery.append(figure); list.after(gallery);
    }
    // The shared grave belongs to Nikola's record; Marija's record now has her portrait.
    for (const figure of document.querySelectorAll('figure[data-person-codes]')) {
      const codes = figure.dataset.personCodes.split(/\s+/);
      if (codes.includes('3.1.1.1.4.1.1-SP-1') && codes.includes('3.1.1.1.4.1.1')) {
        figure.dataset.personCodes = codes.filter(code => code !== '3.1.1.1.4.1.1-SP-1').join(' ');
        const cap = figure.querySelector('figcaption');
        if (cap) cap.textContent = cap.textContent.replace(/Marija Lukić/g, 'Marija Lekić');
        const img = figure.querySelector('img');
        if (img) img.alt = img.alt.replace(/Marija Lukić/g, 'Marija Lekić');
      }
    }
    if (dataEl) {
      if (data.meta) data.meta.protectedCount = Object.values(data.nodes || {}).filter(n => n.protected).length;
      dataEl.textContent = JSON.stringify(data);
    }
  })();

  // Optional public-only record supplement. Private sites never load this file.
  if (location.hostname === 'tandarajure-crypto.github.io' && location.pathname.startsWith('/Tandara/')) {
    window.tandaraPublicRecordsReady = new Promise(resolve => {
      const supplement = document.createElement('script');
      supplement.src = new URL('js/public-memorials.js?v=20261019-3', new URL('/Tandara/', location.origin)).href;
      supplement.onload = resolve;
      supplement.onerror = () => { console.error('TANDARA: public memorial supplement unavailable.'); resolve(); };
      document.head.appendChild(supplement);
    });
  }

  /* =======================================================
     ZAJEDNIČKA OBJAVA
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


  if (
    !document.querySelector(
      "script[data-tandara-announcement-loader]"
    )
  ) {

    const announcementUrl =
      new URL(
        "js/announcement.js",
        commonRoot
      );


    announcementUrl.search =
      new URL(
        script.src
      ).search;


    const announcementScript =
      document.createElement(
        "script"
      );


    announcementScript.src =
      announcementUrl.href;


    announcementScript.dataset
      .tandaraAnnouncementLoader =
        "true";


    announcementScript.dataset
      .siteRoot =
        siteRoot.href;


    document.head.appendChild(
      announcementScript
    );

  }


  const content =
    document.querySelector(
      "[data-site-content]"
    ) ||
    document.querySelector(
      "main"
    );

  if (!content) {
    return;
  }


  /* =======================================================
     PUTANJE
     ======================================================= */

  const templateUrl =
    new URL(
      "templates/site-shell.html",
      commonRoot
    );


  /*
     Verzija sa site-shell.js prenosi se
     i na template radi osvježavanja cachea.
  */

  templateUrl.search =
    new URL(
      script.src
    ).search;


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
    )
      .trim()
      .toLowerCase();


  const isEnglish =
    language.startsWith(
      "en"
    );


  /* =======================================================
     TEKSTOVI
     ======================================================= */

  const TEXT =
    Object.freeze({

      hr:
        Object.freeze({

          siteTitle:
            "TANDARA-PREZIME",

          shellLabel:
            "Glavna navigacija",

          languageLabel:
            "Jezik i početna stranica",

          navigationLabel:
            "Glavni izbornik",

          home:
            "Početna stranica",

          author:
            "AUTOR",

          visitors:
            "Posjetitelji"
        }),


      en:
        Object.freeze({

          siteTitle:
            "TANDARA — SURNAME",

          shellLabel:
            "Main navigation",

          languageLabel:
            "Language and home page",

          navigationLabel:
            "Main navigation",

          home:
            "Home",

          author:
            "AUTHOR",

          visitors:
            "Visitors"
        })

    });


  const text =
    isEnglish
      ? TEXT.en
      : TEXT.hr;


  /* =======================================================
     GLAVNI IZBORNIK

     Tekst i rute usklađeni su sa zajedničkim
     lijevim stupcem glavnih stranica.
     ======================================================= */

  const NAVIGATION =
    Object.freeze({

      author:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "O autoru i projektu",

              route:
                "autor-hr.html"
            }),

          en:
            Object.freeze({
              label:
                "About the Author and Project",

              route:
                "autor-en.html"
            })

        }),


      origin:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Podrijetlo prezimena",

              route:
                "podrijetlo-hr.html"
            }),

          en:
            Object.freeze({
              label:
                "Origin of the Surname",

              route:
                "podrijetlo-en.html"
            })

        }),


      genealogy:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Rodoslovlje roda",

              route:
                "rodoslovlje-hr.html"
            }),

          en:
            Object.freeze({
              label:
                "Family Genealogy",

              route:
                "rodoslovlje-en.html"
            })

        }),


      migration:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Migracije i rasprostranjenost",

              route:
                "migracije-hr.html"
            }),

          en:
            Object.freeze({
              label:
                "Migration and Distribution",

              route:
                "migracije-en.html"
            })

        }),


      life:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Život kroz tri stoljeća",

              route:
                "zivot.html"
            }),

          en:
            Object.freeze({
              label:
                "Life Across Three Centuries",

              route:
                "zivot-en.html"
            })

        }),


      facts:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Zanimljivosti",

              route:
                "zanimljivosti.html"
            }),

          en:
            Object.freeze({
              label:
                "Interesting Facts",

              route:
                "zanimljivosti-en.html"
            })

        }),


      instructions:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Upute",

              route:
                "upute.html"
            }),

          en:
            Object.freeze({
              label:
                "Instructions",

              route:
                "upute-en.html"
            })

        }),


      contact:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Kontakt i suradnja",

              route:
                "kontakti.html"
            }),

          en:
            Object.freeze({
              label:
                "Contact and Collaboration",

              route:
                "contacts.html"
            })

        }),


      guestbook:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Knjiga poruka",

              route:
                "knjiga-poruka.html"
            }),

          en:
            Object.freeze({
              label:
                "Visitor Messages",

              route:
                "visitors-messages.html"
            })

        }),


      privacy:
        Object.freeze({

          hr:
            Object.freeze({
              label:
                "Politika privatnosti",

              route:
                "privatnost.html"
            }),

          en:
            Object.freeze({
              label:
                "Privacy Policy",

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
        "slike/ikone/zastava-uk.png",

      author:
        "slike/common-foto/jure.webp"

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
    if (
      !link ||
      !link.href
    ) {
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
     HOME
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
     HR / EN
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
      !enLink
    ) {
      return;
    }


    navigation.setAttribute(
      "aria-label",
      text.languageLabel
    );


    if (hrPage) {

      hrLink.href =
        siteUrl(
          hrPage
        );

    } else {

      hrLink.removeAttribute(
        "href"
      );

    }


    if (enPage) {

      enLink.href =
        siteUrl(
          enPage
        );

    } else {

      enLink.removeAttribute(
        "href"
      );

    }


    if (!isEnglish) {

      hrLink.setAttribute(
        "aria-current",
        "page"
      );

      enLink.removeAttribute(
        "aria-current"
      );

    } else {

      enLink.setAttribute(
        "aria-current",
        "page"
      );

      hrLink.removeAttribute(
        "aria-current"
      );

    }


    navigation.hidden =
      false;

  }


  /* =======================================================
     NASLOV
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
      .forEach(
        (link) => {

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


          markCurrentLink(
            link
          );

        }
      );


    shell
      .querySelectorAll(
        '[data-role="menu-icon"]'
      )
      .forEach(
        (icon) => {

          icon.src =
            commonUrl(
              IMAGES.menu
            );

        }
      );

  }


  /* =======================================================
     AUTOR

     AUTOR | fotografija | Jure
                        | Tandara
     ======================================================= */

  function configureAuthor(shell) {

    const wrapper =
      shell.querySelector(
        '[data-role="author"]'
      );


    const label =
      shell.querySelector(
        '[data-role="author-label"]'
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


    if (label) {

      label.textContent =
        text.author;

    }


    const imagePath =
      body.dataset.authorImage ||
      IMAGES.author;


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
     FLAGCOUNTER
     ======================================================= */

  function configureFlagCounter(shell) {

    const title =
      shell.querySelector(
        '[data-role="flag-counter-title"]'
      );


    const image =
      shell.querySelector(
        '[data-role="flag-counter-image"]'
      );


    if (title) {

      title.textContent =
        text.visitors;

    }


    if (!image) {
      return;
    }


    if (
      window.location.hostname.toLowerCase() ===
      "privat-tvz.pages.dev"
    ) {

      image.setAttribute(
        "data-flag-counter-src",
        "/__flagcounter"
      );

      const link =
        image.closest("a");

      if (link) {
        link.href =
          "/__flagcounter/stats";
      }

    }


    const source =
      image.getAttribute(
        "data-flag-counter-src"
      );


    if (!source) {
      return;
    }


    image.src =
      source;


    image.removeAttribute(
      "data-flag-counter-src"
    );

  }


  /* =======================================================
     ARIA SHELLA
     ======================================================= */

  function configureShellLabel(shell) {

    shell.setAttribute(
      "aria-label",
      text.shellLabel
    );

  }


  /* =======================================================
     POSTAVLJANJE SHELLA
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

      .then(
        (response) => {

          if (!response.ok) {

            throw new Error(
              `HTTP ${response.status}`
            );

          }


          return response.text();

        }
      )


      .then(
        (source) => {

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
              ?.cloneNode(
                true
              );


          if (!shell) {

            throw new Error(
              "Site shell nije pronađen u templateu."
            );

          }


          return shell;

        }
      );

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

      .then(
        (shell) => {

          configureShellLabel(
            shell
          );

          configureHome(
            shell
          );

          configureLanguages(
            shell
          );

          configureTitle(
            shell
          );

          configureNavigation(
            shell
          );

          configureAuthor(
            shell
          );

          configureFlagCounter(
            shell
          );

          installShell(
            shell
          );


          body.dataset
            .siteShellReady =
              "true";


          window.dispatchEvent(
            new CustomEvent(
              "tandara:site-shell-ready"
            )
          );

        }
      )


      .catch(
        (error) => {

          body.classList.add(
            "site-shell-unavailable"
          );


          console.error(
            "TANDARA site shell nije učitan:",
            error
          );

        }
      );

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


