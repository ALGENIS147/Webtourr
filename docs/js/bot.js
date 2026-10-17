// Domi — asistente virtual de Harmony Excursions.
// Gratis: todo corre en el navegador, sin IA de pago. Qué sabe hacer:
//  · corrige errores de escritura ("sanoa" → saona) comparando con su vocabulario
//  · extrae datos de la frase: personas, niños, fecha ("el sábado", "15 de diciembre"), presupuesto, días
//  · cotiza el total exacto con las reglas de precio de cada tour y deja la reserva lista
//  · compara tours, arma planes por días, filtra por presupuesto, da el clima y la hora en vivo
//  · recuerda el contexto de la conversación y pasa a WhatsApp cuando no sabe
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
  const locale = lang === 'es' ? 'es-DO' : 'en-US';
  let D = null;  // datos (se cargan al abrir el chat)
  let S = null;  // textos
  let ctx = { tour: null, adults: 0, kids: 0, date: null, budget: 0 };
  let lastQuestion = '';
  let history = [];
  let vocab = null;

  // ---------- utilidades ----------
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const strip = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = (s) => ' ' + strip(s).replace(/[^a-z0-9ñ$/ ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  const variant = (w) => new RegExp(` ${w}[a-zñ]{1,3} `);
  const hit = (text, w, exact = false) => text.includes(' ' + w + ' ') || (!exact && !w.includes(' ') && w.length >= 4 && variant(w).test(text));
  const has = (text, words, exact = false) => words.some((w) => hit(text, w, exact));
  const score = (text, words) => words.reduce((n, w) => n + (hit(text, w) ? w.split(' ').length : 0), 0);
  const md = (s) => s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(KEY)) || null; } catch { return null; } },
    set(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
    clear() { try { sessionStorage.removeItem(KEY); } catch { /* idem */ } },
  };
  const save = () => store.set({ history, ctx: { ...ctx, tour: ctx.tour?.slug || null } });

  function load() {
    if (D) return Promise.resolve();
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = `${base}js/bot-${lang}.js`;
      s.onload = () => { D = window.HX_BOT; S = D.strings; buildVocab(); ok(); };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  // ---------- corrector de escritura ----------
  // Distancia de edición (con transposición): "sanoa" ↔ "saona" = 1.
  function dist(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 2) return 9;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const c = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[m][n];
  }
  function buildVocab() {
    const words = new Set();
    const add = (phrase) => strip(phrase).split(/[^a-z0-9ñ]+/).forEach((w) => w.length >= 4 && words.add(w));
    Object.values(D.aliases).flat().forEach(add);
    Object.values(D.intents).flat().forEach(add);
    D.tours.forEach((t) => add(t.title));
    vocab = [...words];
  }
  // Devuelve el texto corregido y las palabras que cambió.
  // Palabras comunes que nunca se "corrigen" (si no, "como" acabaría en "coco").
  const STOP = new Set('como cuando donde quiero queremos tengo tenemos somos para pero esta este estos estas hola gracias puedo podemos hacer tiene tienen mucho mucha cual todo todos todas algo desde hasta ella ellos nuestro nuestra favor bien buenas mejor saber quisiera necesito with have what when where which there that this want would like from your much many some about could should their them they will just also does here very more'.split(' '));
  function correct(text) {
    const fixed = [];
    const out = text.trim().split(' ').map((w) => {
      if (w.length < 5 || /\d/.test(w) || STOP.has(w) || vocab.includes(w)) return w;
      // Si ya coincide como variante (plural, verbo) no se toca.
      if (vocab.some((v) => v.length >= 4 && w.startsWith(v) && w.length - v.length <= 3)) return w;
      const max = w.length >= 7 ? 2 : 1;
      let best = null, bd = 9;
      for (const v of vocab) { const k = dist(w, v); if (k < bd) { bd = k; best = v; } }
      if (best && bd <= max) { fixed.push(best); return best; }
      return w;
    });
    return { text: ' ' + out.join(' ') + ' ', fixed };
  }

  // ---------- lectura de datos en la frase ----------
  const NUM = {
    un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20, treinta: 30,
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30,
  };
  const n = (w) => (/^\d+$/.test(w) ? +w : NUM[w] || 0);
  const NW = `(\\d+|${Object.keys(NUM).join('|')})`;
  const MONTHS = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11, ene: 0, abr: 3, ago: 7, dic: 11 };
  const DAYS = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  // Hoy en Punta Cana (aunque el cliente esté en otro huso horario).
  const today = () => { const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santo_Domingo' }).format(new Date()); return new Date(p + 'T12:00:00'); };
  const iso = (d) => d.toISOString().slice(0, 10);

  function extract(q) {
    const e = {};
    let m;
    if ((m = q.match(new RegExp(` ${NW} (adultos?|adults?|mayores|grown ?ups?)`)))) e.adults = n(m[1]);
    if ((m = q.match(new RegExp(` ${NW} (ninos?|ninas?|nenes?|kids?|children|child|hijos?|hijas?|menores)`)))) e.kids = n(m[1]);
    if (!e.adults && (m = q.match(new RegExp(` ${NW} (personas?|people|persons?|pax|amigos?|amigas?|friends?|guests?|huespedes)`)))) e.adults = n(m[1]);
    if (!e.adults && (m = q.match(new RegExp(` (somos|seremos|vamos|we are|we re|were|para|for|grupo de|group of|familia de|family of) ${NW} (?!(dias|days|noches|nights|horas|hours) )`)))) e.adults = n(m[2]);
    if (!e.adults && / (pareja|mi esposa y yo|mi esposo y yo|mi novia y yo|mi novio y yo|couple|my wife and i|my husband and i|two of us|honeymoon|luna de miel) /.test(q)) e.adults = 2;
    if (!e.adults && / (solo yo|yo solo|yo sola|just me|by myself|solo traveler|viajo solo|viajo sola) /.test(q)) e.adults = 1;
    if (e.kids && e.adults && / (familia de|family of) /.test(q)) e.adults = Math.max(1, e.adults - e.kids);
    // Fecha
    const t = today();
    if (/ (pasado manana|day after tomorrow) /.test(q)) e.date = new Date(t.getTime() + 2 * 864e5);
    else if (/ (manana|tomorrow) /.test(q)) e.date = new Date(t.getTime() + 864e5);
    else if (/ (hoy|today|tonight|esta noche) /.test(q)) e.date = t;
    else if ((m = [...q.matchAll(/ (?=(\d{1,2}) (de )?([a-z]+) )/g)].find((x) => MONTHS[x[3]] !== undefined))) e.date = nextDate(+m[1], MONTHS[m[3]]);
    else if ((m = [...q.matchAll(/ (?=([a-z]+) (\d{1,2})(st|nd|rd|th)? )/g)].find((x) => MONTHS[x[1]] !== undefined))) e.date = nextDate(+m[2], MONTHS[m[1]]);
    else if ((m = q.match(/ (\d{1,2})\/(\d{1,2}) /))) e.date = lang === 'en' ? nextDate(+m[2], +m[1] - 1) : nextDate(+m[1], +m[2] - 1);
    else {
      const day = Object.keys(DAYS).find((d) => q.includes(' ' + d + ' '));
      if (day) { const diff = (DAYS[day] - t.getDay() + 7) % 7 || 7; e.date = new Date(t.getTime() + diff * 864e5); }
    }
    if (!e.date) {
      const month = Object.keys(MONTHS).find((k) => k.length > 3 && q.includes(' ' + k + ' '));
      if (month !== undefined) e.month = MONTHS[month];
    } else e.month = e.date.getMonth();
    // Presupuesto por persona
    if ((m = q.match(/ (menos de|hasta|maximo|max|presupuesto de|under|less than|below|up to|budget of) \$? ?(\d+) /)) || (m = q.match(/ \$ ?(\d+) /))) e.budget = +(m[2] || m[1]);
    // Días de viaje
    if ((m = q.match(new RegExp(` ${NW} (dias|days|noches|nights) `)))) e.days = Math.min(7, n(m[1]));
    if (/ (una semana|a week|one week) /.test(q)) e.days = 7;
    return e;
  }
  function nextDate(day, month) {
    const t = today();
    let d = new Date(t.getFullYear(), month, day, 12);
    if (d < t) d = new Date(t.getFullYear() + 1, month, day, 12);
    return d;
  }
  const fmtDate = (d) => d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtMonth = (m) => new Date(2026, m, 1).toLocaleDateString(locale, { month: 'long' });

  // ---------- precios ----------
  function quote(t, adults, kids) {
    const p = t.pricing;
    const total = adults + kids;
    if (p.type === 'person') {
      const sameKid = p.child === p.adult;
      const sum = adults * p.adult + kids * p.child;
      const who = [S.adults(adults), kids ? S.kids(kids) : ''].filter(Boolean).join(` ${S.and} `);
      const detail = sameKid || !kids ? `${total} × ${money(p.adult)}` : `${adults} × ${money(p.adult)} + ${kids} × ${money(p.child)}`;
      return { total: sum, who, detail };
    }
    if (p.type === 'tiers') {
      const tier = p.tiers.find((x) => total >= x.min && total <= x.max);
      if (!tier) return { out: [p.tiers[0].min, p.tiers.at(-1).max] };
      return { total: tier.unit === 'person' ? tier.price * total : tier.price, who: S.people(total), detail: tier.unit === 'person' ? `${total} × ${money(tier.price)}` : `${tier.min}–${tier.max} · ${S.groupPrice}` };
    }
    if (p.type === 'package') {
      const o = p.options[0];
      return { total: o.price * total, who: S.people(total), detail: S.pkgNote(o.name[lang], p.options.slice(1).map((x) => `${x.name[lang]} ${money(x.price)}`).join(', ')) };
    }
    if (p.type === 'couple') {
      const c = Math.max(1, Math.ceil(total / 2));
      return { total: p.first + (c - 1) * p.extra, who: S.couples(c), detail: c > 1 ? `${money(p.first)} + ${c - 1} × ${money(p.extra)}` : '' };
    }
    return { total: 0, who: S.people(total), detail: '' };
  }

  // ---------- pintar mensajes ----------
  function bubble(from, html, persist = true) {
    const el = document.createElement('div');
    el.className = `bot__msg bot__msg--${from}`;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    if (persist) { history.push([from, html]); save(); }
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
  const typing = () => bubble('bot', '<span class="bot__typing" aria-label="…"><i></i><i></i><i></i></span>', false);
  function reply(html, chips = []) {
    const t = typing();
    const delay = reduced ? 0 : Math.min(900, 350 + html.length * 1.5);
    setTimeout(() => { t.remove(); bubble('bot', html); setChips(chips); }, delay);
  }
  // Para respuestas que esperan datos externos (clima).
  function replyLater(promise, chips = []) {
    const t = typing();
    promise.then((html) => { t.remove(); bubble('bot', html); setChips(chips); });
  }

  // ---------- piezas ----------
  const listUrl = () => `${base}${lang === 'en' ? '' : lang + '/'}tours/`;
  const tourUrl = (t, params = '', hash = '') => `${base}${t.url}${params}${hash}`;
  const waUrl = (text) => `https://wa.me/${D.site.whatsapp}?text=${encodeURIComponent(text)}`;
  const card = (t) => `<a class="bot__card" href="${tourUrl(t)}"><img src="${base}${t.img}" alt="" loading="lazy" width="72" height="54"><span><b>${esc(t.title)}</b><small>${esc(t.price)}</small></span></a>`;
  const cards = (list) => `<div class="bot__cards">${list.map(card).join('')}</div>`;
  const tourChips = (t) => [
    { label: S.chips.book, href: tourUrl(t, '', '#book') },
    { label: S.chips.includes, say: `${S.chips.includes} ${t.title}` },
    { label: S.chips.duration, say: `${S.chips.duration} ${t.title}` },
  ];
  const humanChip = () => ({ label: S.chips.human, href: waUrl(S.handoffMsg(lastQuestion)), wa: true });
  const catChips = () => Object.entries(S.catChips).map(([k, v]) => ({ label: v, say: v, cat: k }));
  const perPersonFrom = (t) => (t.perPerson ? t.from : t.pricing.type === 'couple' ? t.pricing.first / 2 : Infinity);

  function findTours(text) {
    return D.tours.map((t) => ({ t, n: score(text, D.aliases[t.slug] || []) + (text.includes(' ' + norm(t.title).trim() + ' ') ? 5 : 0) }))
      .filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  }

  function quoteReply(t, alts = []) {
    const total = ctx.adults + ctx.kids;
    if (!total) return reply(S.askGuests(esc(t.title)), [{ label: S.adults(2), say: '2 adultos' }, { label: `${S.adults(2)} + ${S.kids(1)}`, say: '2 adultos y 1 niño' }, { label: S.people(4), say: '4 personas' }]);
    const r = quote(t, ctx.adults || total, ctx.kids);
    if (r.out) return reply(S.outOfRange(esc(t.title), r.out[0], r.out[1]), [humanChip()]);
    const when = ctx.date ? fmtDate(ctx.date) : '';
    let html = S.quote(esc(t.title), r.who, when, money(r.total), r.detail);
    if (t.seasonal && ctx.date && ctx.date.getMonth() > 2) html += `<br><br>⚠️ ${S.seasonWarn(fmtMonth(ctx.date.getMonth()))}`;
    const params = new URLSearchParams();
    if (ctx.date) params.set('date', iso(ctx.date));
    params.set('guests', String(ctx.adults || total));
    if (ctx.kids) params.set('children', String(ctx.kids));
    return reply(html + card(t), [
      { label: S.quoteBook, href: tourUrl(t, '?' + params, '#book') },
      { label: S.quoteWa, href: waUrl(S.quoteMsg(t.title, r.who, when, money(r.total))), wa: true },
      { label: S.chips.includes, say: `${S.chips.includes} ${t.title}` },
      ...alts.slice(0, 2).map((x) => ({ label: x.title, say: x.title })),
    ]);
  }

  function compareReply(a, b) {
    const R = S.compareRows;
    const row = (k, x, y) => `<tr><th>${k}</th><td>${x}</td><td>${y}</td></tr>`;
    const html = `${S.compareTitle(esc(a.title), esc(b.title))}<table class="bot__table"><tbody>
      ${row(R.price, esc(a.price), esc(b.price))}
      ${row(R.duration, a.duration, b.duration)}
      ${row(R.place, a.placeName, b.placeName)}
      ${row(R.type, a.catName, b.catName)}
      ${row(R.kids, a.kids ? S.yes : S.no, b.kids ? S.yes : S.no)}
    </tbody></table>${S.compareTip}`;
    ctx.tour = null;
    reply(html, [{ label: a.title, say: a.title }, { label: b.title, say: b.title }]);
  }

  function planReply(days) {
    const kidsMode = ctx.kids > 0;
    const order = ['saona-island', 'buggy-adventure', 'santo-domingo-colonial-city', 'samana-cayo-levantado', 'catalina-snorkel', 'hacienda-park-7-in-1', 'swim-with-dolphins', 'los-haitises'];
    let pool = order.map((s) => D.tours.find((t) => t.slug === s)).filter(Boolean);
    if (kidsMode) pool = pool.filter((t) => t.kids || t.cat === 'culture');
    if (ctx.budget) pool = pool.filter((t) => perPersonFrom(t) <= ctx.budget).concat(pool.filter((t) => perPersonFrom(t) > ctx.budget));
    const picks = pool.slice(0, days);
    const sum = picks.reduce((s, t) => s + (t.perPerson ? t.pricing.adult || t.from : 0), 0);
    const list = picks.map((t, i) => `<li><b>${S.planDay(i + 1)}:</b> <a href="${tourUrl(t)}">${esc(t.title)}</a> · ${esc(t.price.split(' · ')[0])}</li>`).join('');
    const night = !kidsMode && days >= 3 ? D.tours.find((t) => t.cat === 'night') : null;
    reply(`${S.planIntro(days)}<ol class="bot__plan">${list}${night ? `<li>🌙 <a href="${tourUrl(night)}">${esc(night.title)}</a> · ${esc(night.price.split(' · ')[0])}</li>` : ''}</ol>${S.planTotal(money(sum))} ${S.planTip}`,
      picks.slice(0, 3).map((t) => ({ label: t.title, say: t.title })));
  }

  function weatherReply() {
    const L = D.weatherLabels;
    const icon = (c) => (c <= 1 ? '☀️' : c <= 2 ? '⛅' : c <= 3 ? '☁️' : c < 50 ? '🌫️' : c < 80 ? '🌧️' : c < 95 ? '🌦️' : '⛈️');
    const label = (c) => L[[95, 80, 61, 51, 45, 3, 2, 1, 0].find((k) => c >= k)];
    replyLater(
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${D.geo.lat}&longitude=${D.geo.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,precipitation_probability_max&forecast_days=1&timezone=America%2FSanto_Domingo`)
        .then((r) => r.json())
        .then((d) => {
          const c = d.current.weather_code, t = Math.round(d.current.temperature_2m);
          return S.weatherNow(icon(c), t, Math.round(t * 9 / 5 + 32), label(c), Math.round(d.daily.temperature_2m_max[0]), d.daily.precipitation_probability_max[0] ?? 0);
        })
        .catch(() => S.weatherFail),
      D.tours.filter((t) => t.featured).slice(0, 3).map((t) => ({ label: t.title, say: t.title })),
    );
  }

  // ---------- el cerebro ----------
  function answer(raw) {
    const { text: q, fixed } = correct(norm(raw));
    const I = D.intents;
    const is = (k) => has(q, I[k]);
    const e = extract(q);
    // Actualizar el contexto con lo que el cliente acaba de decir.
    // Un grupo nuevo reemplaza al anterior: "somos 12" no arrastra el niño de la pregunta pasada.
    if (e.adults) { ctx.adults = e.adults; ctx.kids = e.kids || 0; }
    else if (e.kids !== undefined) ctx.kids = e.kids;
    if (e.date) ctx.date = e.date;
    if (e.budget) ctx.budget = e.budget;

    const chipCat = Object.entries(S.catChips).find(([, v]) => norm(v) === q)?.[0];
    const found = chipCat ? [] : findTours(q);
    const top = found.length ? found[0].n : 0;
    const tied = found.filter((x) => x.n === top).map((x) => x.t);

    if (is('human')) return reply(S.human, [{ label: S.chips.whatsapp, href: waUrl(S.handoffMsg(lastQuestion)), wa: true }]);
    if (is('whoami')) return reply(S.whoami, S.starters.slice(0, 3).map((x) => ({ label: x })));

    // Comparar dos tours: "¿Saona o Catalina?", "diferencia entre buggy y polaris".
    // El segundo tour: primero uno de otro lugar ("Saona o Catalina"), si no, de otro tipo ("buggy o polaris").
    const other = found.find((x) => x.t.place !== found[0]?.t.place) || found.find((x) => x.t.cat !== found[0]?.t.cat && x.t !== found[0]?.t) || found.find((x) => x.t !== found[0]?.t);
    const two = found.length >= 2 && other ? [found[0].t, other.t] : [];
    if (two.length === 2 && (is('compare') || / (o|or) /.test(q))) return compareReply(two[0], two[1]);

    // Plan por días: "tengo 3 días", "plan for a week".
    if (e.days && (is('plan') || !found.length)) return planReply(e.days);

    if (is('weather') && !found.length) return weatherReply();
    if (is('time') && !found.length) return reply(S.timeNow(new Date().toLocaleTimeString(locale, { timeZone: 'America/Santo_Domingo', hour: 'numeric', minute: '2-digit' })), []);

    const asksDetail = is('price') || is('includes') || is('duration') || is('book');
    const gaveData = !!(e.adults || e.kids || e.date);
    // Varios tours empatan ("Saona"): si el cliente ya pidió precio o dio su grupo, elegir el que encaja
    // (capacidad del grupo → tour destacado → precio por persona) y ofrecer los demás como botones.
    let alts = [];
    if (tied.length > 1 && (asksDetail || gaveData)) {
      const people = (ctx.adults || 0) + (ctx.kids || 0);
      const fits = (t) => !people || t.pricing.type !== 'tiers' || (people >= t.pricing.tiers[0].min && people <= t.pricing.tiers.at(-1).max);
      const ranked = tied.filter(fits).sort((a, b) => (b.featured - a.featured) || (b.perPerson - a.perPerson));
      if (ranked.length) { alts = tied.filter((x) => x !== ranked[0]); tied.splice(0, tied.length, ranked[0]); }
    }
    // Varios tours empatan y no hay más pistas: mostrar opciones con su precio.
    if (tied.length > 1) {
      ctx.tour = null;
      return reply(`${S.pickTour}${cards(tied.slice(0, 4))}`, tied.slice(0, 4).map((x) => ({ label: x.title, say: x.title })));
    }

    const t = tied[0] || ((asksDetail || gaveData) ? ctx.tour : null);
    if (t) {
      ctx.tour = t;
      const parts = [];
      if (is('includes')) parts.push(`${S.includesIntro(esc(t.title))}<ul>${t.includes.map((x) => `<li>✓ ${esc(x)}</li>`).join('')}</ul>${S.excludesIntro} ${t.excludes.map(esc).join(', ')}.`);
      if (is('duration')) parts.push(S.durationIntro(esc(t.title), t.duration, D.site.zones));
      // Cotización: si dio personas o fecha, o pidió precio/reservar con personas ya conocidas.
      if (gaveData || ((is('price') || is('book')) && (ctx.adults || ctx.kids))) {
        if (parts.length) bubble('bot', parts.join('<br><br>'));
        return quoteReply(t, alts);
      }
      if (is('book')) parts.push(`${S.bookIntro(esc(t.title))}${card(t)}`);
      if (is('price')) parts.push(S.priceIntro(esc(t.title), esc(t.price)));
      if (parts.length) return reply(parts.join('<br><br>'), tourChips(t));
      let html = `${S.summary(esc(t.title), esc(t.tagline), esc(t.price))}${card(t)}`;
      if (fixed.length) html += `<small class="bot__fix">${S.didYouMean(fixed.join(', '))}</small>`;
      return reply(html, tourChips(t));
    }

    // Datos sin tour: "somos 4 el sábado".
    if (gaveData && !asksDetail && !is('kids')) {
      const bits = [ctx.adults ? S.adults(ctx.adults) : '', ctx.kids ? S.kids(ctx.kids) : '', ctx.date ? fmtDate(ctx.date) : ''].filter(Boolean).join(', ');
      const list = D.tours.filter((x) => x.featured && (!ctx.kids || x.kids)).slice(0, 4);
      return reply(`${S.noted(bits)}${cards(list)}`, list.map((x) => ({ label: x.title, say: x.title })));
    }

    // Presupuesto: "algo de menos de $60".
    if (e.budget) {
      const ok = D.tours.filter((x) => perPersonFrom(x) <= e.budget && x.from > 0).sort((a, b) => perPersonFrom(a) - perPersonFrom(b));
      if (ok.length) return reply(`${S.budgetIntro(e.budget)}${cards(ok.slice(0, 5))}`, ok.slice(0, 3).map((x) => ({ label: x.title, say: x.title })));
      const cheapest = D.tours.filter((x) => x.perPerson && x.from > 0).sort((a, b) => a.from - b.from)[0];
      return reply(`${S.budgetNone(e.budget)}${card(cheapest)}`, [humanChip()]);
    }

    // Detalle sin decir de qué tour.
    if (is('includes') || is('duration') || is('book')) {
      const list = D.tours.filter((x) => x.featured).slice(0, 4);
      return reply(`${S.pickTour}${cards(list)}`, list.map((x) => ({ label: x.title, say: `${raw} ${x.title}` })));
    }

    if (is('reviews')) return reply(S.reviewsInfo(D.reviews), [{ label: S.reviewsChip, href: D.reviews.url, ext: true }, ...D.tours.filter((x) => x.featured).slice(0, 2).map((x) => ({ label: x.title, say: x.title }))]);

    // Preguntas frecuentes.
    for (const k of ['pickup', 'payment', 'cancel', 'bring', 'rain']) if (is(k)) return reply(esc(D.faq[k]), [{ label: S.chips.all, href: listUrl() }, humanChip()]);
    if (is('kids')) return reply(`${esc(D.faq.kids)}<br><br>${S.kidsTours}${cards(D.tours.filter((x) => x.kids).slice(0, 3))}`, catChips().slice(0, 3));
    if (is('groups')) return reply(`${esc(D.faq.groups)}<br><br>${S.groupsIntro}${cards(D.tours.filter((x) => x.cat === 'private' || /private/.test(x.slug)).slice(0, 3))}`, [humanChip()]);
    if (is('contact')) return reply(S.contactInfo(D.site), [{ label: S.chips.whatsapp, href: waUrl(S.handoffMsg('')), wa: true }]);
    if (is('hours')) return reply(S.hoursInfo(D.site), [humanChip()]);
    if (is('weather')) return weatherReply();

    // Categorías, económicos, recomendaciones.
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
      return reply(`${is('all') ? S.allIntro(D.tours.length) : S.popularIntro}${cards(D.tours.filter((x) => x.featured).slice(0, 4))}`, [{ label: S.chips.all, href: listUrl() }]);
    }

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
      const c = saved.ctx || {};
      ctx = { ...ctx, ...c, tour: c.tour ? D.tours.find((t) => t.slug === c.tour) || null : null, date: c.date ? new Date(c.date) : null };
      for (const [from, html] of history) bubble(from, html, false);
      reply(S.helloBack, S.starters.map((x) => ({ label: x })));
    } else {
      history = [];
      ctx = { tour: null, adults: 0, kids: 0, date: null, budget: 0 };
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
  log.addEventListener('click', (e) => { if (e.target.closest('a')) save(); });
})();
