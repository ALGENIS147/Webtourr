// Domi — asistente virtual de Harmony Excursions.
// Gratis: todo corre en el navegador. Entiende palabras clave en español e inglés,
// responde con los datos reales de los tours (js/bot-<idioma>.js) y pasa a WhatsApp cuando no sabe.
(() => {
  'use strict';
  const root = document.querySelector('[data-bot]');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const toggle = $('[data-bot-toggle]');
  const panel = $('#bot-panel');
  const log = $('[data-bot-log]');
  const chipsEl = $('[data-bot-chips]');
  const form = $('[data-bot-form]');
  const input = form.elements.q;
  const base = root.dataset.root || '';
  const lang = root.dataset.lang;
  const KEY = 'hx-bot-' + lang;
  let D = null;          // datos del bot (se cargan al abrir)
  let S = null;          // textos
  let lastTour = null;   // contexto: último tour del que se habló
  let lastQuestion = '';
  let history = [];

  // ---------- utilidades ----------
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = (s) => ' ' + s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  // Una palabra clave coincide exacta, o como inicio de palabra si es larga ("rain" → "rains", "reserv" → "reservamos").
  // Se permiten hasta 3 letras extra (plural, verbo): "rain" → "rains", pero "pana" ≠ "panama" en jerga (exacta).
  const variant = (w) => new RegExp(` ${w}[a-zñ]{1,3} `);
  const hit = (text, w, exact = false) => text.includes(' ' + w + ' ') || (!exact && !w.includes(' ') && w.length >= 4 && variant(w).test(text));
  const has = (text, words, exact = false) => words.some((w) => hit(text, w, exact));
  const score = (text, words) => words.reduce((n, w) => n + (hit(text, w) ? w.split(' ').length : 0), 0);
  const md = (s) => s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(KEY)) || null; } catch { return null; } },
    set(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* sin almacenamiento: no pasa nada */ } },
    clear() { try { sessionStorage.removeItem(KEY); } catch { /* idem */ } },
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load() {
    if (D) return Promise.resolve();
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = `${base}js/bot-${lang}.js`;
      s.onload = () => { D = window.HX_BOT; S = D.strings; ok(); };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  // ---------- pintar mensajes ----------
  function bubble(from, html, save = true) {
    const el = document.createElement('div');
    el.className = `bot__msg bot__msg--${from}`;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    if (save) { history.push([from, html]); store.set({ history, lastTour }); }
    return el;
  }
  function setChips(list) {
    chipsEl.innerHTML = '';
    for (const c of list) {
      const b = document.createElement(c.href ? 'a' : 'button');
      b.className = 'bot__chip' + (c.wa ? ' bot__chip--wa' : '');
      b.textContent = c.label;
      if (c.href) { b.href = c.href; if (c.wa || c.ext) { b.target = '_blank'; b.rel = 'noopener'; } }
      else { b.type = 'button'; b.addEventListener('click', () => ask(c.say || c.label)); }
      chipsEl.appendChild(b);
    }
  }
  function typing() {
    const el = bubble('bot', '<span class="bot__typing" aria-label="…"><i></i><i></i><i></i></span>', false);
    return el;
  }
  function reply(html, chips = []) {
    const t = typing();
    const delay = reduced ? 0 : Math.min(900, 350 + html.length * 2);
    setTimeout(() => {
      t.remove();
      bubble('bot', html);
      setChips(chips);
    }, delay);
  }

  // ---------- piezas de respuesta ----------
  const tourUrl = (t, hash = '') => `${base}${t.url}${hash}`;
  const waUrl = (q) => `https://wa.me/${D.site.whatsapp}?text=${encodeURIComponent(S.handoffMsg(q))}`;
  const card = (t) => `<a class="bot__card" href="${tourUrl(t)}"><img src="${base}${t.img}" alt="" loading="lazy" width="72" height="54"><span><b>${esc(t.title)}</b><small>${esc(t.price)}</small></span></a>`;
  const cards = (list) => `<div class="bot__cards">${list.map(card).join('')}</div>`;
  const tourChips = (t) => [
    { label: S.chips.book, href: tourUrl(t, '#book') },
    { label: S.chips.includes, say: `${S.chips.includes} ${t.title}` },
    { label: S.chips.duration, say: `${S.chips.duration} ${t.title}` },
  ];
  const humanChip = () => ({ label: S.chips.human, href: waUrl(lastQuestion), wa: true });
  const catChips = () => Object.entries(S.catChips).map(([k, v]) => ({ label: v, say: v, cat: k }));

  function findTours(text) {
    const scored = D.tours.map((t) => ({ t, n: score(text, D.aliases[t.slug] || []) + (text.includes(' ' + norm(t.title).trim() + ' ') ? 5 : 0) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n);
    if (!scored.length) return [];
    const top = scored[0].n;
    return scored.filter((x) => x.n === top).map((x) => x.t).concat(scored.filter((x) => x.n < top).map((x) => x.t));
  }

  // ---------- el cerebro ----------
  function answer(raw) {
    const q = norm(raw);
    const I = D.intents;
    const is = (k) => has(q, I[k]);
    // Un botón de categoría ("Mar y buceo") manda sobre los nombres de tours que contiene.
    const chipCat = Object.entries(S.catChips).find(([, v]) => norm(v) === q)?.[0];
    const found = chipCat ? [] : findTours(q);
    const topScore = found.length ? score(q, D.aliases[found[0].slug] || []) : 0;
    const tied = found.filter((x) => score(q, D.aliases[x.slug] || []) === topScore);
    const tour = tied.length === 1 ? tied[0] : null;

    // Pedir una persona va primero: nunca hacer esperar a quien quiere hablar con alguien.
    if (is('human')) return reply(S.human, [{ label: S.chips.whatsapp, href: waUrl(lastQuestion), wa: true }]);

    // Varios tours empatan ("Saona", "buceo"): mostrar las opciones con su precio.
    if (tied.length > 1) {
      lastTour = null;
      return reply(`${S.pickTour}${cards(tied.slice(0, 4))}`, tied.slice(0, 4).map((x) => ({ label: x.title, say: x.title })));
    }

    // Preguntas sobre un tour concreto (o el último del que hablamos).
    const asksDetail = is('price') || is('includes') || is('duration') || is('book');
    const t = tour || (asksDetail ? lastTour : null);
    if (t) {
      lastTour = t;
      if (is('includes')) {
        return reply(`${S.includesIntro(esc(t.title))}<ul>${t.includes.map((x) => `<li>✓ ${esc(x)}</li>`).join('')}</ul>${S.excludesIntro} ${t.excludes.map(esc).join(', ')}.`, tourChips(t));
      }
      if (is('duration')) return reply(S.durationIntro(esc(t.title), t.duration, D.site.zones), tourChips(t));
      if (is('book')) return reply(`${S.bookIntro(esc(t.title))}${card(t)}`, [{ label: S.chips.book, href: tourUrl(t, '#book') }, humanChip()]);
      if (is('price')) return reply(S.priceIntro(esc(t.title), esc(t.price)), tourChips(t));
      return reply(`${S.summary(esc(t.title), esc(t.tagline), esc(t.price))}${card(t)}`, tourChips(t));
    }

    // Pregunta por un detalle sin decir de qué tour.
    if (is('includes') || is('duration') || is('book')) {
      const list = D.tours.filter((x) => x.featured).slice(0, 4);
      return reply(`${S.pickTour}${cards(list)}`, list.map((x) => ({ label: x.title, say: `${raw} ${x.title}` })));
    }

    // Reseñas y confianza.
    if (is('reviews')) return reply(S.reviewsInfo(D.reviews), [{ label: S.reviewsChip, href: D.reviews.url, wa: false, ext: true }, ...D.tours.filter((x) => x.featured).slice(0, 2).map((x) => ({ label: x.title, say: x.title }))]);

    // Preguntas frecuentes.
    for (const k of ['pickup', 'payment', 'cancel', 'bring', 'rain']) if (is(k)) return reply(esc(D.faq[k]), [{ label: S.chips.all, href: `${base}${lang === 'en' ? '' : lang + '/'}tours/` }, humanChip()]);
    if (is('kids')) return reply(`${esc(D.faq.kids)}<br><br>${S.kidsTours}${cards(D.tours.filter((x) => x.kids).slice(0, 3))}`, catChips().slice(0, 3));
    if (is('groups')) return reply(`${esc(D.faq.groups)}<br><br>${S.groupsIntro}${cards(D.tours.filter((x) => x.cat === 'private' || /private|privad/i.test(x.slug + x.title)).slice(0, 3))}`, [humanChip()]);
    if (is('contact')) return reply(S.contactInfo(D.site), [{ label: S.chips.whatsapp, href: waUrl(''), wa: true }]);
    if (is('hours')) return reply(S.hoursInfo(D.site), [humanChip()]);

    // Recomendaciones y listas.
    const catKey = ['islands', 'sea', 'adventure', 'culture', 'night'].find((c) => has(q, I['cat_' + c]));
    const cat = chipCat || catKey;
    if (cat) {
      const list = D.tours.filter((x) => x.cat === cat);
      return reply(`${S.catIntro(D.cats[cat])}${cards(list.slice(0, 4))}`, catChips().filter((c) => c.cat !== cat).slice(0, 4));
    }
    if (is('cheap')) {
      const list = D.tours.filter((x) => x.from > 0 && x.perPerson).sort((a, b) => a.from - b.from).slice(0, 4);
      return reply(`${S.cheapIntro}${cards(list)}`, catChips().slice(0, 4));
    }
    if (is('price')) {
      const pp = D.tours.filter((x) => x.from > 0 && x.perPerson).map((x) => x.from);
      return reply(S.priceRange(Math.min(...pp), Math.max(...pp)), D.tours.filter((x) => x.featured).slice(0, 4).map((x) => ({ label: x.title, say: x.title })));
    }
    if (is('recommend')) return reply(S.recommendIntro, catChips());
    if (is('all') || q.includes(' popular') || q.includes(' favorit')) {
      return reply(`${is('all') ? S.allIntro(D.tours.length) : S.popularIntro}${cards(D.tours.filter((x) => x.featured).slice(0, 4))}`, [{ label: S.chips.all, href: `${base}${lang === 'en' ? '' : lang + '/'}tours/` }]);
    }

    // Conversación.
    if (has(q, I.slang, true)) return reply(S.slang, catChips().slice(0, 3));
    if (is('thanks')) return reply(md(S.thanks), []);
    if (is('bye')) return reply(S.bye, []);
    if (is('greet')) return reply(S.greet, S.starters.map((x) => ({ label: x })));

    return reply(S.fallback, [humanChip(), ...S.fallbackChips.map((x) => ({ label: x }))]);
  }

  function ask(text) {
    const q = text.trim();
    if (!q) return;
    lastQuestion = q;
    bubble('user', esc(q));
    setChips([]);
    answer(q);
  }

  // ---------- abrir / cerrar ----------
  function start(fresh) {
    log.innerHTML = '';
    const saved = fresh ? null : store.get();
    if (saved?.history?.length) {
      history = saved.history;
      lastTour = saved.lastTour ? D.tours.find((t) => t.slug === saved.lastTour.slug) || null : null;
      for (const [from, html] of history) bubble(from, html, false);
      reply(S.helloBack, S.starters.map((x) => ({ label: x })));
    } else {
      history = [];
      lastTour = null;
      store.clear();
      reply(S.hello, S.starters.map((x) => ({ label: x })));
    }
  }
  async function open() {
    // Sin conexión para cargar los datos: mejor ir directo a WhatsApp que dejar un chat vacío.
    try { await load(); } catch { window.open(`https://wa.me/${root.dataset.wa}`, '_blank', 'noopener'); return; }
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    if (!log.children.length) start(false);
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
    toggle.focus();
  }
  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  $('[data-bot-close]').addEventListener('click', close);
  $('[data-bot-restart]').addEventListener('click', () => start(true));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
  // Las tarjetas de tour dentro del chat cierran el panel al navegar (la conversación se guarda).
  log.addEventListener('click', (e) => { if (e.target.closest('a')) store.set({ history, lastTour }); });

  // Si el cliente ya conversó en otra página, el globo lo recuerda.
  if (store.get()?.history?.length) root.classList.add('has-history');
})();
