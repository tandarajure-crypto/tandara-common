/* Stable loading for the public Antina branch. Original photo links are preserved. */
(() => {
  'use strict';
  const root = document.querySelector('main.branch-content');
  if (!root) return;
  const initialized = new WeakSet();
  function prepare(img) {
    if (initialized.has(img)) return;
    const url = new URL(img.getAttribute('src') || '', document.baseURI);
    if (url.origin !== 'https://tandarajure-crypto.github.io' || !url.pathname.startsWith('/tandara-common/slike/')) return;
    initialized.add(img);
    let retries = 0;
    let pending = false;
    let notice;
    const retry = () => {
      if (pending || !img.isConnected) return;
      if (retries >= 2) {
        const link = img.closest('a');
        if (link && !notice) {
          notice = document.createElement('span');
          notice.textContent = document.documentElement.lang.startsWith('en') ? 'Open original photograph' : 'Otvori izvornu fotografiju';
          link.append(notice);
        }
        return;
      }
      pending = true;
      const attempt = ++retries;
      setTimeout(() => {
        pending = false;
        if (!img.isConnected || img.naturalWidth > 0) return;
        const next = new URL(url);
        next.searchParams.set('media_retry', String(attempt));
        img.src = next.href;
      }, attempt * 1200);
    };
    img.addEventListener('error', retry);
    img.addEventListener('load', () => { if (notice) notice.remove(); });
    img.loading = 'eager';
    if (img.complete && img.naturalWidth === 0) retry();
  }
  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.matches('img')) prepare(node);
    node.querySelectorAll('img').forEach(prepare);
  }
  scan(root);
  new MutationObserver(entries => {
    for (const entry of entries) entry.addedNodes.forEach(scan);
  }).observe(root, {childList: true, subtree: true});
})();
