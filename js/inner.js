(() => {
  const p = new URLSearchParams(location.search);
  if (p.get('embedded') === '1') document.body.classList.add('embedded');
})();
