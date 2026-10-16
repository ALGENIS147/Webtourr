# Harmony Excursions — sitio web

Sitio estático bilingüe (inglés / español) para harmonyexcursions.com.

## Estructura

```
src/
  data/site.mjs     datos de la empresa (teléfono, horario, políticas)
  data/tours.mjs    todos los tours: textos, fotos y precios
  data/i18n.mjs     textos de la interfaz en EN y ES
  data/pages.mjs    preguntas frecuentes y páginas legales
  photos/           fotos originales (no se publican tal cual)
  static/           CSS, JavaScript e iconos
  build.mjs         generador del sitio
  map.mjs           mapa de República Dominicana
docs/               sitio final generado (lo que publica GitHub Pages)
legacy/             la página vieja, solo como referencia
```

## Cambiar algo

1. Edita el archivo en `src/data/` (por ejemplo, un precio en `tours.mjs`).
2. Genera el sitio (necesita Node 18+ y macOS, por `sips`):

   ```bash
   node src/build.mjs
   ```

3. Míralo con Live Server abriendo `docs/index.html`.

**No edites nada dentro de `docs/`**: se borra y se vuelve a crear en cada build.

## Agregar un tour

Copia un bloque de `tours.mjs`, cambia el `slug` (será la URL), pon las fotos en `src/photos/`
y genera el sitio. La página en inglés, la de español, el catálogo, el mapa y el sitemap se actualizan solos.

## Publicar en GitHub Pages

Settings → Pages → Branch `main`, carpeta `/docs`. El dominio ya está en `CNAME`.
