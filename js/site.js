(() => {
  'use strict';
  const dlg = document.querySelector('#panel-dialog');
  const frame = document.querySelector('#panel-content');
  const closeBtn = document.querySelector('#panel-close');
  const name = document.querySelector('#panel-name');
  const external = document.querySelector('#panel-new-tab');
  const pages = {
    'archive.html': 'FIELD ARCHIVE',
    'lounge.html': 'SIGNAL LOUNGE',
    'cards.html': 'STORAGE',
    'field.html': 'FIELD ACCESS'
  };
  if (!dlg || !frame) return;
  let lastTrigger = null;
  function openPanel(page, trigger) {
    if (!Object.prototype.hasOwnProperty.call(pages, page)) return;
    lastTrigger = trigger || null;
    name.textContent = '/ ' + pages[page];
    external.href = page;
    frame.src = page + '?embedded=1';
    if (!dlg.open) dlg.showModal();
    closeBtn.focus();
  }
  function closePanel() { if (dlg.open) dlg.close(); }
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openPanel(btn.dataset.open, btn));
  });
  closeBtn.addEventListener('click', closePanel);
  dlg.addEventListener('click', e => { if (e.target === dlg) closePanel(); });
  dlg.addEventListener('close', () => {
    frame.src = 'about:blank';
    if (lastTrigger) lastTrigger.focus();
  });
  // Allow embedded pages to ask the parent modal to close via same-origin messages.
  window.addEventListener('message', e => {
    if (e.origin !== window.location.origin) return;
    if (e.data && e.data.type === 'earth-close-panel') closePanel();
  });
})();
