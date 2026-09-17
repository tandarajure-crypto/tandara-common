/* =========================================================
   TANDARA — BRANCH PAGE ENGINE

   Zajednički čisti motor za stranice rodoslovnih grana.

   Koristi se za:
   - Jurinu granu
   - Petrovu granu
   - Antinu granu
   - Matinu granu
   - Livanjske Tandare
   - HR i EN
   - PUBLIC i PRIVATE kada koriste isti tip stranice

   MOTOR MOŽE:
   - dodati opcionalni povratni link
   - dodati opcionalni link na dijagram
   - dodati opcionalnu završnu napomenu

   MOTOR NE SADRŽI:
   - rodoslovne podatke
   - imena osoba
   - godine i datume
   - šifre osoba
   - slike
   - CSS
   - site shell
   - početno stablo
   - hotspotove
   - pretragu osoba
   - logiku dijagrama
   - print
   - modalne prozore
   - protected/private autorizaciju
   - posebne zakrpe za Jurinu, Petrovu,
     Antinu, Matinu ili Livanjsku granu

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

    body.dataset
      .branchPageEngineReady =
        "true";

    window.dispatchEvent(
      new CustomEvent(
        "tandara:branch-page-ready",
        {
          detail: {
            page:
              body.dataset.page || "",

            branch:
              body.dataset
                .branchName || ""
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
