(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Mobile menu
  const toggle = $('.menu-toggle'), menu = $('#menu');
  const setMenu = open => { toggle.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); toggle.setAttribute('aria-label', open ? 'بستنِ منو' : 'باز کردنِ منو'); };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Reveal on scroll
  const items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));

  // Screenshot lightbox (per gallery)
  const lb = $('.lightbox'), lbImg = $('img', lb);
  let group = [], index = 0, last = null;
  const show = i => { index = (i + group.length) % group.length; const b = group[index]; lbImg.src = b.dataset.full; lbImg.alt = $('img', b).alt; };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; if (last) last.focus(); };
  $$('.shot').forEach(btn => btn.addEventListener('click', () => {
    group = $$('.shot', btn.closest('[role="list"]') || btn.parentElement); last = btn; show(group.indexOf(btn));
    lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus();
  }));
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => show(index - 1));
  $('.lb-next', lb).addEventListener('click', () => show(index + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index - 1);
    if (e.key === 'ArrowLeft') show(index + 1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(index + (dx > 0 ? 1 : -1)); x0 = null; });

  // Copy e-mail
  const done = $('.copy-done');
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const text = b.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove(); }
    done.textContent = 'نشانیِ ایمیل کپی شد.';
    setTimeout(() => { done.textContent = ''; }, 2500);
  }));

  // Persian year
  try { const y = $('#year'); if (y) y.textContent = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date()).replace(/[^۰-۹0-9]/g, ''); } catch {}
})();
