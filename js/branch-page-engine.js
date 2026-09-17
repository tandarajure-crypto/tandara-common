
/* =========================================================
   TANDARA — BRANCH PAGE ENGINE

   Zajednički pogonski motor za:
   - Jurinu granu
   - Petrovu granu
   - Antinu granu
   - Matinu granu
   - Livanjske Tandare

   Namijenjen za:
   - PUBLIC i PRIVATE
   - HR i EN

   OVA DATOTEKA NE SADRŽI:
   - rodoslovne podatke
   - imena osoba
   - datume
   - šifre osoba
   - slike
   - CSS
   - print funkciju
   - pretragu osoba
   - logiku interaktivnih dijagrama
   - navigaciju lijevog stupca
   - posebne zakrpe za pojedine grane
   - branch-specific if/else logiku

   Razlike među stranicama dolaze isključivo
   iz data-* atributa lokalnog HTML-a.
   ========================================================= */

(() => {
  "use strict";

  const body = document.body;

  if (!body) {
    return;
  }

  /* =======================================================
     OSNOVNI POMOĆNI ALATI
     ======================================================= */

  function siteRoot() {
    return new URL(
      body.dataset.siteRoot || "./",
      document.baseURI
    );
  }

  function siteUrl(relativePath) {
    return new URL(
      relativePath,
      siteRoot()
    ).href;
  }

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

  function createElement(
    tagName,
    className = ""
  ) {
    const element =
      document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    return element;
  }

  function markReady(
    element,
    key
  ) {
    if (!element) {
      return false;
    }

    const attribute =
      `branchEngine${key}Ready`;

    if (
      element.dataset[attribute] ===
      "true"
    ) {
      return false;
    }

    element.dataset[attribute] =
      "true";

    return true;
  }

  /* =======================================================
     POVRATNI LINK

     Koristi se samo kada ga lokalni HTML zatraži.

     Primjer:
     data-parent-page="livanjske-tandare.html"
     data-parent-label="Livanjske Tandare"

     Ako atributi ne postoje, motor ne stvara ništa.
     ======================================================= */

  function installParentLink() {
    const parentPage =
      body.dataset.parentPage;

    const parentLabel =
      body.dataset.parentLabel;

    if (
      !hasText(parentPage) ||
      !hasText(parentLabel)
    ) {
      return;
    }

    const card =
      document.querySelector(
        ".branch-card"
      );

    if (!card) {
      return;
    }

    if (
      card.querySelector(
        "[data-branch-parent-link]"
      )
    ) {
      return;
    }

    const paragraph =
      createElement(
        "p",
        "branch-parent-link"
      );

    paragraph.dataset
      .branchParentLink = "";

    const link =
      document.createElement("a");

    link.href =
      siteUrl(parentPage);

    link.textContent =
      `← ${parentLabel.trim()}`;

    paragraph.append(link);

    const toolsHost =
      document.getElementById(
        "common-branch-tools"
      );

    if (
      toolsHost &&
      toolsHost.parentElement === card
    ) {
      toolsHost.insertAdjacentElement(
        "afterend",
        paragraph
      );
    } else {
      card.prepend(paragraph);
    }
  }

  /* =======================================================
     ZAŠTIĆENI PODACI

     Motor ništa ne prikazuje automatski.

     Funkcija se uključuje samo ako lokalni HTML sadrži:

     data-protected-info="true"
     data-protected-label="..."
     data-protected-title="..."
     data-protected-text="..."
     data-protected-close-label="..."

     PUBLIC može koristiti ovu mogućnost.
     PRIVATE je jednostavno ne mora uključiti.
     ======================================================= */

  function createProtectedDialog() {
    const existing =
      document.getElementById(
        "tandara-protected-data-dialog"
      );

    if (existing) {
      return existing;
    }

    const titleText =
      body.dataset.protectedTitle;

    const messageText =
      body.dataset.protectedText;

    const closeText =
      body.dataset.protectedCloseLabel;

    if (
      !hasText(titleText) ||
      !hasText(messageText) ||
      !hasText(closeText)
    ) {
      return null;
    }

    const dialog =
      createElement(
        "dialog",
        "protected-access-dialog"
      );

    dialog.id =
      "tandara-protected-data-dialog";

    const panel =
      createElement(
        "div",
        "protected-access-dialog__panel"
      );

    const heading =
      document.createElement("h2");

    heading.textContent =
      titleText.trim();

    const paragraph =
      document.createElement("p");

    paragraph.textContent =
      messageText.trim();

    const closeButton =
      createElement(
        "button",
        "protected-access-dialog__close"
      );

    closeButton.type = "button";

    closeButton.textContent =
      closeText.trim();

    closeButton.addEventListener(
      "click",
      () => {
        dialog.close();
      }
    );

    dialog.addEventListener(
      "cancel",
      () => {
        dialog.close();
      }
    );

    dialog.addEventListener(
      "click",
      (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      }
    );

    panel.append(
      heading,
      paragraph,
      closeButton
    );

    dialog.append(panel);

    document.body.append(dialog);

    return dialog;
  }

  function installProtectedInfo() {
    if (
      !enabled(
        body.dataset.protectedInfo
      )
    ) {
      return;
    }

    const label =
      body.dataset.protectedLabel;

    if (!hasText(label)) {
      return;
    }

    const host =
      document.getElementById(
        "common-branch-tools"
      );

    if (!host) {
      return;
    }

    if (
      !markReady(
        host,
        "Protected"
      )
    ) {
      return;
    }

    const wrapper =
      createElement(
        "div",
        "protected-access-notice"
      );

    const button =
      createElement(
        "button",
        "protected-family-data-trigger"
      );

    button.type = "button";

    button.textContent =
      label.trim();

    button.dataset
      .protectedAccess = "";

    button.addEventListener(
      "click",
      () => {
        const dialog =
          createProtectedDialog();

        if (!dialog) {
          return;
        }

        if (
          typeof dialog.showModal ===
          "function"
        ) {
          if (!dialog.open) {
            dialog.showModal();
          }

          return;
        }

        dialog.setAttribute(
          "open",
          ""
        );
      }
    );

    wrapper.append(button);

    host.append(wrapper);
  }

  /* =======================================================
     INTERAKTIVNI DIJAGRAM

     Motor NE upravlja dijagramom.

     On samo stvara poveznicu na dijagram ako lokalni
     HTML sadrži konfiguraciju:

     data-diagram="box2a.html"
     data-diagram-title="..."
     data-diagram-text="..."
     data-diagram-label="..."

     Putanja i svi tekstovi ostaju lokalni.
     ======================================================= */

  function createDiagramSection() {
    const diagramPath =
      body.dataset.diagram;

    const diagramTitle =
      body.dataset.diagramTitle;

    const diagramText =
      body.dataset.diagramText;

    const diagramLabel =
      body.dataset.diagramLabel;

    if (
      !hasText(diagramPath) ||
      !hasText(diagramTitle) ||
      !hasText(diagramText) ||
      !hasText(diagramLabel)
    ) {
      return null;
    }

    const section =
      createElement(
        "section",
        "branch-diagram-link"
      );

    section.dataset
      .branchDiagramLink = "";

    const copy =
      document.createElement("div");

    const heading =
      document.createElement("h2");

    heading.textContent =
      diagramTitle.trim();

    const paragraph =
      document.createElement("p");

    paragraph.textContent =
      diagramText.trim();

    const link =
      createElement(
        "a",
        "branch-diagram-link__button"
      );

    link.href =
      siteUrl(diagramPath);

    link.textContent =
      diagramLabel.trim();

    copy.append(
      heading,
      paragraph
    );

    section.append(
      copy,
      link
    );

    return section;
  }

  function installDiagramLink() {
    const host =
      document.getElementById(
        "common-branch-footer"
      );

    if (!host) {
      return;
    }

    if (
      !markReady(
        host,
        "Diagram"
      )
    ) {
      return;
    }

    const section =
      createDiagramSection();

    if (section) {
      host.append(section);
    }
  }

  /* =======================================================
     ZAVRŠNA NAPOMENA

     Potpuno opcionalna.

     Lokalni HTML određuje tekst:

     data-branch-note="true"
     data-branch-note-title="..."
     data-branch-note-text="..."

     Ako nema tih atributa, nema ni napomene.
     ======================================================= */

  function createBranchNote() {
    if (
      !enabled(
        body.dataset.branchNote
      )
    ) {
      return null;
    }

    const title =
      body.dataset.branchNoteTitle;

    const noteText =
      body.dataset.branchNoteText;

    if (
      !hasText(title) ||
      !hasText(noteText)
    ) {
      return null;
    }

    const section =
      createElement(
        "section",
        "tree-note"
      );

    section.dataset
      .branchNote = "";

    const heading =
      document.createElement("h3");

    heading.textContent =
      title.trim();

    const paragraph =
      document.createElement("p");

    paragraph.textContent =
      noteText.trim();

    section.append(
      heading,
      paragraph
    );

    return section;
  }

  function installBranchNote() {
    const host =
      document.getElementById(
        "common-branch-footer"
      );

    if (!host) {
      return;
    }

    if (
      !markReady(
        host,
        "Note"
      )
    ) {
      return;
    }

    const note =
      createBranchNote();

    if (note) {
      host.append(note);
    }
  }

  /* =======================================================
     INICIJALIZACIJA

     Motor se može sigurno pozvati više puta.
     Ne duplicira već postavljene elemente.
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
    installProtectedInfo();
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
     JAVNO SUČELJE MOTORA

     Namjerno minimalno.
     ======================================================= */

  window.TandaraBranchPage =
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
