/* TANDARA COMMON — zajednički elementi glavnih grana */
(() => {
  "use strict";

  const body = document.body;
  const siteRoot = (body.dataset.siteRoot || "./").replace(/\/?$/, "/");
  const commonRoot = (body.dataset.commonRoot || "../tandara-common/").replace(/\/?$/, "/");
  const page = body.dataset.page || "";
  const branchName = body.dataset.branchName || "";
  const diagramHref = body.dataset.diagram || "";
  const lang = (document.documentElement.lang || "hr").toLowerCase();
  const isHr = lang.startsWith("hr");

  const pageHr = page ? `${siteRoot}${page}.html` : `${siteRoot}index.html`;
  const pageEn = page ? `${siteRoot}${page}-en.html` : `${siteRoot}index-en.html`;

  const oldRepo = "https://tandarajure-crypto.github.io/Tandara/";
  const commonImage = (name) => `${commonRoot}slike/${name}`;

  function fallback(img, oldName) {
    if (!img) return;
    img.addEventListener("error", function useOldRepo() {
      img.removeEventListener("error", useOldRepo);
      img.src = oldRepo + oldName;
    });
  }

  const sidebar = document.getElementById("common-sidebar");
  if (sidebar) {
    sidebar.className = "left-menu";
    sidebar.innerHTML = `
      <a aria-label="${isHr ? "Početna stranica" : "Home"}" class="home-button" href="${siteRoot}index.html">
        <div class="home-circle">
          <svg aria-hidden="true" class="home-svg" fill="none" stroke="white"
               stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               viewBox="0 0 24 24">
            <path d="M3 10.5L12 3l9 7.5"></path>
            <path d="M5 10v10h14V10"></path>
            <path d="M10 20v-6h4v6"></path>
          </svg>
        </div>
      </a>

      <div class="lang-switch">
        <a class="lang-btn flag-btn" href="${pageHr}" title="Hrvatski">
          <img id="common-flag-hr" alt="Hrvatski" src="${commonImage("flag-hr.png")}">
        </a>
        <a class="lang-btn flag-btn" href="${pageEn}" title="English">
          <img id="common-flag-uk" alt="English" src="${commonImage("flag-uk.png")}">
        </a>
      </div>

      <div class="menu-title">TANDARA-PREZIME</div>

      <ul class="heritage-menu">
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "autor-hr.html" : "autor-en.html"}">${isHr ? "O autoru i projektu" : "About the author and project"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "podrijetlo-hr.html" : "podrijetlo-en.html"}">${isHr ? "Podrijetlo prezimena" : "Surname origin"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "rodoslovlje-hr.html" : "rodoslovlje-en.html"}">${isHr ? "Rodoslovlje roda" : "Family genealogy"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "migracije-hr.html" : "migracije-en.html"}">${isHr ? "Migracije i rasprostranjenost" : "Migration and distribution"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "zanimljivosti.html" : "zanimljivosti-en.html"}">${isHr ? "Zanimljivosti" : "Interesting facts"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "kontakti.html" : "kontakti-en.html"}">${isHr ? "Kontakt i suradnja" : "Contact and collaboration"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "knjiga-poruka.html" : "knjiga-poruka-en.html"}">${isHr ? "Knjiga poruka" : "Guestbook"}</a></li>
        <li><span>🌳</span><a href="${siteRoot}${isHr ? "privatnost.html" : "privatnost-en.html"}">${isHr ? "Politika privatnosti" : "Privacy policy"}</a></li>
      </ul>

      <div class="author-photo">
        <a href="${siteRoot}${isHr ? "autor-hr.html" : "autor-en.html"}">
          <img id="common-jure" alt="Jure Tandara" src="${commonImage("jure.png")}" loading="lazy" decoding="async">
        </a>
      </div>
    `;

    fallback(document.getElementById("common-flag-hr"), "flag-hr.png");
    fallback(document.getElementById("common-flag-uk"), "flag-uk.png");
    fallback(document.getElementById("common-jure"), "jure.png");
  }

  const tools = document.getElementById("common-branch-tools");
  if (tools) {
    tools.className = "branch-common-tools";
    tools.innerHTML = `
      <img id="common-branch-flag"
           alt="${isHr ? "Hrvatska zastava" : "Croatian flag"}"
           class="branch-flag"
           src="${commonImage("flag-hr.png")}">
      <div aria-label="${isHr ? "Alati stranice" : "Page tools"}" class="branch-page-actions">
        <button class="branch-print-button" type="button">
          <span aria-hidden="true" class="branch-print-button__icon">🖨️</span>
          ${isHr ? "Ispis stranice" : "Print page"}
        </button>
      </div>
    `;
    fallback(document.getElementById("common-branch-flag"), "flag-hr.png");

    const printButton = tools.querySelector(".branch-print-button");
    if (printButton) printButton.addEventListener("click", () => window.print());
  }

  const footer = document.getElementById("common-branch-footer");
  if (footer && branchName && diagramHref) {
    const safeName = branchName.replace(/[<>&"]/g, "");
    footer.innerHTML = `
      <section class="branch-diagram-link">
        <div>
          <h2>${isHr ? "Interaktivni dijagram" : "Interactive diagram"} ${safeName}</h2>
          <p>${isHr
            ? "Otvorite pripadajući interaktivni rodoslovni dijagram ove obiteljske grane."
            : "Open the interactive genealogical diagram for this family branch."}</p>
        </div>
        <a class="branch-diagram-link__button" href="${siteRoot}${diagramHref}">
          ${isHr ? "Otvori dijagram" : "Open diagram"}
        </a>
      </section>

      <section class="tree-note">
        <h3>${isHr ? "Napomena!" : "Note!"}</h3>
        <p>${isHr
          ? "Kompletno rodoslovno stablo ove obiteljske grane nalazi se u desnom interaktivnom dijagramu na početnoj stranici Digitalnog arhiva roda Tandara."
          : "The complete family tree of this branch is available in the interactive diagram on the home page of the Tandara Digital Archive."}</p>
        <p>${isHr
          ? `Na početnoj stranici odaberite klikabilni okvir pod nazivom „${safeName}”.`
          : `On the home page, select the clickable box named “${safeName}”.`}</p>
      </section>
    `;
  }

  document.querySelectorAll("img[data-old-src]").forEach((img) => {
    img.addEventListener("error", function useOldImage() {
      img.removeEventListener("error", useOldImage);
      img.src = img.dataset.oldSrc;
    });
  });
})();
