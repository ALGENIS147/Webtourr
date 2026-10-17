// Generador del sitio: node src/build.mjs
// Lee src/data/*, escribe el sitio estático completo en docs/ (lo que publica GitHub Pages).
// Sin dependencias: solo Node y `sips` de macOS para optimizar las fotos.
import { mkdirSync, writeFileSync, copyFileSync, existsSync, rmSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './data/site.mjs';
import { tours, categories, places } from './data/tours.mjs';
import { t as T } from './data/i18n.mjs';
import { faq, legal } from './data/pages.mjs';
import { bot, aliases, intents } from './data/bot.mjs';
import { mapSvg, mapBox, project } from './map.mjs';
import { icon } from './icons.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs');
const PHOTOS = join(ROOT, 'src/photos');
const LANGS = ['en', 'es'];
const YEAR = new Date().getFullYear();

// ---------- utilidades ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => `$${n.toLocaleString('en-US')}`;
const langPrefix = (lang) => (lang === 'en' ? '' : `${lang}/`);
const pageUrl = (lang, path) => `${langPrefix(lang)}${path}`; // path: '' | 'tours/' | 'tours/x/'
const abs = (p) => `${site.domain}/${p}`;
// Ruta relativa desde la carpeta de la página actual a un archivo del sitio.
const rel = (from, to) => {
  const r = posix.relative(from.replace(/\/$/, '') || '.', to || '.');
  const out = r === '' ? './' : r;
  return to.endsWith('/') && !out.endsWith('/') ? `${out}/` : out;
};
const write = (path, html) => {
  const file = join(OUT, path.endsWith('/') || path === '' ? `${path}index.html` : path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};
const fill = (s) => s.replace('Up to 24 h', `Up to ${site.freeCancelHours} h`).replace('Hasta 24 h', `Hasta ${site.freeCancelHours} h`);

// ---------- imágenes ----------
// Anchos generados. Nunca se agranda una foto: el máximo es su tamaño original (hasta 2000 px).
const WIDTHS = [480, 800, 1200, 1600, 2000];
// Calidad JPEG (0–100): la portada y la foto principal de cada tour van casi sin pérdida.
const Q = { hero: 76, cover: 62, normal: 55 }; // escala de sips: 50 ≈ calidad "normal", ya se ve nítido
const imgCache = new Map();
function dims(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString();
  return { w: +out.match(/pixelWidth: (\d+)/)[1], h: +out.match(/pixelHeight: (\d+)/)[1] };
}
// Devuelve { name, w, h, widths } y genera docs/img/name-W.jpg para cada ancho.
// Mejora automática (src/tools/enhance.swift): auto-mejorar, nitidez y agrandado de fotos pequeñas.
// El resultado se guarda en .cache/enhanced y solo se recalcula si cambia la foto original.
const CACHE = join(ROOT, '.cache');
function enhanced(file) {
  const orig = join(PHOTOS, file);
  if (!existsSync(orig)) throw new Error(`Falta la foto ${file}`);
  const bin = join(CACHE, 'enhance');
  const tool = join(ROOT, 'src/tools/enhance.swift');
  if (!existsSync(bin) || statSync(bin).mtimeMs < statSync(tool).mtimeMs) {
    mkdirSync(CACHE, { recursive: true });
    execFileSync('swiftc', ['-O', tool, '-o', bin], { stdio: 'ignore' });
  }
  const out = join(CACHE, 'enhanced', `${file.replace(/\.[^.]+$/, '')}.jpg`);
  if (!existsSync(out) || statSync(out).mtimeMs < Math.max(statSync(orig).mtimeMs, statSync(bin).mtimeMs)) {
    mkdirSync(dirname(out), { recursive: true });
    execFileSync(bin, [orig, out], { stdio: 'ignore' });
  }
  return out;
}

function image(file, name, quality = Q.normal) {
  if (imgCache.has(name)) return imgCache.get(name);
  const src = enhanced(file);
  const { w, h } = dims(src);
  const max = Math.min(w, WIDTHS.at(-1));
  const uniq = [...new Set([...WIDTHS.filter((x) => x < max), max])];
  mkdirSync(join(OUT, 'img'), { recursive: true });
  for (const width of uniq) {
    const dest = join(OUT, 'img', `${name}-${width}.jpg`);
    if (existsSync(dest) && statSync(dest).mtimeMs > statSync(src).mtimeMs) continue;
    const args = ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality)];
    if (width < w) args.push('--resampleWidth', String(width));
    execFileSync('sips', [...args, src, '--out', dest], { stdio: 'ignore' });
  }
  // Vista previa diminuta (24 px) embebida en la página: se ve difuminada mientras carga la foto real.
  const tiny = join(OUT, 'img', `${name}-lqip.jpg`);
  if (!existsSync(tiny) || statSync(tiny).mtimeMs < statSync(src).mtimeMs) {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '40', '--resampleWidth', '24', src, '--out', tiny], { stdio: 'ignore' });
  }
  const lqip = `data:image/jpeg;base64,${readFileSync(tiny).toString('base64')}`;
  const info = { name, w, h, widths: uniq, lqip };
  imgCache.set(name, info);
  return info;
}
function picture(from, info, alt, { sizes = '100vw', eager = false, cls = '', vt = '' } = {}) {
  const set = info.widths.map((w) => `${rel(from, `img/${info.name}-${w}.jpg`)} ${w}w`).join(', ');
  const mid = eager ? info.widths.at(-1) : info.widths.find((w) => w >= 1200) ?? info.widths.at(-1);
  return `<img class="lq${cls ? ` ${cls}` : ''}" src="${rel(from, `img/${info.name}-${mid}.jpg`)}" srcset="${set}" sizes="${sizes}" width="${info.w}" height="${info.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="background-image:url(${info.lqip})${vt ? `;view-transition-name:${vt}` : ''}">`;
}
const tourImages = (tour) => tour.photos.map((p, i) => ({ ...image(p.file, `${tour.slug}-${i + 1}`, i === 0 ? Q.cover : Q.normal), alt: p.alt }));

// ---------- precios ----------
function fromPrice(tour) {
  const p = tour.pricing;
  if (p.type === 'person') return { value: p.adult, unit: 'perPerson' };
  if (p.type === 'package') return { value: Math.min(...p.options.map((o) => o.price)), unit: 'perPerson' };
  if (p.type === 'couple') return { value: p.first, unit: 'perCouple' };
  if (p.type === 'free') return { value: 0, unit: 'free' };
  const tier = p.tiers[0];
  return { value: tier.price, unit: tier.unit === 'person' ? 'perPerson' : 'perGroup' };
}
function priceTag(tour, lang) {
  const L = T[lang];
  const f = fromPrice(tour);
  if (f.unit === 'free') return `<span class="price"><strong>${L.free}</strong><small>${L.freeWith}</small></span>`;
  return `<span class="price"><small>${L.from}</small><strong>${money(f.value)}</strong><small>${L[f.unit]}</small></span>`;
}

// ---------- piezas comunes ----------
const logo = (from, lang) => `
<a class="brand" href="${rel(from, langPrefix(lang) || './')}" aria-label="Harmony Excursions — ${lang === 'es' ? 'inicio' : 'home'}">
  <svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="21" r="12" fill="var(--sun)"/><path d="M4 30c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3v4c-5 0-5-3-10-3s-5 3-10 3-5-3-10-3-5 3-10 3z" fill="var(--lagoon)"/><path d="M4 38c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3v4c-5 0-5-3-10-3s-5 3-10 3-5-3-10-3-5 3-10 3z" fill="var(--sea)"/></svg>
  <span class="brand__word"><span class="brand__name">Harmony</span><span class="brand__sub">Excursions</span></span>
</a>`;

// Bandera dominicana (versión sin escudo) para detalles de marca.
const flag = (cls = '') => `<svg class="flag ${cls}" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="13" height="8" fill="#002d62"/><rect x="17" width="13" height="8" fill="#ce1126"/><rect y="12" width="13" height="8" fill="#ce1126"/><rect x="17" y="12" width="13" height="8" fill="#002d62"/></svg>`;


// Calificación visual: 5 círculos rellenos según la nota (4.8 → 4 llenos y uno al 80 %).
function ratingDots(r) {
  return `<span class="dots" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<i style="--f:${Math.round(Math.max(0, Math.min(1, r - i)) * 100)}%"></i>`).join('')}</span>`;
}
const fmtRating = (r, lang) => (lang === 'es' ? String(r).replace('.', ',') : String(r));

function waLink(text) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

function head({ lang, path, from, title, desc, image: og, jsonld = [] }) {
  const alt = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(pageUrl(l, path))}">`).join('\n  ');
  const ogImg = og ? abs(og) : abs('img/og-default.jpg');
  return `<!doctype html>
<html lang="${lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${abs(pageUrl(lang, path))}">
  ${alt}
  <link rel="alternate" hreflang="x-default" href="${abs(pageUrl('en', path))}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${abs(pageUrl(lang, path))}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_DO'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0b2a33">
  <link rel="icon" href="${rel(from, 'favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${rel(from, 'img/apple-touch-icon.png')}">
  <link rel="manifest" href="${rel(from, 'site.webmanifest')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="${rel(from, 'css/site.css')}">
  <script src="${rel(from, 'js/site.js')}" defer></script>
  <script src="${rel(from, 'js/bot.js')}" defer></script>
  ${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n  ')}
</head>`;
}

function header({ lang, path, from, current }) {
  const L = T[lang];
  const other = lang === 'en' ? 'es' : 'en';
  const nav = [
    ['tours', 'tours/'],
    ['map', '#destinations'],
    ['about', 'about/'],
    ['faq', 'faq/'],
    ['contact', 'contact/'],
  ];
  const link = ([key, p]) => {
    const href = p.startsWith('#') ? `${rel(from, langPrefix(lang) || './')}${p}` : rel(from, pageUrl(lang, p));
    return `<li><a href="${href}"${current === key ? ' aria-current="page"' : ''}>${L.nav[key]}</a></li>`;
  };
  return `
<a class="skip" href="#main">${L.skip}</a>
<header class="site-header" data-header>
  <div class="wrap site-header__in">
    ${logo(from, lang)}
    <nav class="nav" id="nav" aria-label="${lang === 'en' ? 'Main' : 'Principal'}">
      <ul>${nav.map(link).join('')}</ul>
      <div class="nav__extra">
        <a class="lang" href="${rel(from, pageUrl(other, path))}" hreflang="${other}" lang="${other}">${icon('globe')}<span>${T[other].langName}</span></a>
        <a class="btn btn--wa" href="${waLink(lang === 'en' ? 'Hello! I would like information about your excursions.' : '¡Hola! Quiero información sobre sus excursiones.')}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${L.bookWhatsApp}</span></a>
      </div>
    </nav>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" data-menu>
      <span class="menu-btn__bars" aria-hidden="true"></span><span class="sr-only">${L.menu}</span>
    </button>
  </div>
</header>`;
}

function footer({ lang, from }) {
  const L = T[lang];
  const F = L.footer;
  const catLinks = Object.entries(categories)
    .map(([k, v]) => `<li><a href="${rel(from, pageUrl(lang, 'tours/'))}?cat=${k}">${v[lang]}</a></li>`)
    .join('');
  const social = Object.entries(site.social).filter(([, v]) => v);
  return `
<footer class="site-footer">
  <div class="tricolor" aria-hidden="true"></div>
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      ${logo(from, lang)}
      <p>${F.blurb}</p>
      ${social.length ? `<ul class="social">${social.map(([k, v]) => `<li><a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${k}">${icon(k)}</a></li>`).join('')}</ul>` : ''}
    </div>
    <div><h2 class="site-footer__h">${F.explore}</h2><ul>${catLinks}</ul></div>
    <div><h2 class="site-footer__h">${F.company}</h2><ul>
      <li><a href="${rel(from, pageUrl(lang, 'about/'))}">${L.nav.about}</a></li>
      <li><a href="${rel(from, pageUrl(lang, 'faq/'))}">${L.nav.faq}</a></li>
      <li><a href="${rel(from, pageUrl(lang, 'contact/'))}">${L.nav.contact}</a></li>
    </ul>
    <h2 class="site-footer__h">${F.legal}</h2><ul>
      ${Object.keys(legal).map((k) => `<li><a href="${rel(from, pageUrl(lang, `legal/${k}/`))}">${legal[k][lang][0]}</a></li>`).join('')}
    </ul></div>
    <div><h2 class="site-footer__h">${F.contact}</h2>
      <ul class="contact-list">
        <li>${icon('whatsapp')}<a href="${waLink('')}" target="_blank" rel="noopener">${site.phone}</a></li>
        <li>${icon('mail')}<a href="mailto:${site.email}">${site.email}</a></li>
        <li>${icon('clock')}<span>${site.hours[lang]}</span></li>
        <li>${icon('pin')}<span>${site.base[lang]}</span></li>
      </ul>
    </div>
  </div>
  <div class="wrap site-footer__base">
    <p>© ${YEAR} ${site.name}. ${F.rights}</p>
    <p class="made-in">${flag()}${F.madeIn}</p>
    <p>${F.prices}</p>
  </div>
</footer>
<div class="bot" data-bot data-wa="${site.whatsapp}" data-root="${rel(from, 'index.html').replace(/index\.html$/, '')}" data-lang="${lang}">
  <button class="bot__launcher" type="button" aria-expanded="false" aria-controls="bot-panel" data-bot-toggle>
    <span class="bot__avatar" aria-hidden="true"></span><span class="bot__launch-txt">${bot[lang].open}</span>
  </button>
  <section class="bot__panel" id="bot-panel" role="dialog" aria-modal="false" aria-labelledby="bot-title" hidden>
    <header class="bot__head">
      <span class="bot__avatar bot__avatar--lg" aria-hidden="true"></span>
      <div><h2 class="bot__title" id="bot-title">${bot[lang].name}</h2><p class="bot__role"><span class="bot__dot" aria-hidden="true"></span>${bot[lang].role}</p></div>
      <button class="bot__icon" type="button" data-bot-restart aria-label="${bot[lang].restart}" title="${bot[lang].restart}">${icon('refresh')}</button>
      <button class="bot__icon" type="button" data-bot-close aria-label="${bot[lang].close}">${icon('x')}</button>
    </header>
    <div class="bot__log" role="log" aria-live="polite" data-bot-log></div>
    <div class="bot__chips" data-bot-chips></div>
    <form class="bot__form" data-bot-form>
      <label class="sr-only" for="bot-input">${bot[lang].placeholder}</label>
      <input id="bot-input" name="q" autocomplete="off" maxlength="300" placeholder="${bot[lang].placeholder}" enterkeyhint="send">
      <button type="submit" aria-label="${bot[lang].send}">${icon('send')}</button>
    </form>
    <p class="bot__fine">${bot[lang].disclaimer}</p>
  </section>
</div>
</body>
</html>`;
}

function layout(opts, main) {
  return `${head(opts)}
<body class="${opts.bodyClass || ''}">
${header(opts)}
<main id="main">
${main}
</main>
${footer(opts)}`;
}

// ---------- tarjetas ----------
function card(tour, lang, from, { big = false } = {}) {
  const img = tourImages(tour)[0];
  const href = rel(from, pageUrl(lang, `tours/${tour.slug}/`));
  const f = fromPrice(tour);
  return `
<article class="card${big ? ' card--big' : ''}" data-reveal data-cat="${tour.cat}" data-price="${f.value}" data-search="${esc(`${tour.title.en} ${tour.title.es} ${tour.tagline[lang]} ${places[tour.place].name}`.toLowerCase())}">
  <a class="card__link" href="${href}">
    <div class="card__media">${picture(from, img, img.alt[lang], { vt: `t-${tour.slug}`, sizes: big ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw' })}
      <span class="chip chip--glass">${categories[tour.cat][lang]}</span>
    </div>
    <div class="card__body">
      <p class="card__meta">${icon('pin')}${places[tour.place].name}<span aria-hidden="true">·</span>${icon('clock')}${tour.duration[lang]}</p>
      <h3 class="card__title">${esc(tour.title[lang])}</h3>
      <p class="card__tag">${esc(tour.tagline[lang])}</p>
      <div class="card__foot">${priceTag(tour, lang)}<span class="card__go" aria-hidden="true">${icon('arrow')}</span></div>
    </div>
  </a>
</article>`;
}

// ---------- mapa ----------
function mapSection(lang, from) {
  const L = T[lang].home;
  const pins = Object.entries(places).map(([id, p]) => {
    const [x, y] = project(p.lon, p.lat);
    const list = tours.filter((tr) => tr.place === id);
    if (!list.length) return '';
    return `
    <li class="pin${id === 'punta-cana' ? ' pin--base' : ''}${p.side === 'left' ? ' pin--left' : ''}${x / mapBox.w > 0.6 ? ' pin--east' : ''}" style="--x:${((x / mapBox.w) * 100).toFixed(2)}%;--y:${((y / mapBox.h) * 100).toFixed(2)}%">
      <button class="pin__btn" type="button" aria-expanded="false" aria-controls="pin-${id}" data-pin>
        <span class="pin__dot" aria-hidden="true"></span><span class="pin__name">${p.name}</span><span class="pin__count">${list.length}</span>
      </button>
      <div class="pin__card" id="pin-${id}" hidden>
        <p class="pin__h">${L.mapToursHere}</p>
        <ul>${list.map((tr) => `<li><a href="${rel(from, pageUrl(lang, `tours/${tr.slug}/`))}">${esc(tr.title[lang])}</a></li>`).join('')}</ul>
      </div>
    </li>`;
  });
  return `
<section class="section map-sec" id="destinations" aria-labelledby="map-title">
  <div class="wrap map-sec__grid">
    <div class="map-sec__text" data-reveal>
      <p class="kicker">${L.mapKicker}</p>
      <h2 class="h2" id="map-title">${L.mapTitle}</h2>
      <p class="lead">${L.mapLead}</p>
      <p class="coords" aria-hidden="true">18.58° N · 68.37° W</p>
    </div>
    <div class="map" data-reveal>
      ${mapSvg(Object.entries(places).filter(([id]) => tours.some((tr) => tr.place === id)).map(([id, p]) => ({ id, ...p })))}
      <ul class="map__pins">${pins.join('')}</ul>
    </div>
  </div>
</section>`;
}

// ---------- páginas ----------
function homePage(lang) {
  const L = T[lang];
  const H = L.home;
  const path = '';
  const from = pageUrl(lang, path);
  const hero = image('Isla-Catalina2.jpg', 'hero-catalina', Q.hero);
  const featured = tours.filter((tr) => tr.featured).slice(0, 5); // 1 grande + 4: llena la cuadrícula
  const catTiles = Object.entries(categories).map(([k, v]) => {
    const list = tours.filter((tr) => tr.cat === k);
    const img = tourImages(list[0])[0];
    return `<li data-reveal><a class="tile" href="${rel(from, pageUrl(lang, 'tours/'))}?cat=${k}">
      ${picture(from, img, '', { sizes: '(min-width: 900px) 33vw, 50vw' })}
      <span class="tile__txt"><span class="tile__name">${v[lang]}</span><span class="tile__n">${L.toursCount(list.length)}</span></span></a></li>`;
  });
  const options = Object.entries(categories)
    .map(([k, v]) => `<optgroup label="${esc(v[lang])}">${tours.filter((tr) => tr.cat === k).map((tr) => `<option value="${tr.slug}">${esc(tr.title[lang])}</option>`).join('')}</optgroup>`)
    .join('');
  const faqItems = faq[lang].slice(0, 4);
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: site.name,
      url: site.domain,
      telephone: site.phone,
      email: site.email,
      image: abs('img/og-default.jpg'),
      logo: abs('favicon.svg'),
      address: { '@type': 'PostalAddress', addressLocality: 'Punta Cana', addressRegion: 'La Altagracia', addressCountry: 'DO' },
      areaServed: 'Dominican Republic',
      currenciesAccepted: 'USD',
      sameAs: Object.values(site.social).filter(Boolean),
    },
  ];
  const main = `
<section class="hero">
  <div class="hero__media">${picture(from, hero, '', { eager: true })}</div>
  <div class="wrap hero__in">
    <div class="hero__copy">
      <p class="eyebrow">${flag()}${H.eyebrow}</p>
      <h1 class="display">${H.h1}</h1>
      <p class="hero__lead">${H.lead}</p>
      <a class="ta-badge" href="${site.tripadvisor.url}" target="_blank" rel="noopener">${ratingDots(site.tripadvisor.rating)}<span>${H.reviewsBadge(fmtRating(site.tripadvisor.rating, lang), site.tripadvisor.count)}</span></a>
      <p class="localtime" data-clock data-lang="${lang === 'es' ? 'es-DO' : 'en-US'}" hidden>${icon('sun')}<span>${H.localTime}</span><strong data-clock-time></strong><span class="localtime__wx" data-wx data-labels="${esc(JSON.stringify(H.weather))}" data-lat="${places['punta-cana'].lat}" data-lon="${places['punta-cana'].lon}"></span></p>
    </div>
    <form class="finder" action="${rel(from, pageUrl(lang, 'tours/'))}" data-finder data-base="${rel(from, pageUrl(lang, 'tours/'))}">
      <p class="finder__title">${H.finder.title}</p>
      <label class="field"><span>${H.finder.tour}</span>
        <select name="tour" required><option value="">${H.finder.choose}</option>${options}</select></label>
      <div class="finder__row">
        <label class="field"><span>${H.finder.date}</span><input type="date" name="date" data-mindate></label>
        <label class="field"><span>${H.finder.guests}</span><input type="number" name="guests" min="1" max="45" value="2" inputmode="numeric"></label>
      </div>
      <button class="btn btn--coral btn--block" type="submit">${H.finder.go}${icon('arrow')}</button>
    </form>
  </div>
  <svg class="hero__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 48c120-22 240-34 360-24s240 40 360 40 240-30 360-40 240 2 360 24v32H0z"/></svg>
</section>

<section class="trust" aria-label="${lang === 'en' ? 'Why book with us' : 'Por qué reservar con nosotros'}">
  <ul class="wrap trust__list">${H.trust.map(([ic, a, b]) => `<li>${icon(ic)}<span><strong>${fill(a)}</strong><small>${fill(b)}</small></span></li>`).join('')}</ul>
</section>

<section class="section" aria-labelledby="feat-title">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <div><p class="kicker">${H.featuredKicker}</p><h2 class="h2" id="feat-title">${H.featuredTitle}</h2></div>
      <a class="link-arrow" href="${rel(from, pageUrl(lang, 'tours/'))}">${H.featuredLink}${icon('arrow')}</a>
    </div>
    <div class="bento">${featured.map((tr, i) => card(tr, lang, from, { big: i === 0 })).join('')}</div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track">${Array(2).fill(Object.values(places).map((p) => `<span>${p.name}</span><span class="marquee__dot">✦</span>`).join('')).join('')}</div></div>

<section class="section" aria-labelledby="cats-title">
  <div class="wrap">
    <div class="sec-head" data-reveal><div><p class="kicker">${H.catsKicker}</p><h2 class="h2" id="cats-title">${H.catsTitle}</h2></div></div>
    <ul class="tiles">${catTiles.join('')}</ul>
  </div>
</section>

<section class="section sabor" aria-labelledby="sabor-title">
  <div class="wrap">
    <div class="sec-head" data-reveal><div><p class="kicker">${H.saborKicker}</p><h2 class="h2" id="sabor-title">${H.saborTitle}</h2></div><p class="lead sabor__lead">${H.saborLead}</p></div>
    <ul class="sabor__grid">${H.sabor.map(([word, label, text, tone, slug], i) => {
      const tr = tours.find((x) => x.slug === slug);
      return `<li class="sabor__item sabor__item--${tone}" data-reveal style="--d:${(i % 3) * 80}ms">
        <p class="sabor__label">${label}</p>
        <h3 class="sabor__word">${word}</h3>
        <p class="sabor__text">${text}</p>
        ${tr ? `<a class="sabor__link" href="${rel(from, pageUrl(lang, `tours/${tr.slug}/`))}">${esc(tr.title[lang])}${icon('arrow')}</a>` : ''}
      </li>`;
    }).join('')}</ul>
  </div>
</section>

${mapSection(lang, from)}

<section class="section how" aria-labelledby="how-title">
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal><div><p class="kicker">${H.howKicker}</p><h2 class="h2" id="how-title">${H.howTitle}</h2></div></div>
    <ol class="steps">${H.how.map(([a, b], i) => `<li data-reveal style="--d:${i * 90}ms"><span class="steps__n">0${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="slang" aria-labelledby="slang-title">
  <div class="tricolor" aria-hidden="true"></div>
  <div class="wrap">
    <div class="sec-head" data-reveal><div><p class="kicker kicker--light">${H.slangKicker}</p><h2 class="h2" id="slang-title">${H.slangTitle}</h2></div>${flag('flag--lg')}</div>
    <dl class="slang__list">${H.slang.map(([w, m], i) => `<div data-reveal style="--d:${(i % 5) * 60}ms"><dt lang="es">${w}</dt><dd>${m}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="groups" aria-labelledby="groups-title">
  <div class="groups__media">${picture(from, tourImages(tours.find((x) => x.slug === 'saona-private-party-boat'))[0], '', { sizes: '100vw' })}</div>
  <div class="wrap groups__in" data-reveal>
    <p class="kicker kicker--light">${H.groupsKicker}</p>
    <h2 class="h2" id="groups-title">${H.groupsTitle}</h2>
    <p class="lead">${H.groupsLead}</p>
    <a class="btn btn--sand" href="${rel(from, pageUrl(lang, 'tours/'))}?cat=private">${H.groupsCta}${icon('arrow')}</a>
  </div>
</section>

<section class="section reviews" aria-labelledby="reviews-title">
  <div class="wrap reviews__grid">
    <div data-reveal>
      <p class="kicker">${H.reviewsKicker}</p>
      <h2 class="h2" id="reviews-title">${H.reviewsTitle}</h2>
      <p class="lead">${H.reviewsLead(site.tripadvisor.count)}</p>
      <div class="reviews__actions">
        <a class="btn btn--coral" href="${site.tripadvisor.url}" target="_blank" rel="noopener">${H.reviewsRead}${icon('arrow')}</a>
        <a class="link-arrow" href="${site.tripadvisor.url}" target="_blank" rel="noopener">${H.reviewsWrite}${icon('arrow')}</a>
      </div>
    </div>
    <a class="score" href="${site.tripadvisor.url}" target="_blank" rel="noopener" data-reveal>
      <span class="score__brand">${icon('tripadvisor')}TripAdvisor</span>
      <span class="score__num">${fmtRating(site.tripadvisor.rating, lang)}<small>${H.reviewsOutOf}</small></span>
      ${ratingDots(site.tripadvisor.rating)}
      <span class="score__count">${H.reviewsCount(site.tripadvisor.count)}</span>
      <span class="score__rank">${site.tripadvisor.rank[lang]}</span>
    </a>
    ${site.tripadvisor.widget ? `<div class="reviews__widget">${site.tripadvisor.widget}</div>` : ''}
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="wrap faq-teaser">
    <div data-reveal><p class="kicker">${H.faqKicker}</p><h2 class="h2" id="faq-title">${H.faqTitle}</h2>
      <a class="link-arrow" href="${rel(from, pageUrl(lang, 'faq/'))}">${H.faqAll}${icon('arrow')}</a></div>
    <div class="accordion" data-reveal>${faqItems.map(([q, a]) => `<details><summary>${esc(q)}${icon('plus')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

${ctaBand(lang)}`;
  return layout({ lang, path, from, title: H.title, desc: H.desc, jsonld, current: 'home', bodyClass: 'is-home' }, main);
}

function ctaBand(lang) {
  const H = T[lang].home;
  return `
<section class="cta-band">
  <div class="wrap cta-band__in" data-reveal>
    <h2 class="display display--sm">${H.ctaTitle}</h2>
    <p>${H.ctaLead}</p>
    <a class="btn btn--wa btn--lg" href="${waLink(lang === 'en' ? 'Hello! I would like help choosing an excursion.' : '¡Hola! Quiero ayuda para elegir una excursión.')}" target="_blank" rel="noopener">${icon('whatsapp')}${T[lang].bookWhatsApp}</a>
  </div>
</section>`;
}

function pageHead(kicker, h1, lead) {
  return `<header class="page-head"><div class="wrap"><p class="kicker">${kicker}</p><h1 class="display display--md">${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div></header>`;
}

function toursPage(lang) {
  const L = T[lang];
  const P = L.tours;
  const path = 'tours/';
  const from = pageUrl(lang, path);
  const chips = [['all', P.all], ...Object.entries(categories).map(([k, v]) => [k, v[lang]])]
    .map(([k, v], i) => `<button type="button" class="filter" data-filter="${k}" aria-pressed="${i === 0}">${v}</button>`)
    .join('');
  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tours.map((tr, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(pageUrl(lang, `tours/${tr.slug}/`)), name: tr.title[lang] })),
  }];
  const main = `
${pageHead(P.kicker, P.h1, P.lead)}
<section class="section section--tight">
  <div class="wrap">
    <div class="toolbar" data-catalog-tools>
      <div class="filters" role="group" aria-label="${lang === 'en' ? 'Filter by category' : 'Filtrar por categoría'}">${chips}</div>
      <div class="toolbar__right">
        <label class="search">${icon('search')}<span class="sr-only">${P.search}</span><input type="search" placeholder="${P.searchPh}" data-search></label>
        <label class="sort"><span class="sr-only">${P.sort}</span><select data-sort>
          <option value="featured">${P.sortFeatured}</option><option value="low">${P.sortLow}</option><option value="high">${P.sortHigh}</option></select></label>
      </div>
    </div>
    <p class="result-count" aria-live="polite" data-count data-template="${esc(P.showing(0)).replace('0', '{n}')}" data-template-one="${esc(P.showing(1)).replace('1', '{n}')}">${P.showing(tours.length)}</p>
    <div class="grid" data-catalog>${tours.map((tr) => card(tr, lang, from)).join('')}</div>
    <p class="empty" data-empty hidden>${P.empty}</p>
  </div>
</section>
${ctaBand(lang)}`;
  return layout({ lang, path, from, title: P.title, desc: P.desc, jsonld, current: 'tours' }, main);
}

function bookingWidget(tour, lang) {
  const L = T[lang];
  const B = L.book;
  const p = tour.pricing;
  const stepper = (name, label, min, max, value, hint = '') => `
    <div class="stepper" data-stepper>
      <span class="stepper__label" id="lbl-${name}">${label}${hint ? `<small>${hint}</small>` : ''}</span>
      <div class="stepper__ctl">
        <button type="button" data-step="-1" aria-label="${B.decrease}: ${label}">−</button>
        <input type="number" name="${name}" value="${value}" min="${min}" max="${max}" inputmode="numeric" aria-labelledby="lbl-${name}">
        <button type="button" data-step="1" aria-label="${B.increase}: ${label}">+</button>
      </div>
    </div>`;
  let fields = '';
  if (p.type === 'person') {
    fields = stepper('adults', B.adults, 1, 40, 2) + (p.child !== p.adult ? stepper('children', B.children, 0, 20, 0, B.childAges(site.childAges)) : '');
  } else if (p.type === 'tiers') {
    const min = p.tiers[0].min;
    const max = p.tiers.at(-1).max;
    fields = stepper('guests', B.guests, min, max, Math.max(min, Math.min(2, max))) + `<p class="tier-note" data-tier-note></p>`;
  } else if (p.type === 'package') {
    fields = `<fieldset class="pkgs"><legend>${B.package}</legend>${p.options.map((o, i) => `
      <label class="pkg"><input type="radio" name="package" value="${o.id}" ${i === 0 ? 'checked' : ''}>
        <span class="pkg__box"><span class="pkg__top"><strong>${esc(o.name[lang])}</strong><span>${money(o.price)}</span></span><small>${esc(o.desc[lang])}</small></span></label>`).join('')}</fieldset>`
      + stepper('guests', B.guests, 1, 30, 2);
  } else if (p.type === 'couple') {
    fields = stepper('couples', B.couples, 1, 10, 1);
  }
  const data = {
    title: tour.title[lang],
    pricing: p,
    phone: site.whatsapp,
    email: site.email,
    lang,
    i18n: {
      ...B,
      childAges: undefined, group: undefined, msgIntro: B.msgIntro(tour.title[lang]), emailSubject: B.emailSubject(tour.title[lang], '{ref}'),
      perGroup: L.perGroup, perPerson: L.perPerson, adults: B.adults, children: B.children, guests: B.guests, couples: B.couples,
      tierLabels: p.type === 'tiers' ? p.tiers.map((x) => `${B.group(x.min, x.max)} · ${money(x.price)} ${x.unit === 'person' ? L.perPerson : L.perGroup}`) : [],
    },
  };
  if (p.type === 'free') {
    return `<aside class="book" id="book" aria-labelledby="book-title">
      <div class="book__card"><h2 class="book__title" id="book-title">${L.free}</h2><p class="book__sub">${L.freeWith}</p>
      <a class="btn btn--wa btn--block" href="${waLink(B.msgIntro(tour.title[lang]))}" target="_blank" rel="noopener">${icon('whatsapp')}${B.freeCta}</a></div></aside>`;
  }
  return `
<aside class="book" id="book" aria-labelledby="book-title">
  <form class="book__card" data-booking novalidate>
    <div class="book__head">
      <h2 class="book__title" id="book-title">${B.title}</h2>
      ${priceTag(tour, lang)}
    </div>
    <label class="field"><span>${B.date}</span><input type="date" name="date" required data-mindate aria-describedby="date-err"></label>
    <p class="field-err" id="date-err" hidden>${B.needDate}</p>
    ${fields}
    <div class="book__more">
      <label class="field"><span>${B.name} <small>(${B.optional})</small></span><input type="text" name="name" autocomplete="name"></label>
      <label class="field"><span>${B.hotel} <small>(${B.optional})</small></span><input type="text" name="hotel"></label>
    </div>
    <div class="book__total" aria-live="polite">
      <span>${B.total}</span><strong data-total>—</strong>
    </div>
    <p class="book__breakdown" data-breakdown></p>
    <button class="btn btn--wa btn--block" type="submit" data-via="wa">${icon('whatsapp')}${B.viaWhatsApp}</button>
    <button class="btn btn--ghost btn--block" type="submit" data-via="mail">${icon('mail')}${B.viaEmail}</button>
    <p class="book__fine">${icon('shield')}${B.noPayment}</p>
    <a class="book__ta" href="${site.tripadvisor.url}" target="_blank" rel="noopener">${ratingDots(site.tripadvisor.rating)}<span>${T[lang].home.reviewsBadge(fmtRating(site.tripadvisor.rating, lang), site.tripadvisor.count)}</span></a>
    <script type="application/json" data-booking-config>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
  </form>
</aside>`;
}

function tourPage(tour, lang) {
  const L = T[lang];
  const R = L.tour;
  const path = `tours/${tour.slug}/`;
  const from = pageUrl(lang, path);
  const imgs = tourImages(tour);
  const f = fromPrice(tour);
  const related = tours.filter((x) => x.slug !== tour.slug && (x.cat === tour.cat || x.place === tour.place)).slice(0, 3);
  const offers = (() => {
    const p = tour.pricing;
    if (p.type === 'free') return { '@type': 'Offer', price: 0, priceCurrency: 'USD' };
    const prices = p.type === 'person' ? [p.adult, p.child] : p.type === 'package' ? p.options.map((o) => o.price) : p.type === 'couple' ? [p.first] : p.tiers.map((x) => x.price);
    return { '@type': 'AggregateOffer', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: abs(pageUrl(lang, path)) };
  })();
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': ['Product', 'TouristTrip'],
      name: tour.title[lang],
      description: tour.tagline[lang],
      image: imgs.map((i) => abs(`img/${i.name}-${i.widths.at(-1)}.jpg`)),
      brand: { '@type': 'Brand', name: site.name },
      touristType: categories[tour.cat][lang],
      offers,
      provider: { '@type': 'TravelAgency', name: site.name, url: site.domain },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: site.name, item: abs(pageUrl(lang, '')) },
        { '@type': 'ListItem', position: 2, name: L.nav.tours, item: abs(pageUrl(lang, 'tours/')) },
        { '@type': 'ListItem', position: 3, name: tour.title[lang], item: abs(pageUrl(lang, path)) },
      ],
    },
  ];
  const gallery = `
<div class="gallery gallery--${Math.min(imgs.length, 4)}" data-gallery>
  ${imgs.slice(0, 4).map((im, i) => `<button type="button" class="gallery__item" data-index="${i}" aria-label="${R.gallery} — ${R.photo(i + 1, imgs.length)}">${picture(from, im, im.alt[lang], { eager: i === 0, vt: i === 0 ? `t-${tour.slug}` : '', sizes: i === 0 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 20vw, 33vw' })}</button>`).join('')}
  <template data-gallery-src>${JSON.stringify(imgs.map((im) => ({ src: rel(from, `img/${im.name}-${im.widths.at(-1)}.jpg`), alt: im.alt[lang] })))}</template>
</div>`;
  const list = (items, cls) => `<ul class="${cls}">${items.map((x) => `<li>${icon(cls === 'ticks' ? 'check' : cls === 'crosses' ? 'x' : 'star')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const main = `
<div class="progress" aria-hidden="true"></div>
<div class="wrap tour">
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="${rel(from, langPrefix(lang) || './')}">${lang === 'en' ? 'Home' : 'Inicio'}</a></li>
    <li><a href="${rel(from, pageUrl(lang, 'tours/'))}">${L.nav.tours}</a></li>
    <li aria-current="page">${esc(tour.title[lang])}</li></ol></nav>
  <header class="tour__head">
    <p class="kicker">${categories[tour.cat][lang]}</p>
    <h1 class="display display--md">${esc(tour.title[lang])}</h1>
    <p class="tour__meta">
      <span>${icon('pin')}${places[tour.place].name}</span>
      <span>${icon('clock')}${tour.duration[lang]}</span>
      ${tour.pricing.type === 'tiers' ? `<span>${icon('users')}${L.book.group(tour.pricing.tiers[0].min, tour.pricing.tiers.at(-1).max)}</span>` : ''}
      <span>${icon('shield')}${R.cancellationText(site.freeCancelHours)}</span>
    </p>
  </header>
  ${gallery}
  <div class="tour__grid">
    <div class="tour__content">
      <p class="tour__tagline">${esc(tour.tagline[lang])}</p>
      <section aria-labelledby="ov"><h2 class="h3" id="ov">${R.overview}</h2>${tour.body[lang].map((p) => `<p>${esc(p)}</p>`).join('')}</section>
      ${tour.season ? `<p class="callout">${icon('sun')}<span><strong>${R.season}:</strong> ${esc(tour.season[lang])}</span></p>` : ''}
      ${tour.note ? `<p class="callout">${icon('info')}<span><strong>${R.note}:</strong> ${esc(tour.note[lang])}</span></p>` : ''}
      <section aria-labelledby="hl"><h2 class="h3" id="hl">${R.highlights}</h2>${list(tour.highlights[lang], 'stars')}</section>
      <div class="inc">
        <section aria-labelledby="inc"><h2 class="h3" id="inc">${R.included}</h2>${list(tour.includes[lang], 'ticks')}</section>
        <section aria-labelledby="exc"><h2 class="h3" id="exc">${R.notIncluded}</h2>${list(tour.excludes[lang], 'crosses')}</section>
      </div>
      <section aria-labelledby="gtk"><h2 class="h3" id="gtk">${R.goodToKnow}</h2>
        <dl class="facts">
          <div><dt>${R.duration}</dt><dd>${tour.duration[lang]}</dd></div>
          <div><dt>${R.location}</dt><dd>${places[tour.place].name}</dd></div>
          <div><dt>${R.pickup}</dt><dd>${tour.excludes.en.some((x) => /transport/i.test(x)) ? R.noPickup : site.pickupZones[lang]}</dd></div>
          <div><dt>${R.bring}</dt><dd>${R.bringByCat[tour.cat] || R.bringList}</dd></div>
          <div><dt>${R.cancellation}</dt><dd>${R.cancellationText(site.freeCancelHours)} <a href="${rel(from, pageUrl(lang, 'legal/cancellation/'))}">${legal.cancellation[lang][0]}</a></dd></div>
        </dl>
      </section>
    </div>
    ${bookingWidget(tour, lang)}
  </div>
</div>
${related.length ? `<section class="section related" aria-labelledby="rel"><div class="wrap"><h2 class="h2" id="rel">${R.related}</h2><div class="grid">${related.map((x) => card(x, lang, from)).join('')}</div></div></section>` : ''}
<div class="mbar" data-mbar>
  <div>${priceTag(tour, lang)}</div>
  <a class="btn btn--coral" href="#book">${tour.pricing.type === 'free' ? L.book.freeCta : L.book.mobileCta}</a>
</div>
<div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="${esc(tour.title[lang])}">
  <button class="lightbox__close" type="button" data-lb-close aria-label="${L.close}">${icon('x')}</button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="${R.prev}">${icon('arrow')}</button>
  <figure><img alt="" data-lb-img><figcaption data-lb-cap></figcaption></figure>
  <button class="lightbox__nav" type="button" data-lb-next aria-label="${R.next}">${icon('arrow')}</button>
</div>`;
  const ogImg = `img/${imgs[0].name}-${imgs[0].widths.find((w) => w >= 960) ?? imgs[0].widths.at(-1)}.jpg`;
  return layout({ lang, path, from, title: `${tour.title[lang]} — ${f.unit === 'free' ? L.free : `${L.from} ${money(f.value)}`} | ${site.name}`, desc: `${tour.tagline[lang]} ${tour.body[lang][0]}`.slice(0, 158).replace(/\s\S*$/, '…'), image: ogImg, jsonld, current: 'tours', bodyClass: 'is-tour' }, main);
}

function aboutPage(lang) {
  const A = T[lang].about;
  const path = 'about/';
  const from = pageUrl(lang, path);
  const pics = [tours[0], tours.find((x) => x.slug === 'higuey-private-city-tour'), tours.find((x) => x.slug === 'los-haitises')].map((x) => tourImages(x)[0]);
  const main = `
${pageHead(A.kicker, A.h1, A.lead)}
<section class="section section--tight"><div class="wrap about">
  <div class="about__pics" data-reveal>${pics.map((im, i) => `<figure class="about__pic about__pic--${i + 1}">${picture(from, im, im.alt[lang], { sizes: '(min-width: 900px) 30vw, 60vw' })}</figure>`).join('')}</div>
  <div class="about__blocks">${A.blocks.map(([h, p], i) => `<article data-reveal style="--d:${i * 80}ms"><span class="about__n">0${i + 1}</span><h2 class="h3">${h}</h2><p>${p}</p></article>`).join('')}</div>
</div></section>
<section class="section values"><div class="wrap" data-reveal><h2 class="h2">${A.valuesTitle}</h2><ul class="values__list">${A.values.map((v) => `<li>${v}</li>`).join('')}</ul></div></section>
${ctaBand(lang)}`;
  return layout({ lang, path, from, title: A.title, desc: A.desc, current: 'about' }, main);
}

function contactPage(lang) {
  const C = T[lang].contact;
  const path = 'contact/';
  const from = pageUrl(lang, path);
  const main = `
${pageHead(C.kicker, C.h1, C.lead)}
<section class="section section--tight"><div class="wrap contact">
  <ul class="contact__cards">
    <li data-reveal><a class="ccard ccard--wa" href="${waLink('')}" target="_blank" rel="noopener">${icon('whatsapp')}<span><small>${C.whatsapp}</small><strong>${site.phone}</strong></span></a></li>
    <li data-reveal><a class="ccard" href="tel:+${site.whatsapp}">${icon('phone')}<span><small>${C.phone}</small><strong>${site.phone}</strong></span></a></li>
    <li data-reveal><a class="ccard" href="mailto:${site.email}">${icon('mail')}<span><small>${C.email}</small><strong>${site.email}</strong></span></a></li>
    <li data-reveal><div class="ccard">${icon('clock')}<span><small>${C.hours}</small><strong>${site.hours[lang]}</strong></span></div></li>
    <li data-reveal><div class="ccard">${icon('pin')}<span><small>${C.base}</small><strong>${site.base[lang]}</strong></span></div></li>
  </ul>
  <form class="cform" data-contact data-phone="${site.whatsapp}" data-email="${site.email}" data-reveal>
    <h2 class="h3">${C.formTitle}</h2>
    <label class="field"><span>${C.formName}</span><input name="name" required autocomplete="name"></label>
    <label class="field"><span>${C.formEmail}</span><input name="email" type="email" autocomplete="email"></label>
    <label class="field"><span>${C.formDates}</span><input name="dates"></label>
    <label class="field"><span>${C.formMsg}</span><textarea name="message" rows="5" required></textarea></label>
    <div class="cform__actions">
      <button class="btn btn--wa" type="submit" data-via="wa">${icon('whatsapp')}${C.formSend}</button>
      <button class="btn btn--ghost" type="submit" data-via="mail">${icon('mail')}${C.formSendEmail}</button>
    </div>
    <p class="book__fine">${icon('shield')}${C.formHint}</p>
  </form>
</div></section>`;
  return layout({ lang, path, from, title: C.title, desc: C.desc, current: 'contact' }, main);
}

function faqPage(lang) {
  const Q = T[lang].faq;
  const path = 'faq/';
  const from = pageUrl(lang, path);
  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq[lang].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }];
  const main = `
${pageHead(Q.kicker, Q.h1, Q.lead)}
<section class="section section--tight"><div class="wrap narrow">
  <div class="accordion">${faq[lang].map(([q, a]) => `<details><summary>${esc(q)}${icon('plus')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>
${ctaBand(lang)}`;
  return layout({ lang, path, from, title: Q.title, desc: Q.desc, jsonld, current: 'faq' }, main);
}

function legalPage(key, lang) {
  const [title, sections] = legal[key][lang];
  const path = `legal/${key}/`;
  const from = pageUrl(lang, path);
  const main = `
${pageHead(T[lang].footer.legal, esc(title), '')}
<section class="section section--tight"><div class="wrap narrow prose">
  ${sections.map(([h, p]) => `<h2 class="h3">${esc(h)}</h2><p>${esc(p)}</p>`).join('')}
  <p class="muted">${lang === 'en' ? 'Last updated' : 'Última actualización'}: ${new Date().toISOString().slice(0, 10)}</p>
</div></section>`;
  return layout({ lang, path, from, title: `${title} — ${site.name}`, desc: `${title} · ${site.name}`, current: 'legal' }, main);
}

function notFoundPage() {
  // GitHub Pages sirve /404.html para cualquier ruta, así que aquí usamos rutas absolutas.
  const N = T.en.notFound;
  const E = T.es.notFound;
  const img = image('Isla-Catalina2.jpg', 'hero-catalina', Q.hero);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${N.title}</title><meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap"><link rel="stylesheet" href="/css/site.css"></head>
<body class="nf"><main class="nf__in" style="--bg:url('/img/${img.name}-${img.widths.at(-1)}.jpg')"><p class="kicker kicker--light">404</p><h1 class="display">${N.h1}</h1><p class="lead">${N.lead}</p>
<p class="nf__actions"><a class="btn btn--sand" href="/">${N.cta}</a> <a class="btn btn--ghost-light" href="/es/" lang="es">${E.cta}</a></p></main></body></html>`;
}

// ---------- archivos auxiliares ----------
function sitemap() {
  const paths = ['', 'tours/', 'about/', 'contact/', 'faq/', ...Object.keys(legal).map((k) => `legal/${k}/`), ...tours.map((tr) => `tours/${tr.slug}/`)];
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.flatMap((p) => LANGS.map((l) => `  <url><loc>${abs(pageUrl(l, p))}</loc><lastmod>${today}</lastmod>${LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(pageUrl(x, p))}"/>`).join('')}</url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}


// ---------- asistente virtual (Domi) ----------
// Convierte un objeto a código JS conservando las funciones (las plantillas de texto del bot).
function toJs(v) {
  if (typeof v === 'function') return v.toString();
  if (Array.isArray(v)) return `[${v.map(toJs).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}:${toJs(x)}`).join(',')}}`;
  return JSON.stringify(v);
}
function priceText(tour, lang) {
  const L = T[lang];
  const p = tour.pricing;
  const es = lang === 'es';
  if (p.type === 'person') {
    return p.child === p.adult
      ? `${money(p.adult)} ${L.perPerson}`
      : `${money(p.adult)} ${es ? 'por adulto' : 'per adult'} · ${money(p.child)} ${es ? `por niño (${site.childAges} años)` : `per child (ages ${site.childAges})`}`;
  }
  if (p.type === 'tiers') return p.tiers.map((x) => `${L.book.group(x.min, x.max)}: ${money(x.price)} ${x.unit === 'person' ? L.perPerson : x.max <= 2 ? (es ? 'en total' : 'total') : L.perGroup}`).join(' · ');
  if (p.type === 'package') return `${p.options.map((o) => `${o.name[lang]} ${money(o.price)}`).join(' · ')} (${L.perPerson})`;
  if (p.type === 'couple') return es ? `${money(p.first)} la primera pareja + ${money(p.extra)} cada pareja adicional` : `${money(p.first)} for the first couple + ${money(p.extra)} per extra couple`;
  return L.freeWith;
}
function botScript(lang) {
  const F = faq[lang];
  const data = {
    lang,
    strings: bot[lang],
    aliases,
    intents,
    site: { phone: site.phone, email: site.email, whatsapp: site.whatsapp, hours: site.hours[lang], zones: site.pickupZones[lang] },
    childAges: site.childAges,
    geo: { lat: places['punta-cana'].lat, lon: places['punta-cana'].lon },
    weatherLabels: T[lang].home.weather,
    reviews: { url: site.tripadvisor.url, rating: fmtRating(site.tripadvisor.rating, lang), count: site.tripadvisor.count, rank: site.tripadvisor.rank[lang] },
    faq: { pickup: F[0][1], payment: F[1][1], cancel: F[2][1], kids: F[4][1], bring: F[5][1], rain: F[6][1], groups: F[7][1] },
    cats: Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v[lang]])),
    tours: tours.map((tr) => {
      const img = tourImages(tr)[0];
      const f = fromPrice(tr);
      return {
        slug: tr.slug,
        title: tr.title[lang],
        tagline: tr.tagline[lang],
        cat: tr.cat,
        place: tr.place,
        featured: !!tr.featured,
        duration: tr.duration[lang],
        price: priceText(tr, lang),
        from: f.value,
        perPerson: f.unit === 'perPerson',
        includes: tr.includes[lang],
        excludes: tr.excludes[lang],
        url: pageUrl(lang, `tours/${tr.slug}/`),
        pricing: tr.pricing,
        placeName: places[tr.place].name,
        catName: categories[tr.cat][lang],
        highlights: tr.highlights[lang],
        seasonal: !!tr.season,
        img: `img/${img.name}-${img.widths[0]}.jpg`,
        kids: ['saona-island', 'swim-with-dolphins', 'hacienda-park-7-in-1', 'catalina-snorkel', 'samana-cayo-levantado'].includes(tr.slug),
      };
    }),
  };
  return `/* Generado por src/build.mjs — no editar */\nwindow.HX_BOT=${toJs(data)};\n`;
}

// ---------- build ----------
function build() {
  const t0 = Date.now();
  // Limpia todo menos las imágenes ya optimizadas (caché).
  if (existsSync(OUT)) for (const f of readdirSync(OUT)) if (f !== 'img') rmSync(join(OUT, f), { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  for (const lang of LANGS) {
    write(pageUrl(lang, ''), homePage(lang));
    write(pageUrl(lang, 'tours/'), toursPage(lang));
    for (const tour of tours) write(pageUrl(lang, `tours/${tour.slug}/`), tourPage(tour, lang));
    write(pageUrl(lang, 'about/'), aboutPage(lang));
    write(pageUrl(lang, 'contact/'), contactPage(lang));
    write(pageUrl(lang, 'faq/'), faqPage(lang));
    for (const k of Object.keys(legal)) write(pageUrl(lang, `legal/${k}/`), legalPage(k, lang));
  }
  write('404.html', notFoundPage());
  for (const lang of LANGS) write(`js/bot-${lang}.js`, botScript(lang));

  // Imagen para compartir (1200×630) y icono de Apple.
  const og = join(OUT, 'img/og-default.jpg');
  if (!existsSync(og)) {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', '--resampleWidth', '1200', enhanced('Isla-Catalina2.jpg'), '--out', og], { stdio: 'ignore' });
    execFileSync('sips', ['-c', '630', '1200', og], { stdio: 'ignore' });
  }
  const touch = join(OUT, 'img/apple-touch-icon.png');
  if (!existsSync(touch)) {
    execFileSync('sips', ['-s', 'format', 'png', '-z', '180', '180', join(ROOT, 'src/static/icon-512.png'), '--out', touch], { stdio: 'ignore' });
  }

  // Estáticos
  for (const [src, dest] of [['src/static/site.css', 'css/site.css'], ['src/static/site.js', 'js/site.js'], ['src/static/bot.js', 'js/bot.js'], ['src/static/domi.jpg', 'img/domi.jpg'], ['src/static/favicon.svg', 'favicon.svg'], ['src/static/icon-512.png', 'img/icon-512.png'], ['CNAME', 'CNAME']]) {
    mkdirSync(dirname(join(OUT, dest)), { recursive: true });
    copyFileSync(join(ROOT, src), join(OUT, dest));
  }
  writeFileSync(join(OUT, '.nojekyll'), '');
  writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`);
  writeFileSync(join(OUT, 'sitemap.xml'), sitemap());
  writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
    name: site.name, short_name: 'Harmony', start_url: './', display: 'standalone', background_color: '#fbf8f3', theme_color: '#0b2a33',
    icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: 'img/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }, null, 2));

  // Borra imágenes huérfanas de builds anteriores.
  const used = new Set(['og-default.jpg', 'apple-touch-icon.png', 'icon-512.png', 'domi.jpg']);
  for (const info of imgCache.values()) { used.add(`${info.name}-lqip.jpg`); for (const w of info.widths) used.add(`${info.name}-${w}.jpg`); }
  for (const f of readdirSync(join(OUT, 'img'))) if (!used.has(f)) rmSync(join(OUT, 'img', f));

  const pages = LANGS.length * (5 + tours.length + Object.keys(legal).length) + 1;
  console.log(`✔ ${pages} páginas · ${imgCache.size} fotos · ${Date.now() - t0} ms → docs/`);
}

build();
