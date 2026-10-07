/* Adds the family photograph to Zdravko's existing diagram detail panel. */
(function () {
  'use strict';
  function init() {
    const code = document.getElementById('personDetailsCode');
    const panel = document.getElementById('personDetails');
    if (!code || !panel) return;
    const portrait = panel.querySelector('.person-details-image');
    if (!portrait) return;
    const family = document.createElement('figure');
    family.className = 'person-details-image';
    family.hidden = true;
    const caption = document.documentElement.lang === 'en' ? 'Zdravko’s family' : 'Obitelj Zdravkova';
    const link = document.createElement('a');
    link.href = 'https://tandarajure-crypto.github.io/tandara-common/slike/antinagrana/zdravkovaobitel%20.jpg';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const image = document.createElement('img');
    image.src = link.href;
    image.alt = caption;
    image.loading = 'lazy';
    image.decoding = 'async';
    link.appendChild(image);
    const label = document.createElement('figcaption');
    label.textContent = caption;
    family.append(link, label);
    portrait.after(family);
    function update() {
      family.hidden = code.textContent.split(':').pop().trim() !== '3.3.1.2.1.3.1.4';
    }
    new MutationObserver(update).observe(code, { childList: true, characterData: true, subtree: true });
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
