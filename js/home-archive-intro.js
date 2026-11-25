/* =========================================================
   TANDARA — HOME ARCHIVE INTRO

   Zajednički statični informativni okvir ispod početnog stabla.
   Ne sadrži podatke osoba niti logiku rodoslovnih dijagrama.
   ========================================================= */

(() => {
  "use strict";

  const tree =
    document.querySelector(
      "[data-home-tree]"
    );

  if (!tree) {
    return;
  }

  if (
    document.querySelector(
      "[data-home-archive-intro]"
    )
  ) {
    return;
  }

  const language = String(window.TandaraLanguage?.get() || document.documentElement.lang || document.body?.dataset.lang || "hr").trim().toLowerCase().slice(0, 2);

  const isEnglish =
    language.startsWith("en");

  const COPY =
    Object.freeze({
      hr: Object.freeze({
        title:
          "Prezime Tandara – podrijetlo i rodoslovlje",

        text:
          "Digitalni arhiv prezimena Tandara objedinjuje podatke o podrijetlu, rodoslovlju i povijesti roda Tandara. Prikazuje glavne obiteljske grane, njihove veze te migracije i rasprostranjenost prezimena u Hrvatskoj, Bosni i Hercegovini i iseljeništvu. Arhiv je namijenjen Tandarama i svima koji istražuju ovo prezime."
      }),

      en: Object.freeze({
        title:
          "Tandara Surname – Origin and Genealogy",

        text:
          "The Tandara surname digital archive brings together information on the origin, genealogy and history of the Tandara family. It presents the main family branches, their connections, and the migration and distribution of the surname in Croatia, Bosnia and Herzegovina, and the diaspora. The archive is intended for members of the Tandara family and everyone researching this surname."
      }),

      de: Object.freeze({
        title:
          "Familienname Tandara – Herkunft und Genealogie",

        text:
          "Das digitale Archiv des Familiennamens Tandara vereint Informationen über die Herkunft, Genealogie und Geschichte der Familie Tandara. Es stellt die wichtigsten Familienzweige und ihre Verbindungen sowie die Migration und Verbreitung des Familiennamens in Kroatien, Bosnien und Herzegowina und in der Diaspora vor. Das Archiv richtet sich an Mitglieder der Familie Tandara und an alle, die diesen Familiennamen erforschen."
      })
    });

  const isGerman =
    language.startsWith("de");

  const copy =
    isEnglish
      ? COPY.en
      : isGerman
        ? COPY.de
        : COPY.hr;

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "home-archive-intro";

  section.dataset.homeArchiveIntro =
    "";

  section.setAttribute(
    "aria-labelledby",
    "home-archive-intro-title"
  );

  const title =
    document.createElement(
      "h2"
    );

  title.id =
    "home-archive-intro-title";

  title.className =
    "home-archive-intro__title";

  title.textContent =
    copy.title;

  const text =
    document.createElement(
      "p"
    );

  text.className =
    "home-archive-intro__text";

  text.textContent =
    copy.text;

  section.append(
    title,
    text
  );

  tree.insertAdjacentElement(
    "afterend",
    section
  );
})();
