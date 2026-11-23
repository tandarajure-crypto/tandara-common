/* TANDARA COMMON — jedini učitavač zajedničkog okvira stranice. */
(() => {
  "use strict";

  const loaderScript = document.currentScript;
  const body = document.body;
  const pageContent =
    document.querySelector("[data-page-content]") ||
    document.querySelector("main");

  if (!loaderScript || !body || !pageContent) return;

  const pathFile = window.location.pathname.split("/").pop() || "";
  const pathLanguage = pathFile.match(/(?:^|[-_])(de|en|hr)(?=\.html$)/i)?.[1];
  // URL language must win over stale language state from cached scripts.
  const lang = (
    pathLanguage ||
    document.documentElement.lang ||
    body.dataset.lang ||
    window.TandaraLanguage?.current ||
    "hr"
  ).toLowerCase();

  const isHr = lang.startsWith("hr");
  const isGerman = lang.startsWith("de");

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

  const templateUrl =
    new URL(
      "templates/branch-page-minimal.html",
      commonRoot
    );

  templateUrl.search =
    new URL(
      loaderScript.src
    ).search;


  const siteUrl =
    (relativePath) =>
      new URL(
        relativePath,
        siteRoot
      ).href;

  const commonUrl =
    (relativePath) =>
      new URL(
        relativePath,
        commonRoot
      ).href;


  const homeHotspots = [
    {
      key: "jurina",
      labelHr: "Jurina grana", labelDe: "Jures Familienzweig",
      labelEn: "Jure's branch",
      routeHr: "jurinagrana.html",
      routeEn: "jurinagrana-en.html"
    },
    {
      key: "petrova",
      labelHr: "Petrova grana", labelDe: "Petars Familienzweig",
      labelEn: "Petar's branch",
      routeHr: "petrovagrana.html",
      routeEn: "petrovagrana-en.html"
    },
    {
      key: "antina",
      labelHr: "Antina grana", labelDe: "Antes Familienzweig",
      labelEn: "Ante's branch",
      routeHr: "antinagrana.html",
      routeEn: "antinagrana-en.html"
    },
    {
      key: "matina",
      labelHr: "Matina grana", labelDe: "Mates Familienzweig",
      labelEn: "Mate's branch",
      routeHr: "matinagrana.html",
      routeEn: "matinagrana-en.html"
    },
    {
      key: "ivanov",
      labelHr: "Ivan Tandara", labelDe: "Ivan Tandara",
      labelEn: "Ivan Tandara",
      routeHr: "box1.html",
      routeEn: "box1-en.html"
    },
    {
      key: "jurin",
      labelHr: "Jure Tandara", labelDe: "Jure Tandara",
      labelEn: "Jure Tandara",
      routeHr: "box2a.html",
      routeEn: "box2a-en.html"
    },
    {
      key: "petrov",
      labelHr: "Petar Tandara", labelDe: "Petar Tandara",
      labelEn: "Petar Tandara",
      routeHr: "box2b.html",
      routeEn: "box2b-en.html"
    },
    {
      key: "antin",
      labelHr: "Ante Tandara", labelDe: "Ante Tandara",
      labelEn: "Ante Tandara",
      routeHr: "box2c.html",
      routeEn: "box2c-en.html"
    },
    {
      key: "matin",
      labelHr: "Mate Tandara", labelDe: "Mate Tandara",
      labelEn: "Mate Tandara",
      routeHr: "box2d.html",
      routeEn: "box2d-en.html"
    },
    {
      key: "livanjske",
      labelHr: "Livanjske Tandare", labelDe: "Tandara aus Livno",
      labelEn: "Livno Tandara branch",
      routeHr: "filipovagrana.html",
      routeEn: "filipovagrana-en.html"
    }
  ];


  function localize(root) {
    root
      .querySelectorAll(
        "[data-text-hr][data-text-en], [data-text-de]"
      )
      .forEach(
        (element) => {
          element.textContent =
            isGerman ? (element.dataset.textDe || element.dataset.textEn || element.dataset.textHr) : isHr ? element.dataset.textHr : element.dataset.textEn;
        }
      );


    root
      .querySelectorAll(
        "[data-label-hr][data-label-en], [data-label-de]"
      )
      .forEach(
        (element) => {
          element.setAttribute(
            "aria-label",
            isGerman ? (element.dataset.labelDe || element.dataset.labelEn || element.dataset.labelHr) : isHr ? element.dataset.labelHr : element.dataset.labelEn
          );
        }
      );


    root
      .querySelectorAll(
        "[data-route-hr][data-route-en], [data-route-de]"
      )
      .forEach(
        (link) => {
          link.href =
            siteUrl(
              isGerman ? (link.dataset.routeDe || link.dataset.routeEn || link.dataset.routeHr) : isHr ? link.dataset.routeHr : link.dataset.routeEn
            );
        }
      );


    root
      .querySelectorAll(
        "[data-common-src]"
      )
      .forEach(
        (image) => {
          image.src =
            commonUrl(
              image.dataset.commonSrc
            );
        }
      );
  }


  function configureLanguageSwitch(sidebar) {
    const switcher = sidebar.querySelector('[data-role="language-switch"]');
    const hrLink = sidebar.querySelector('[data-role="hr-link"]');
    const enLink = sidebar.querySelector('[data-role="en-link"]');
    const deLink = sidebar.querySelector('[data-role="de-link"]');
    const hrPage = body.dataset.pageHr;
    const enPage = body.dataset.pageEn;
    const dePage = body.dataset.pageDe;

    if (!switcher || !hrLink || !enLink || !hrPage || !enPage) return;

    hrLink.href = siteUrl(hrPage);
    enLink.href = siteUrl(enPage);
    if (deLink && dePage) deLink.href = siteUrl(dePage);
    if (deLink) deLink.hidden = !dePage;

    const activeLink = isGerman ? deLink : isHr ? hrLink : enLink;
    if (activeLink) {
      activeLink.classList.add("active");
      activeLink.setAttribute("aria-current", "page");
    }
    switcher.hidden = false;
  }


  function configureAuthorPhoto(
    sidebar
  ) {
    const wrapper =
      sidebar.querySelector(
        '[data-role="author-photo"]'
      );

    const image =
      sidebar.querySelector(
        '[data-role="author-image"]'
      );

    const relativePath =
      body.dataset.authorImage;


    if (
      !wrapper ||
      !image
    ) {
      return;
    }


    if (
      !relativePath
    ) {
      image.remove();
      return;
    }


    image.src =
      commonUrl(
        relativePath
      );

    wrapper.hidden =
      false;
  }


  function markCurrentPage(
    sidebar
  ) {
    sidebar
      .querySelectorAll(
        "a[href]"
      )
      .forEach(
        (link) => {
          const linkUrl =
            new URL(
              link.href,
              document.baseURI
            );


          if (
            linkUrl.origin ===
              location.origin &&
            linkUrl.pathname ===
              location.pathname
          ) {
            link.classList.add(
              "active"
            );

            link.setAttribute(
              "aria-current",
              "page"
            );
          }
        }
      );
  }


  function installShell(
    sidebar
  ) {
    const existingLayout =
      pageContent.closest(
        ".tandara-layout"
      );


    if (
      existingLayout
    ) {
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
      "tandara-shell-ready"
    );


    window.dispatchEvent(
      new CustomEvent(
        "tandara:shell-ready"
      )
    );
  }


  function installHomeHotspots() {
    const tree =
      document.querySelector(
        "[data-home-tree]"
      );


    if (
      !tree ||
      tree.querySelector(
        ".tandara-home-hotspot"
      )
    ) {
      return;
    }


    const fragment =
      document.createDocumentFragment();


    homeHotspots.forEach(
      (hotspot) => {
        const link =
          document.createElement(
            "a"
          );


        link.className =
          `tandara-home-hotspot tandara-home-hotspot--${hotspot.key}`;

        link.dataset.hotspot =
          hotspot.key;

        const hotspotRoute = isGerman ? hotspot.routeDe : isHr ? hotspot.routeHr : hotspot.routeEn;
        if (hotspotRoute) link.href = siteUrl(hotspotRoute);
        else { link.removeAttribute("href"); link.setAttribute("aria-disabled", "true"); link.title = "Deutsche Version dieser Familienzweigseite ist noch nicht verfügbar."; }

        link.setAttribute("aria-label", isGerman ? hotspot.labelDe : isHr ? hotspot.labelHr : hotspot.labelEn);


        if (
          hotspot.key ===
          "livanjske"
        ) {
          link.append(
            isHr
              ? "LIVANJSKE"
              : "LIVNO",

            document.createElement(
              "br"
            ),

            isHr
              ? "TANDARE"
              : "TANDARA"
          );
        }


        fragment.append(
          link
        );
      }
    );


    tree.append(
      fragment
    );
  }


  installHomeHotspots();


  fetch(
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
        if (
          !response.ok
        ) {
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
          parsed.querySelector(
            "#tandara-common-shell"
          );


        const sidebar =
          template
            ?.content
            ?.firstElementChild
            ?.cloneNode(
              true
            );


        if (
          !sidebar
        ) {
          throw new Error(
            "Predložak ne sadrži #tandara-common-shell."
          );
        }


        localize(
          sidebar
        );

        configureLanguageSwitch(
          sidebar
        );

        configureAuthorPhoto(
          sidebar
        );

        markCurrentPage(
          sidebar
        );

        installShell(
          sidebar
        );
      }
    )

    .catch(
      (error) => {
        body.classList.add(
          "tandara-shell-unavailable"
        );

        console.error(
          "Tandara common okvir nije učitan:",
          error
        );
      }
    );

})();
