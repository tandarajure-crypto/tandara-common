/* =========================================================
   TANDARA — BRANCH PAGE ENGINE

   Zajednički čisti motor za stranice rodoslovnih grana.

   Koristi se za:
   - svih 10 glavnih grana
   - HR i EN
   - PUBLIC i PRIVATE kada koriste isti tip stranice

   MOTOR MOŽE:
   - dodati opcionalni povratni link
   - dodati opcionalni link na dijagram
   - dodati opcionalnu završnu napomenu
   - otvoriti fotografije osoba u zajedničkom lightboxu

   MOTOR NE SADRŽI:
   - rodoslovne podatke
   - imena osoba
   - godine i datume
   - šifre osoba
   - putanje pojedinih fotografija
   - CSS
   - site shell
   - početno stablo
   - hotspotove
   - pretragu osoba
   - logiku dijagrama
   - print
   - protected/private autorizaciju
   - posebne zakrpe za pojedine grane

   Sve razlike među stranicama dolaze
   iz data-* atributa lokalnog HTML-a.
   ========================================================= */

(() => {
  "use strict";

  const body = document.body;

  if (!body) {
    return;
  }


  /* =======================================================
     PUTANJE
     ======================================================= */

  const siteRoot = new URL(
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
     POMOĆNE FUNKCIJE
     ======================================================= */

  function hasText(value) {
    return (
      typeof value === "string" &&
      value.trim() !== ""
    );
  }

  function enabled(value) {
    return (
      value === "true" ||
      value === "1" ||
      value === "yes"
    );
  }

  function toolsHost() {
    return document.getElementById(
      "common-branch-tools"
    );
  }

  function footerHost() {
    return document.getElementById(
      "common-branch-footer"
    );
  }

  function createToolLink(
    path,
    label,
    role
  ) {
    const link =
      document.createElement("a");

    link.href =
      siteUrl(path);

    link.textContent =
      label.trim();

    link.dataset.branchTool =
      role;

    return link;
  }


  /* =======================================================
     POVRATNI LINK

     Lokalni HTML po potrebi koristi:

     data-parent-page="..."
     data-parent-label="..."

     Ako atributi ne postoje,
     ništa se ne prikazuje.
     ======================================================= */

  function installParentLink() {
    const host =
      toolsHost();

    if (!host) {
      return;
    }

    if (
      host.querySelector(
        '[data-branch-tool="parent"]'
      )
    ) {
      return;
    }

    const page =
      body.dataset.parentPage;

    const label =
      body.dataset.parentLabel;

    if (
      !hasText(page) ||
      !hasText(label)
    ) {
      return;
    }

    const link =
      createToolLink(
        page,
        `← ${label.trim()}`,
        "parent"
      );

    host.append(link);
  }


  /* =======================================================
     POVEZNICA NA DIJAGRAM

     Motor ne upravlja dijagramom.
     Samo otvara lokalno definiranu stranicu.

     Lokalni HTML po potrebi koristi:

     data-diagram="box2a.html"
     data-diagram-label="Interaktivni dijagram"

     EN primjer:

     data-diagram="box2a-en.html"
     data-diagram-label="Interactive diagram"

     Ako nema oba atributa,
     poveznica se ne prikazuje.
     ======================================================= */

  function installDiagramLink() {
    const host =
      toolsHost();

    if (!host) {
      return;
    }

    if (
      host.querySelector(
        '[data-branch-tool="diagram"]'
      )
    ) {
      return;
    }

    const path =
      body.dataset.diagram;

    const label =
      body.dataset.diagramLabel;

    if (
      !hasText(path) ||
      !hasText(label)
    ) {
      return;
    }

    const link =
      createToolLink(
        path,
        label,
        "diagram"
      );

    host.append(link);
  }


  /* =======================================================
     ZAVRŠNA NAPOMENA

     Potpuno opcionalna.

     Lokalni HTML koristi:

     data-branch-note="true"
     data-branch-note-title="..."
     data-branch-note-text="..."

     Ako nema potpune konfiguracije,
     napomena se ne prikazuje.
     ======================================================= */

  function installBranchNote() {
    const host =
      footerHost();

    if (!host) {
      return;
    }

    if (
      host.querySelector(
        "[data-branch-note]"
      )
    ) {
      return;
    }

    if (
      !enabled(
        body.dataset.branchNote
      )
    ) {
      return;
    }

    const title =
      body.dataset
        .branchNoteTitle;

    const text =
      body.dataset
        .branchNoteText;

    if (
      !hasText(title) ||
      !hasText(text)
    ) {
      return;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "branch-note";

    section.dataset.branchNote =
      "";

    const heading =
      document.createElement(
        "h3"
      );

    heading.textContent =
      title.trim();

    const paragraph =
      document.createElement(
        "p"
      );

    paragraph.textContent =
      text.trim();

    section.append(
      heading,
      paragraph
    );

    host.append(section);
  }


  /* =======================================================
     FOTOGRAFIJE — ZAJEDNIČKI LIGHTBOX

     Standardni HTML fotografije:

     <div class="person-photo-gallery">
       <figure class="person-photo">
         <a href="PUTANJA-DO-SLIKE">
           <img
             src="PUTANJA-DO-SLIKE"
             alt="Opis">
         </a>
         <figcaption>Opis</figcaption>
       </figure>
     </div>

     Normalni klik otvara sliku u lightboxu.
     Ctrl / Shift / Command klik zadržava
     izvorno ponašanje poveznice.
     ======================================================= */

  const photoLinkSelector =
    ".person-photo-gallery .person-photo a";

  let activePhotoLink =
    null;


  function photoLightboxHost() {
    return document.querySelector(
      "[data-branch-photo-lightbox]"
    );
  }


  function createPhotoLightbox() {
    const existing =
      photoLightboxHost();

    if (existing) {
      return existing;
    }

    const overlay =
      document.createElement(
        "div"
      );

    overlay.className =
      "branch-photo-lightbox";

    overlay.dataset
      .branchPhotoLightbox =
        "";

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-modal",
      "true"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    overlay.setAttribute(
      "aria-label",
      body.classList.contains("en")
        ? "Enlarged photograph"
        : "Povećana fotografija"
    );


    const closeButton =
      document.createElement(
        "button"
      );

    closeButton.type =
      "button";

    closeButton.className =
      "branch-photo-lightbox__close";

    closeButton.setAttribute(
      "aria-label",
      body.classList.contains("en")
        ? "Close photograph"
        : "Zatvori fotografiju"
    );

    closeButton.textContent =
      "×";


    const figure =
      document.createElement(
        "figure"
      );

    figure.className =
      "branch-photo-lightbox__figure";


    const image =
      document.createElement(
        "img"
      );

    image.className =
      "branch-photo-lightbox__image";

    image.alt =
      "";


    const caption =
      document.createElement(
        "figcaption"
      );

    caption.className =
      "branch-photo-lightbox__caption";

    caption.hidden =
      true;


    figure.append(
      image,
      caption
    );

    overlay.append(
      closeButton,
      figure
    );

    document.body.append(
      overlay
    );

    return overlay;
  }


  function closePhotoLightbox() {
    const overlay =
      photoLightboxHost();

    if (!overlay) {
      return;
    }

    if (
      !overlay.classList.contains(
        "is-open"
      )
    ) {
      return;
    }

    overlay.classList.remove(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "branch-photo-lightbox-open"
    );


    const image =
      overlay.querySelector(
        ".branch-photo-lightbox__image"
      );

    if (image) {
      image.removeAttribute(
        "src"
      );

      image.alt =
        "";
    }


    if (
      activePhotoLink &&
      typeof activePhotoLink.focus ===
        "function"
    ) {
      activePhotoLink.focus();
    }

    activePhotoLink =
      null;
  }


  function openPhotoLightbox(link) {
    if (!link) {
      return;
    }

    const thumb =
      link.querySelector(
        "img"
      );

    if (
      !thumb ||
      !hasText(link.href)
    ) {
      return;
    }


    const overlay =
      createPhotoLightbox();

    const image =
      overlay.querySelector(
        ".branch-photo-lightbox__image"
      );

    const caption =
      overlay.querySelector(
        ".branch-photo-lightbox__caption"
      );

    const closeButton =
      overlay.querySelector(
        ".branch-photo-lightbox__close"
      );

    const figure =
      link.closest(
        "figure"
      );

    const sourceCaption =
      figure
        ? figure.querySelector(
            "figcaption"
          )
        : null;


    if (
      !image ||
      !caption ||
      !closeButton
    ) {
      return;
    }


    activePhotoLink =
      link;

    image.src =
      link.href;

    image.alt =
      thumb.alt || "";


    const captionText =
      sourceCaption
        ? sourceCaption
            .textContent
            .trim()
        : "";


    caption.textContent =
      captionText;

    caption.hidden =
      !hasText(
        captionText
      );


    overlay.classList.add(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add(
      "branch-photo-lightbox-open"
    );

    closeButton.focus();
  }


  function installPhotoLightbox() {
    const links =
      document.querySelectorAll(
        photoLinkSelector
      );

    if (!links.length) {
      return;
    }


    const overlay =
      createPhotoLightbox();

    const closeButton =
      overlay.querySelector(
        ".branch-photo-lightbox__close"
      );


    links.forEach(
      (link) => {

        if (
          link.dataset
            .branchPhotoReady ===
          "true"
        ) {
          return;
        }

        link.dataset
          .branchPhotoReady =
            "true";


        link.addEventListener(
          "click",
          (event) => {

            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }

            event.preventDefault();

            openPhotoLightbox(
              link
            );
          }
        );
      }
    );


    if (
      closeButton &&
      closeButton.dataset
        .branchPhotoReady !==
      "true"
    ) {
      closeButton.dataset
        .branchPhotoReady =
          "true";

      closeButton.addEventListener(
        "click",
        closePhotoLightbox
      );
    }


    if (
      overlay.dataset
        .branchPhotoEventsReady !==
      "true"
    ) {
      overlay.dataset
        .branchPhotoEventsReady =
          "true";


      overlay.addEventListener(
        "click",
        (event) => {

          if (
            event.target ===
            overlay
          ) {
            closePhotoLightbox();
          }
        }
      );


      document.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Escape" &&
            overlay.classList.contains(
              "is-open"
            )
          ) {
            closePhotoLightbox();
          }
        }
      );
    }
  }


  /* =======================================================
     INICIJALIZACIJA
     ======================================================= */

  function init() {
    if (
      body.dataset
        .branchPageEngineReady ===
      "true"
    ) {
      return;
    }

    installParentLink();
    installDiagramLink();
    installBranchNote();
    installPhotoLightbox();

    body.dataset
      .branchPageEngineReady =
        "true";


    window.dispatchEvent(
      new CustomEvent(
        "tandara:branch-page-ready",
        {
          detail: {
            page:
              body.dataset.page ||
              "",

            branch:
              body.dataset
                .branchName ||
              ""
          }
        }
      )
    );
  }


  /* =======================================================
     JAVNO SUČELJE
     ======================================================= */

  window.TandaraBranchPage =
    Object.freeze({
      init
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
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }

})();
