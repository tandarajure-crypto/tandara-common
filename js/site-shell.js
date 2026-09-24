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

   OVA DATOTEKA NE SADRŽI:
   - početno obiteljsko stablo
   - hotspotove
   - rodoslovne podatke
   - dijagrame
   - print
   - modalne prozore
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

/* =========================================================
   TANDARA — SMART DIAGRAM SEARCH V4 2026-09-24

   Jedinstvena pretraga za JAVNI i PRIVATNI web.
   Važno pravilo:
   - osobno ime se razlikuje od patronimika / drugog dijela oznake
   - "Nikolina" ne smije vratiti "Brigita Nikolina", "Nikola", "Nikolin" ili "Nika"
   - padeži, dijakritici i ije/je i dalje rade

   Primjeri:
   - Nikolina -> osobe kojima je osobno ime Nikolina
   - Nikolinu -> isto kao Nikolina
   - Ivicu Mijina 1975 -> Ivica Mijin (1975)
   - Juru Tandaru -> Jure Tandara
   - Bozu Cosic -> Božo Ćosić
   ========================================================= */
(() => {
  'use strict';

  const dataEl = document.getElementById('diagramData');
  const findBtn = document.getElementById('findBtn');
  const searchCode = document.getElementById('searchCode');
  const searchPerson = document.getElementById('searchPerson');
  const searchFather = document.getElementById('searchFather');
  const searchMother = document.getElementById('searchMother');
  const resultsBox = document.getElementById('searchResults');
  const resultsTitle = document.getElementById('searchResultsTitle');
  const resultItems = document.getElementById('searchResultItems');
  const statusBox = document.getElementById('diagramStatus');

  if (!dataEl || !findBtn || !searchCode || !searchPerson || !searchFather || !searchMother) {
    return;
  }

  let DATA;
  try {
    DATA = JSON.parse(dataEl.textContent);
  } catch (_error) {
    return;
  }

  /* =======================================================
     POTPUNI REGISTAR OSOBA

     Pretraga ne smije ovisiti o tome je li osoba:
     - primary / nositelj grane
     - spouse / supružnik
     - daughter / kći
     - son / sin
     - unknown / drugi ili budući tip

     U indeks ulazi svaki objekt u #diagramData koji ima šifru (code/id)
     i naziv osobe (label/labelEn). DATA.nodes ima prednost ako postoji.
     ======================================================= */
  function collectAllPersonRecords(source) {
    const found = Object.create(null);
    const seen = new WeakSet();

    function walk(value) {
      if (!value || typeof value !== 'object') return;
      if (seen.has(value)) return;
      seen.add(value);

      if (!Array.isArray(value)) {
        const code = String(value.code || value.id || '').trim();
        const hasLabel = value.label != null || value.labelEn != null;

        if (code && hasLabel) {
          found[code] = value;
        }
      }

      if (Array.isArray(value)) {
        value.forEach(walk);
      } else {
        Object.values(value).forEach(walk);
      }
    }

    walk(source);
    return found;
  }

  const nodes = Object.assign(
    Object.create(null),
    collectAllPersonRecords(DATA),
    DATA.primary || {},
    DATA.nodes || {}
  );
  const isEnglish = (document.documentElement.lang || document.body.dataset.lang || 'hr')
    .toLowerCase()
    .startsWith('en');

  // CSS se učitava automatski iz common repoa.
  const selfScript = document.currentScript;
  if (selfScript && selfScript.src && !document.querySelector('link[data-tandara-smart-search-css]')) {
    try {
      const commonRoot = new URL('../', selfScript.src);
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = new URL('css/tandara-diagram-smart-search.css?v=20260923-2', commonRoot).href;
      css.dataset.tandaraSmartSearchCss = 'true';
      document.head.appendChild(css);
    } catch (_error) {
      // Pretraga radi i bez dodatnog CSS-a.
    }
  }

  const TEXT = isEnglish ? {
    found: 'Found',
    noResults: 'No results for the entered data.',
    father: 'Father',
    mother: 'Mother',
    smartTitle: 'Accurate flexible search: names, Croatian cases, diacritics, ije/je and years.'
  } : {
    found: 'Pronađeno',
    noResults: 'Nema rezultata za zadane podatke.',
    father: 'Otac',
    mother: 'Majka',
    smartTitle: 'Točna fleksibilna pretraga: imena, padeži, dijakritici, ije/je i godine.'
  };

  const STOP_WORDS = new Set([
    'roden', 'rodena', 'rodeni', 'rodene', 'rodenog', 'rodenoj',
    'rodjen', 'rodjena', 'rodjeni', 'rodjene', 'rodjenog', 'rodjenoj',
    'godina', 'godine', 'godinu', 'god', 'g',
    'umro', 'umrla', 'umrli', 'preminuo', 'preminula',
    'born', 'year', 'years', 'died', 'death'
  ]);

  const NAME_MARKERS = new Set([
    'r', 'rod', 'rodena', 'roden', 'nee', 'née'
  ]);

  function normalizeBase(value) {
    return String(value ?? '')
      .toLocaleLowerCase('hr')
      .replace(/đ/g, 'd')
      .replace(/dj/g, 'd')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ije/g, 'je')
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/[^a-z0-9.-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenVariants(rawToken) {
    const token = normalizeBase(rawToken);
    const out = new Set();
    if (!token) return out;
    out.add(token);

    if (/^\d{3,4}$/.test(token)) return out;

    const endings = [
      'ovima', 'evima', 'inima',
      'ama', 'ima',
      'oga', 'ega', 'ome', 'emu',
      'om', 'em', 'im', 'ih', 'og', 'eg', 'oj', 'ej',
      'a', 'e', 'i', 'u', 'o'
    ];

    for (const ending of endings) {
      if (token.length - ending.length >= 3 && token.endsWith(ending)) {
        out.add(token.slice(0, -ending.length));
      }
    }

    // Petar/Petra/Petru/Petrom
    if (token.length >= 5 && token.endsWith('ar')) {
      out.add(`${token.slice(0, -2)}r`);
    }

    // Pavao/Pavla
    if (token.length >= 5 && token.endsWith('ao')) {
      out.add(`${token.slice(0, -2)}l`);
    }

    return out;
  }

  function exactVariantMatch(a, b) {
    const av = tokenVariants(a);
    const bv = tokenVariants(b);

    for (const x of av) {
      if (bv.has(x)) return true;
    }
    return false;
  }

  function queryTokens(value) {
    return normalizeBase(value)
      .split(' ')
      .filter(Boolean)
      .filter(token => !STOP_WORDS.has(token));
  }

  function splitYears(tokens) {
    return {
      years: tokens.filter(token => /^\d{3,4}$/.test(token)),
      names: tokens.filter(token => !/^\d{3,4}$/.test(token))
    };
  }

  function stripLabelDates(label) {
    return String(label || '')
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function labelTokens(label) {
    return normalizeBase(stripLabelDates(label))
      .split(' ')
      .filter(Boolean)
      .filter(token => !NAME_MARKERS.has(token));
  }

  function firstUsefulToken(value) {
    return normalizeBase(value)
      .split(' ')
      .find(token => token && !NAME_MARKERS.has(token)) || '';
  }

  function patronymicStemCandidates(fatherValue) {
    const first = firstUsefulToken(fatherValue);
    const stems = new Set();

    for (const v of tokenVariants(first)) {
      if (v.length >= 3) {
        stems.add(v);
        if (/[aeiou]$/.test(v) && v.length >= 4) {
          stems.add(v.slice(0, -1));
        }
      }
    }
    return stems;
  }

  function isDerivedPatronymic(lastToken, fatherValue) {
    const last = normalizeBase(lastToken);
    if (!last || !fatherValue) return false;

    for (const stem of patronymicStemCandidates(fatherValue)) {
      // Patronimik mora imati nastavak; isto ime nije patronimik.
      if (last.length > stem.length && last.startsWith(stem)) {
        return true;
      }
    }
    return false;
  }

  function personalNameTokenArrays(rec) {
    const labels = [rec?.label, rec?.labelEn].filter(Boolean);
    const fathers = [rec?.father, rec?.fatherEn].filter(Boolean);
    const result = [];

    for (const label of labels) {
      let tokens = labelTokens(label);
      if (!tokens.length) continue;

      const last = tokens[tokens.length - 1];
      const patronymic = fathers.some(father => isDerivedPatronymic(last, father));

      if (patronymic && tokens.length > 1) {
        tokens = tokens.slice(0, -1);
      }

      result.push(tokens);
    }

    return result;
  }

  function fullLabelTokenArrays(rec) {
    return [rec?.label, rec?.labelEn]
      .filter(Boolean)
      .map(labelTokens)
      .filter(tokens => tokens.length);
  }

  function yearsMatch(rec, years) {
    if (!years.length) return true;
    const values = new Set(
      [rec?.birth, rec?.death]
        .filter(Boolean)
        .map(value => normalizeBase(value))
    );
    return years.every(year => values.has(year));
  }

  function tokensInOrderMatch(hayTokens, queryNameTokens) {
    if (!queryNameTokens.length) return true;
    if (!hayTokens.length) return false;

    let pos = 0;
    for (const q of queryNameTokens) {
      let found = false;
      while (pos < hayTokens.length) {
        if (exactVariantMatch(hayTokens[pos], q)) {
          found = true;
          pos += 1;
          break;
        }
        pos += 1;
      }
      if (!found) return false;
    }
    return true;
  }

  function personFieldMatch(rec, query) {
    const tokens = queryTokens(query);
    if (!tokens.length) return true;

    const { years, names } = splitYears(tokens);
    if (!yearsMatch(rec, years)) return false;
    if (!names.length) return true;

    // Jedno ime: traži samo među stvarnim osobnim imenima.
    // Time "Nikolina" ne nalazi "Brigita Nikolina", "Nikola" niti "Nika".
    if (names.length === 1) {
      return personalNameTokenArrays(rec)
        .some(tokensArray => tokensArray.some(token => exactVariantMatch(token, names[0])));
    }

    // Dva ili više imenskih tokena: dopušten je puni tradicionalni zapis,
    // npr. "Ivicu Mijina", "Ana Marija Antina", "Juru Tandaru".
    return fullLabelTokenArrays(rec)
      .some(tokensArray => tokensInOrderMatch(tokensArray, names));
  }

  function parentNameValueMatch(value, query) {
    const qTokens = queryTokens(query);
    if (!qTokens.length) return true;

    const hTokens = normalizeBase(value)
      .split(' ')
      .filter(Boolean)
      .filter(token => !NAME_MARKERS.has(token));

    if (!hTokens.length) return false;

    const tokenMatch = (h, q) => {
      if (exactVariantMatch(h, q)) return true;

      // Dopušten je smisleni početak osobnog imena od najmanje 3 znaka:
      // "Mil" -> "Milan". Ne radimo široku substring-pretragu.
      const hn = normalizeBase(h);
      const qn = normalizeBase(q);
      return qn.length >= 3 && hn.startsWith(qn);
    };

    // Jedna riječ u polju Otac/Majka znači OSOBNO IME roditelja.
    // Zato "Milan" traži prvog člana "Milan Mijin", ali neće pogoditi
    // "Ante Milanov" samo zato što drugi član počinje s "Milan".
    if (qTokens.length === 1) {
      return tokenMatch(hTokens[0], qTokens[0]);
    }

    // Ako korisnik upiše puni zapis, patronimik/prezime se također smije
    // koristiti: "Milan Mijin", "Iva Lukić", itd.
    return tokensInOrderMatch(hTokens, qTokens);
  }

  function parentFieldMatch(rec, key, query) {
    const qTokens = queryTokens(query);
    if (!qTokens.length) return true;

    const values = [
      rec?.[key],
      rec?.[`${key}En`]
    ].filter(Boolean);

    return values.some(value => parentNameValueMatch(value, query));
  }

  function codeMatch(value, query) {
    if (!query) return true;
    return normalizeBase(value).includes(normalizeBase(query));
  }

  function localized(rec, key) {
    if (!rec) return '';
    if (isEnglish && rec[`${key}En`] != null) return rec[`${key}En`];
    return rec[key] == null ? '' : rec[key];
  }

  function bothLanguages(rec, key) {
    return [rec?.[key], rec?.[`${key}En`]].filter(Boolean).join(' ');
  }

  function personName(label) {
    return stripLabelDates(label);
  }

  function resultDate(rec) {
    const b = rec?.birth || 'N.G.';
    const d = rec?.death || 'N.G.';
    return `★ ${b} · ✝ ${d}`;
  }

  let statusTimer = 0;
  function showStatus(message) {
    if (!statusBox) return;
    clearTimeout(statusTimer);
    statusBox.textContent = message;
    statusBox.classList.add('show');
    statusTimer = window.setTimeout(() => statusBox.classList.remove('show'), 2400);
  }

  function closeResults() {
    if (resultsBox) resultsBox.hidden = true;
    if (resultItems) resultItems.innerHTML = '';
  }

  let relayToOriginal = false;
  function openWithOriginalEngine(code) {
    const saved = {
      code: searchCode.value,
      person: searchPerson.value,
      father: searchFather.value,
      mother: searchMother.value
    };

    relayToOriginal = true;
    searchCode.value = code;
    searchPerson.value = '';
    searchFather.value = '';
    searchMother.value = '';
    findBtn.click();
    relayToOriginal = false;

    searchCode.value = saved.code;
    searchPerson.value = saved.person;
    searchFather.value = saved.father;
    searchMother.value = saved.mother;
  }

  function showResults(found) {
    if (!resultsBox || !resultsTitle || !resultItems) {
      if (found[0]) openWithOriginalEngine(found[0].code);
      return;
    }

    resultsTitle.textContent = `${TEXT.found}: ${found.length}`;
    resultItems.innerHTML = '';

    found.slice(0, 100).forEach(rec => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result smart-search-result';

      const strong = document.createElement('strong');
      strong.textContent = rec.code;

      const name = document.createTextNode(personName(localized(rec, 'label')) || rec.code);

      const small = document.createElement('small');
      small.textContent = `${resultDate(rec)} · ${TEXT.father}: ${localized(rec, 'father') || '—'} · ${TEXT.mother}: ${localized(rec, 'mother') || '—'}`;

      button.append(strong, name, small);
      button.addEventListener('click', () => {
        closeResults();
        openWithOriginalEngine(rec.code);
      });
      resultItems.appendChild(button);
    });

    resultsBox.hidden = false;
  }

  function smartSearch() {
    const qCode = searchCode.value.trim();
    const qPerson = searchPerson.value.trim();
    const qFather = searchFather.value.trim();
    const qMother = searchMother.value.trim();

    if (!qCode && !qPerson && !qFather && !qMother) {
      return false;
    }

    if (qCode && !qPerson && !qFather && !qMother) {
      return false;
    }

    const found = Object.values(nodes).filter(rec =>
      codeMatch(rec.code, qCode)
      && personFieldMatch(rec, qPerson)
      && parentFieldMatch(rec, 'father', qFather)
      && parentFieldMatch(rec, 'mother', qMother)
    );

    found.sort((a, b) => String(a.code).localeCompare(String(b.code), 'hr', { numeric: true }));

    // VAŽNO: ako je korisnik unio ime, ne vraćamo se na staru substring-pretragu,
    // jer bi ona ponovno stvorila pogreške tipa Nika/Nikolina/Nikola.
    if (!found.length) {
      closeResults();
      showStatus(TEXT.noResults);
      return true;
    }

    // V4: rezultat se UVIJEK prikazuje u popisu, čak i kada je pronađena
    // samo jedna osoba. To je važno kada ime + otac/majka suze dvije
    // istoimene osobe na jednu: korisnik mora jasno vidjeti rezultat
    // prije otvaranja dijagrama.
    showResults(found);
    return true;
  }

  [searchPerson, searchFather, searchMother].forEach(input => {
    input.classList.add('smart-search-ready');
    input.title = TEXT.smartTitle;
    input.setAttribute('data-smart-search', 'v4');
  });
  document.body.dataset.smartDiagramSearch = 'v4';

  findBtn.addEventListener('click', event => {
    if (relayToOriginal) return;
    if (!smartSearch()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  [searchCode, searchPerson, searchFather, searchMother].forEach(input => {
    input.addEventListener('keydown', event => {
      if (relayToOriginal || event.key !== 'Enter') return;
      if (!smartSearch()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  });

  window.TandaraSmartDiagramSearch = Object.freeze({
    normalize: normalizeBase,
    tokenVariants,
    exactVariantMatch,
    personFieldMatch
  });
})();
