const grid = document.getElementById('trending-grid');
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('text-green-800', isActive);
      b.classList.toggle('text-slate-400', !isActive);
      b.classList.toggle('hover:text-slate-600', !isActive);
      const indicator = b.querySelector('.tab-indicator');
      if (indicator) {
        indicator.style.width = isActive ? '2rem' : '0';
      }
    });

    flipFilter(tab);
  });
});

function flipFilter(tab) {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.trending-card'));
  const gridRect = grid.getBoundingClientRect();

  const willBeVisible = cards.filter(c => tab === 'Semua' || c.dataset.category === tab);
  const willBeHidden = cards.filter(c => tab !== 'Semua' && c.dataset.category !== tab);

  willBeVisible.forEach(card => {
    card.style.cssText = '';
  });

  grid.offsetHeight;

  const firstRects = new Map();
  cards.forEach(card => firstRects.set(card, card.getBoundingClientRect()));

  willBeHidden.forEach(card => {
    const r = firstRects.get(card);
    if (!r) return;
    card.style.transition = 'opacity 200ms ease, transform 200ms ease';
    card.style.position = 'absolute';
    card.style.width = r.width + 'px';
    card.style.left = (r.left - gridRect.left) + 'px';
    card.style.top = (r.top - gridRect.top) + 'px';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.pointerEvents = 'none';
  });

  grid.offsetHeight;

  const lastRects = new Map();
  willBeVisible.forEach(card => lastRects.set(card, card.getBoundingClientRect()));

  willBeVisible.forEach(card => {
    const first = firstRects.get(card);
    const last = lastRects.get(card);
    if (!first || !last) return;
    card.style.transition = 'none';
    card.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
    card.style.opacity = '0';
  });

  grid.offsetHeight;

  willBeVisible.forEach(card => {
    card.style.transition = 'transform 400ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease';
    card.style.transform = '';
    card.style.opacity = '1';
  });

  setTimeout(() => {
    willBeHidden.forEach(card => { card.style.cssText = 'display: none'; });
  }, 210);
}