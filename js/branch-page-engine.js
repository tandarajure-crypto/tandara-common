/* =========================================================
   TANDARA — BRANCH PAGE ENGINE

   Zajednički motor za svih 10 glavnih rodoslovnih grana.

   Koristi se za:
   - HR i EN verzije
   - PUBLIC i PRIVATE stranice istoga tipa

   MOTOR MOŽE:
   - dodati opcionalni povratni link
   - dodati opcionalni link na dijagram
   - dodati opcionalnu završnu napomenu
   - dodati gumb za zaštićene obiteljske podatke ispod glavnog naslova
   - otvoriti zajednički HR/EN dijalog za zaštićene obiteljske podatke
   - otvoriti fotografije osoba u zajedničkom lightboxu

   MOTOR NE SADRŽI:
   - rodoslovne podatke
   - imena osoba iz pojedinih grana
   - godine i datume osoba iz pojedinih grana
   - šifre osoba
   - putanje pojedinih fotografija
   - CSS
   - site shell
   - početno stablo
   - hotspotove
   - pretragu osoba
   - logiku dijagrama
   - print
   - autorizaciju privatnog arhiva
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
     JEZIK
     ======================================================= */

  const documentLanguage =
    (
      document.documentElement.lang ||
      ""
    )
      .trim()
      .toLowerCase();

  const isEnglish =
    documentLanguage.startsWith("en") ||
    body.classList.contains("en");


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
      body.dataset.branchNoteTitle;

    const text =
      body.dataset.branchNoteText;

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
     ZAŠTIĆENI OBITELJSKI PODACI
     ======================================================= */

  const protectedAccessText =
    isEnglish
      ? {
          trigger:
            "Information about protected family data",

          title:
            "Protected family data",

          paragraphs: [
            "Data concerning family members who are probably living, as well as persons born after 1930 for whom death has not been entered or confirmed, are not publicly available in order to protect privacy and prevent possible misuse of personal data. Data concerning persons confirmed to be deceased remain publicly available.",
            "Access may be requested by family members and by other persons who can demonstrate a justified connection with the Tandara family.",
            "A request for access must be submitted through the Contact and cooperation page. The message should include:",
            "Identity and family connection may be confirmed by a personal meeting with the archive administrator, confirmation by a known family member, or inspection of a valid identity document and other appropriate evidence.",
            "After reviewing the request, the author and archive administrator decide whether access will be approved. An approved user is granted personal access to the private archive through passkey authentication.",
            "Approved access is intended exclusively for the user to whom it has been granted. The device or user account on which the passkey is registered must not be made available to other persons for access, and protected data must not be copied, publicly published, forwarded, or used for other purposes.",
            "The administrator reserves the right to reject a request, limit the scope of access, or revoke previously approved access in order to protect the privacy of family members."
          ],

          list: [
            "first and last name",
            "which branch of the family you belong to",
            "your relationship to the person or family branch whose data you wish to view",
            "the reason for requesting access",
            "how you can confirm your identity and family connection"
          ],

          warning:
            "Do not send a copy of an identity document by ordinary email without prior agreement with the administrator. As a rule, inspection of the document is sufficient, without permanent storage of a copy.",

          close:
            "Close",

          closeAria:
            "Close protected family data dialog",

          request:
            "Send access request"
        }
      : {
          trigger:
            "Informacije o zaštićenim obiteljskim podacima",

          title:
            "Zaštićeni obiteljski podaci",

          paragraphs: [
            "Podaci vjerojatno živih članova obitelji te osoba rođenih nakon 1930. godine za koje nije unesena ili potvrđena smrt nisu javno dostupni radi zaštite privatnosti i sprječavanja moguće zlouporabe osobnih podataka. Podaci potvrđeno preminulih osoba ostaju javno dostupni.",
            "Pristup mogu zatražiti članovi obitelji i druge osobe koje mogu dokazati opravdanu povezanost s obitelji Tandara.",
            "Zahtjev za pristup potrebno je poslati putem stranice Kontakt i suradnja. U poruci treba navesti:",
            "Identitet i obiteljska povezanost mogu se potvrditi osobnim susretom s administratorom arhiva, potvrdom poznatog člana obitelji ili uvidom u važeći osobni dokument i druge odgovarajuće dokaze.",
            "Nakon provjere zahtjeva autor i administrator arhiva odlučuje o odobravanju pristupa. Odobrenom korisniku omogućuje se osobni pristup privatnom arhivu putem passkey autentifikacije.",
            "Odobreni pristup namijenjen je isključivo korisniku kojemu je dodijeljen. Uređaj ili korisnički račun na kojem je registriran passkey ne smije se ustupati drugim osobama radi pristupa, a zaštićeni podaci ne smiju se kopirati, javno objavljivati, prosljeđivati niti koristiti u druge svrhe.",
            "Administrator zadržava pravo odbiti zahtjev, ograničiti opseg pristupa ili ukinuti ranije odobren pristup radi zaštite privatnosti članova obitelji."
          ],

          list: [
            "ime i prezime",
            "kojoj grani obitelji pripadate",
            "svoj odnos prema osobi ili obiteljskoj grani čije podatke želite pregledati",
            "razlog zbog kojeg tražite pristup",
            "način na koji možete potvrditi svoj identitet i obiteljsku povezanost"
          ],

          warning:
            "Nemojte slati presliku osobnog dokumenta putem obične e-pošte bez prethodnog dogovora s administratorom. U pravilu je dovoljan uvid u dokument, bez njegova trajnog pohranjivanja.",

          close:
            "Zatvori",

          closeAria:
            "Zatvori dijalog o zaštićenim obiteljskim podacima",

          request:
            "Pošalji zahtjev za pristup"
        };


  let activeProtectedAccessTrigger =
    null;


  function protectedAccessDialogHost() {
    return document.querySelector(
      "[data-branch-protected-access-dialog]"
    );
  }


  function createProtectedAccessTrigger() {
    const existing =
      document.querySelector(
        "[data-protected-access]"
      );

    if (existing) {
      return existing;
    }

    const heading =
      document.querySelector(
        ".branch-card > h1"
      );

    if (!heading) {
      return null;
    }

    const notice =
      document.createElement("p");

    notice.className =
      "protected-access-notice";

    notice.dataset.branchProtectedAccessNotice =
      "";

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "protected-family-data-trigger";

    button.dataset.protectedAccess =
      "";

    button.setAttribute(
      "aria-haspopup",
      "dialog"
    );

    button.setAttribute(
      "aria-controls",
      "branch-protected-access-dialog"
    );

    const lock =
      document.createElement("span");

    lock.className =
      "protected-family-data-trigger__lock";

    lock.setAttribute(
      "aria-hidden",
      "true"
    );

    lock.textContent =
      "🔒";

    const label =
      document.createElement("span");

    label.textContent =
      protectedAccessText.trigger;

    button.append(
      lock,
      label
    );

    notice.append(button);

    heading.insertAdjacentElement(
      "afterend",
      notice
    );

    return button;
  }


  function createProtectedAccessDialog() {
    const existing =
      protectedAccessDialogHost();

    if (existing) {
      return existing;
    }

    const dialog =
      document.createElement("dialog");

    dialog.id =
      "branch-protected-access-dialog";

    dialog.className =
      "protected-access-dialog";

    dialog.dataset.branchProtectedAccessDialog =
      "";

    dialog.setAttribute(
      "aria-labelledby",
      "branch-protected-access-title"
    );

    const panel =
      document.createElement("div");

    panel.className =
      "protected-access-dialog__panel";

    const closeIcon =
      document.createElement("button");

    closeIcon.type =
      "button";

    closeIcon.className =
      "protected-access-dialog__close-icon";

    closeIcon.dataset.protectedAccessClose =
      "";

    closeIcon.setAttribute(
      "aria-label",
      protectedAccessText.closeAria
    );

    closeIcon.textContent =
      "×";

    const heading =
      document.createElement("div");

    heading.className =
      "protected-access-dialog__heading";

    const lock =
      document.createElement("span");

    lock.className =
      "protected-access-dialog__lock";

    lock.setAttribute(
      "aria-hidden",
      "true"
    );

    lock.textContent =
      "🔒";

    const title =
      document.createElement("h2");

    title.id =
      "branch-protected-access-title";

    title.textContent =
      protectedAccessText.title;

    heading.append(
      lock,
      title
    );

    const content =
      document.createElement("div");

    content.className =
      "protected-access-dialog__content";


    const firstParagraph =
      document.createElement("p");

    firstParagraph.textContent =
      protectedAccessText.paragraphs[0];


    const secondParagraph =
      document.createElement("p");

    secondParagraph.textContent =
      protectedAccessText.paragraphs[1];


    const requestIntro =
      document.createElement("p");

    requestIntro.textContent =
      protectedAccessText.paragraphs[2];


    const list =
      document.createElement("ul");

    protectedAccessText.list.forEach(
      (itemText) => {
        const item =
          document.createElement("li");

        item.textContent =
          itemText;

        list.append(item);
      }
    );


    const identityParagraph =
      document.createElement("p");

    identityParagraph.textContent =
      protectedAccessText.paragraphs[3];


    const warning =
      document.createElement("p");

    warning.className =
      "protected-access-dialog__warning";

    const warningStrong =
      document.createElement("strong");

    warningStrong.textContent =
      protectedAccessText.warning;

    warning.append(
      warningStrong
    );


    const approvalParagraph =
      document.createElement("p");

    approvalParagraph.textContent =
      protectedAccessText.paragraphs[4];


    const personalAccessParagraph =
      document.createElement("p");

    personalAccessParagraph.textContent =
      protectedAccessText.paragraphs[5];


    const administratorParagraph =
      document.createElement("p");

    administratorParagraph.textContent =
      protectedAccessText.paragraphs[6];


    content.append(
      firstParagraph,
      secondParagraph,
      requestIntro,
      list,
      identityParagraph,
      warning,
      approvalParagraph,
      personalAccessParagraph,
      administratorParagraph
    );


    const actions =
      document.createElement("div");

    actions.className =
      "protected-access-dialog__actions";


    const closeButton =
      document.createElement("button");

    closeButton.type =
      "button";

    closeButton.className =
      "protected-access-dialog__button protected-access-dialog__button--secondary";

    closeButton.dataset.protectedAccessClose =
      "";

    closeButton.textContent =
      protectedAccessText.close;


    const requestLink =
      document.createElement("a");

    requestLink.className =
      "protected-access-dialog__button protected-access-dialog__button--primary";

    requestLink.href =
      siteUrl(
        "kontakti.html#kontakt-obrazac"
      );

    requestLink.textContent =
      protectedAccessText.request;


    actions.append(
      closeButton,
      requestLink
    );


    panel.append(
      closeIcon,
      heading,
      content,
      actions
    );

    dialog.append(
      panel
    );

    document.body.append(
      dialog
    );

    return dialog;
  }


  function openProtectedAccessDialog(
    trigger
  ) {
    const dialog =
      createProtectedAccessDialog();

    if (!dialog) {
      return;
    }

    activeProtectedAccessTrigger =
      trigger || null;

    body.classList.add(
      "branch-protected-dialog-open"
    );

    if (
      typeof dialog.showModal ===
      "function"
    ) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog.setAttribute(
        "open",
        ""
      );
    }

    const closeIcon =
      dialog.querySelector(
        ".protected-access-dialog__close-icon"
      );

    if (closeIcon) {
      closeIcon.focus();
    }
  }


  function closeProtectedAccessDialog() {
    const dialog =
      protectedAccessDialogHost();

    if (!dialog) {
      return;
    }

    if (
      typeof dialog.close ===
        "function" &&
      dialog.open
    ) {
      dialog.close();
    } else {
      dialog.removeAttribute(
        "open"
      );
    }

    body.classList.remove(
      "branch-protected-dialog-open"
    );

    const previousTrigger =
      activeProtectedAccessTrigger;

    activeProtectedAccessTrigger =
      null;

    if (
      previousTrigger &&
      typeof previousTrigger.focus ===
        "function"
    ) {
      previousTrigger.focus();
    }
  }


  function installProtectedAccessDialog() {
    const trigger =
      createProtectedAccessTrigger();

    if (!trigger) {
      return;
    }

    const dialog =
      createProtectedAccessDialog();

    if (!dialog) {
      return;
    }

    if (
      trigger.dataset.branchProtectedAccessReady !==
      "true"
    ) {
      trigger.dataset.branchProtectedAccessReady =
        "true";

      trigger.addEventListener(
        "click",
        () => {
          openProtectedAccessDialog(
            trigger
          );
        }
      );
    }


    dialog
      .querySelectorAll(
        "[data-protected-access-close]"
      )
      .forEach(
        (button) => {

          if (
            button.dataset.branchProtectedAccessReady ===
            "true"
          ) {
            return;
          }

          button.dataset.branchProtectedAccessReady =
            "true";

          button.addEventListener(
            "click",
            closeProtectedAccessDialog
          );
        }
      );


    if (
      dialog.dataset.branchProtectedAccessEventsReady !==
      "true"
    ) {
      dialog.dataset.branchProtectedAccessEventsReady =
        "true";


      dialog.addEventListener(
        "cancel",
        (event) => {
          event.preventDefault();

          closeProtectedAccessDialog();
        }
      );


      dialog.addEventListener(
        "click",
        (event) => {

          if (
            event.target !==
            dialog
          ) {
            return;
          }

          const rect =
            dialog.getBoundingClientRect();

          const outside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

          if (outside) {
            closeProtectedAccessDialog();
          }
        }
      );


      dialog.addEventListener(
        "close",
        () => {
          body.classList.remove(
            "branch-protected-dialog-open"
          );
        }
      );
    }
  }


  /* =======================================================
     FOTOGRAFIJE — ZAJEDNIČKI LIGHTBOX
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

    overlay.dataset.branchPhotoLightbox =
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
      isEnglish
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
      isEnglish
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

    if (
      !image ||
      !caption ||
      !closeButton
    ) {
      return;
    }

    const figure =
      link.closest(
        ".person-photo"
      );

    const sourceCaption =
      figure
        ? figure.querySelector(
            "figcaption"
          )
        : null;

    const captionText =
      sourceCaption
        ? sourceCaption
            .textContent
            .trim()
        : "";

    activePhotoLink =
      link;

    image.src =
      link.href;

    image.alt =
      thumb.alt || "";

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

    const caption =
      overlay.querySelector(
        ".branch-photo-lightbox__caption"
      );

    if (image) {
      image.removeAttribute(
        "src"
      );

      image.alt =
        "";
    }

    if (caption) {
      caption.textContent =
        "";

      caption.hidden =
        true;
    }

    const previousLink =
      activePhotoLink;

    activePhotoLink =
      null;

    if (
      previousLink &&
      typeof previousLink.focus ===
        "function"
    ) {
      previousLink.focus();
    }
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
          link.dataset.branchPhotoReady ===
          "true"
        ) {
          return;
        }

        link.dataset.branchPhotoReady =
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
      closeButton.dataset.branchPhotoReady !==
        "true"
    ) {
      closeButton.dataset.branchPhotoReady =
        "true";

      closeButton.addEventListener(
        "click",
        closePhotoLightbox
      );
    }


    if (
      overlay.dataset.branchPhotoEventsReady !==
      "true"
    ) {
      overlay.dataset.branchPhotoEventsReady =
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
      body.dataset.branchPageEngineReady ===
      "true"
    ) {
      return;
    }

    installParentLink();
    installDiagramLink();
    installBranchNote();
    installProtectedAccessDialog();
    installPhotoLightbox();

    body.dataset.branchPageEngineReady =
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
              body.dataset.branchName ||
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
      init,
      openProtectedAccessDialog,
      closeProtectedAccessDialog,
      openPhotoLightbox,
      closePhotoLightbox
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
