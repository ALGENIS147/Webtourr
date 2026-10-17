// Harmony Excursions — interacciones del sitio. Sin dependencias.
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  document.documentElement.classList.remove('no-js');
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const isoDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  // ---------- header ----------
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('[data-menu]');
  const nav = $('#nav');
  if (menuBtn && nav) {
    const setMenu = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) $('a', nav)?.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    matchMedia('(min-width: 981px)').addEventListener('change', (m) => m.matches && setMenu(false));
  }

  // ---------- aparición al hacer scroll ----------
  const reveal = $$('[data-reveal], .map');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach((el) => io.observe(el));
  } else reveal.forEach((el) => el.classList.add('is-in'));

  // ---------- hora local de Punta Cana ----------
  const clock = $('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat(clock.dataset.lang, { timeZone: 'America/Santo_Domingo', hour: 'numeric', minute: '2-digit' });
    const tick = () => { $('[data-clock-time]', clock).textContent = fmt.format(new Date()); };
    tick();
    clock.hidden = false;
    setInterval(tick, 30000);
  }

  // ---------- fechas: mínimo mañana ----------
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  $$('[data-mindate]').forEach((i) => { i.min = isoDate(tomorrow); });

  const params = new URLSearchParams(location.search);

  // ---------- buscador del inicio ----------
  const finder = $('[data-finder]');
  if (finder) finder.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(finder);
    const tour = fd.get('tour');
    if (!tour) { finder.tour.focus(); finder.tour.setAttribute('aria-invalid', 'true'); return; }
    const q = new URLSearchParams();
    if (fd.get('date')) q.set('date', fd.get('date'));
    if (fd.get('guests')) q.set('guests', fd.get('guests'));
    location.href = `${finder.dataset.base}${tour}/${q.toString() ? '?' + q : ''}#book`;
  });

  // ---------- catálogo ----------
  const catalog = $('[data-catalog]');
  if (catalog) {
    const cards = $$('.card', catalog);
    const order = cards.slice();
    const chips = $$('[data-filter]');
    const search = $('[data-search]');
    const sort = $('[data-sort]');
    const count = $('[data-count]');
    const empty = $('[data-empty]');
    let cat = 'all';
    const known = chips.map((c) => c.dataset.filter);
    if (known.includes(params.get('cat'))) cat = params.get('cat');

    const apply = () => {
      const q = (search.value || '').trim().toLowerCase();
      let n = 0;
      for (const c of cards) {
        const ok = (cat === 'all' || c.dataset.cat === cat) && (!q || c.dataset.search.includes(q));
        c.hidden = !ok;
        if (ok) { n++; c.classList.add('is-in'); }
      }
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === cat)));
      const tpl = n === 1 ? count.dataset.templateOne : count.dataset.template;
      count.textContent = tpl.replace('{n}', n);
      empty.hidden = n > 0;
      const sorted = sort.value === 'featured' ? order : order.slice().sort((a, b) => (sort.value === 'low' ? 1 : -1) * (a.dataset.price - b.dataset.price));
      sorted.forEach((c) => catalog.appendChild(c));
      const url = new URL(location.href);
      cat === 'all' ? url.searchParams.delete('cat') : url.searchParams.set('cat', cat);
      history.replaceState(null, '', url);
    };
    chips.forEach((c) => c.addEventListener('click', () => { cat = c.dataset.filter; apply(); }));
    search.addEventListener('input', apply);
    sort.addEventListener('change', apply);
    apply();
  }

  // ---------- mapa ----------
  const pins = $$('[data-pin]');
  const closePins = (except) => pins.forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    $('#' + b.getAttribute('aria-controls')).hidden = true;
  });
  pins.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = b.getAttribute('aria-expanded') !== 'true';
    closePins(b);
    b.setAttribute('aria-expanded', String(open));
    $('#' + b.getAttribute('aria-controls')).hidden = !open;
  }));
  if (pins.length) {
    document.addEventListener('click', (e) => { if (!e.target.closest('.pin__card')) closePins(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closePins(); });
  }

  // ---------- galería ----------
  const gallery = $('[data-gallery]');
  const lb = $('[data-lightbox]');
  if (gallery && lb) {
    const items = JSON.parse($('[data-gallery-src]', gallery).innerHTML);
    const img = $('[data-lb-img]', lb);
    const cap = $('[data-lb-cap]', lb);
    let i = 0;
    let opener = null;
    const show = (n) => {
      i = (n + items.length) % items.length;
      img.src = items[i].src; img.alt = items[i].alt;
      cap.textContent = `${items[i].alt} · ${i + 1}/${items.length}`;
    };
    const open = (n, btn) => { opener = btn; show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; $('[data-lb-close]', lb).focus(); };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener?.focus(); };
    $$('.gallery__item', gallery).forEach((b) => b.addEventListener('click', () => open(+b.dataset.index, b)));
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(i - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'Tab') { // mantener el foco dentro del visor
        const f = $$('button', lb);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    });
    let x0 = null; // deslizar en el celular
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // ---------- steppers ----------
  $$('[data-stepper]').forEach((s) => {
    const input = $('input', s);
    const [dec, inc] = $$('button', s);
    const clamp = () => {
      const min = +input.min, max = +input.max;
      let v = parseInt(input.value, 10);
      if (Number.isNaN(v)) v = min;
      input.value = Math.min(max, Math.max(min, v));
      dec.disabled = +input.value <= min;
      inc.disabled = +input.value >= max;
    };
    s.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      input.value = (+input.value || 0) + +b.dataset.step;
      clamp();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    input.addEventListener('change', () => { clamp(); input.dispatchEvent(new Event('input', { bubbles: true })); });
    clamp();
  });

  // ---------- reserva ----------
  const form = $('[data-booking]');
  if (form) {
    const cfg = JSON.parse($('[data-booking-config]', form).textContent);
    const p = cfg.pricing;
    const L = cfg.i18n;
    const totalEl = $('[data-total]', form);
    const breakdown = $('[data-breakdown]', form);
    const tierNote = $('[data-tier-note]', form);
    const dateInput = form.elements.date;
    const dateErr = $('#date-err');
    const val = (n) => (form.elements[n] ? +form.elements[n].value || 0 : 0);

    // Valores que llegan desde el buscador del inicio.
    if (params.get('date') && params.get('date') >= dateInput.min) dateInput.value = params.get('date');
    const g = +params.get('guests');
    if (g > 0) {
      const target = form.elements.adults || form.elements.guests || form.elements.couples;
      if (target) {
        target.value = target.name === 'couples' ? Math.ceil(g / 2) : g;
        target.dispatchEvent(new Event('change'));
      }
    }

    const compute = () => {
      if (p.type === 'person') {
        const a = val('adults'), c = val('children');
        const total = a * p.adult + c * (form.elements.children ? p.child : 0);
        const parts = [`${a} × ${money(p.adult)}`];
        if (c) parts.push(`${c} × ${money(p.child)}`);
        return { total, guests: `${a} ${L.adults.toLowerCase()}${c ? `, ${c} ${L.children.toLowerCase()}` : ''}`, detail: parts.join(' + ') };
      }
      if (p.type === 'tiers') {
        const n = val('guests');
        const idx = p.tiers.findIndex((t) => n >= t.min && n <= t.max);
        const t = p.tiers[idx];
        if (tierNote) tierNote.textContent = L.tierLabels[idx] || '';
        const total = t.unit === 'person' ? t.price * n : t.price;
        return { total, guests: `${n}`, detail: t.unit === 'person' ? `${n} × ${money(t.price)}` : L.perGroupNote };
      }
      if (p.type === 'package') {
        const id = form.elements.package.value;
        const o = p.options.find((x) => x.id === id);
        const n = val('guests');
        return { total: o.price * n, guests: `${n}`, pkg: o.name[cfg.lang], detail: `${n} × ${money(o.price)}` };
      }
      if (p.type === 'couple') {
        const n = val('couples');
        const total = p.first + Math.max(0, n - 1) * p.extra;
        return { total, guests: `${n} ${L.couples.toLowerCase()} (${n * 2})`, detail: n > 1 ? `${money(p.first)} + ${n - 1} × ${money(p.extra)}` : '' };
      }
      return { total: 0, guests: '', detail: '' };
    };

    let last = null;
    const render = () => {
      const r = compute();
      if (last !== null && last !== r.total && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        totalEl.animate([{ transform: 'translateY(4px)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'ease-out' });
      }
      last = r.total;
      totalEl.textContent = money(r.total);
      breakdown.textContent = r.detail;
      return r;
    };
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    render();

    const ref = () => {
      const d = (dateInput.value || isoDate(new Date())).replace(/-/g, '').slice(2);
      const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `HX-${d}-${rand}`;
    };
    const fmtDate = (s) => new Date(s + 'T12:00:00').toLocaleDateString(cfg.lang === 'es' ? 'es-DO' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!dateInput.value || dateInput.value < dateInput.min) {
        dateInput.setAttribute('aria-invalid', 'true');
        dateErr.hidden = false;
        dateInput.focus();
        return;
      }
      dateInput.removeAttribute('aria-invalid');
      dateErr.hidden = true;
      const r = render();
      const code = ref();
      const M = L.msgLines;
      const lines = [
        L.msgIntro,
        '',
        `${M.date}: ${fmtDate(dateInput.value)}`,
        `${M.guests}: ${r.guests}`,
        r.pkg ? `${M.package}: ${r.pkg}` : null,
        `${M.total}: ${money(r.total)} USD`,
        form.elements.name.value.trim() ? `${M.name}: ${form.elements.name.value.trim()}` : null,
        form.elements.hotel.value.trim() ? `${M.hotel}: ${form.elements.hotel.value.trim()}` : null,
        `${M.ref}: ${code}`,
      ].filter((x) => x !== null).join('\n');
      const via = e.submitter?.dataset.via || 'wa';
      const url = via === 'mail'
        ? `mailto:${cfg.email}?subject=${encodeURIComponent(L.emailSubject.replace('{ref}', code))}&body=${encodeURIComponent(lines)}`
        : `https://wa.me/${cfg.phone}?text=${encodeURIComponent(lines)}`;
      if (via === 'mail') location.href = url;
      else window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- barra fija de reserva en el celular ----------
  const mbar = $('[data-mbar]');
  const book = $('#book');
  if (mbar && book) {
    // Visible después de bajar un poco y mientras el formulario aún no aparece en pantalla.
    const update = () => {
      const r = book.getBoundingClientRect();
      mbar.classList.toggle('is-visible', scrollY > 400 && r.top > innerHeight);
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---------- formulario de contacto ----------
  const cform = $('[data-contact]');
  if (cform) cform.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!cform.reportValidity()) return;
    const f = cform.elements;
    const es = document.documentElement.lang === 'es';
    const text = [
      es ? '¡Hola Harmony Excursions!' : 'Hello Harmony Excursions!',
      '',
      f.message.value.trim(),
      '',
      `${es ? 'Nombre' : 'Name'}: ${f.name.value.trim()}`,
      f.email.value.trim() ? `Email: ${f.email.value.trim()}` : null,
      f.dates.value.trim() ? `${es ? 'Fechas' : 'Dates'}: ${f.dates.value.trim()}` : null,
    ].filter((x) => x !== null).join('\n');
    if (e.submitter?.dataset.via === 'mail') {
      location.href = `mailto:${cform.dataset.email}?subject=${encodeURIComponent(es ? 'Consulta desde la web' : 'Website enquiry')}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(`https://wa.me/${cform.dataset.phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }
  });
})();
