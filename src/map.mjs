// Mapa SVG de República Dominicana generado a partir de coordenadas reales (lon, lat).
// Proyección equirectangular corregida por cos(latitud) para que no se vea estirado.

const LON0 = -72.05;
const LON1 = -68.15;
const LAT0 = 17.45;
const LAT1 = 20.05;
const W = 1000;
const K = W / (LON1 - LON0);
const KY = K / Math.cos((18.8 * Math.PI) / 180);
export const mapBox = { w: W, h: Math.round((LAT1 - LAT0) * KY) };
export const project = (lon, lat) => [(lon - LON0) * K, (LAT1 - lat) * KY];

// Costa en sentido horario desde Montecristi.
const COAST = [
  [-71.66, 19.89], [-71.4, 19.87], [-71.12, 19.92], [-70.9, 19.86], [-70.69, 19.81], [-70.5, 19.78],
  [-70.3, 19.69], [-70.05, 19.66], [-69.89, 19.64], [-69.84, 19.47], [-69.88, 19.34], [-69.72, 19.29],
  [-69.52, 19.32], [-69.32, 19.33], [-69.14, 19.36], [-69.2, 19.27], [-69.33, 19.21], [-69.55, 19.2],
  [-69.76, 19.12], [-69.6, 19.05], [-69.4, 19.06], [-69.2, 19.02], [-69.03, 18.98], [-68.8, 18.9],
  [-68.6, 18.8], [-68.45, 18.69], [-68.33, 18.62], [-68.36, 18.52], [-68.4, 18.42], [-68.52, 18.35],
  [-68.68, 18.33], [-68.84, 18.36], [-68.97, 18.41], [-69.15, 18.42], [-69.3, 18.44], [-69.6, 18.44],
  [-69.88, 18.46], [-70.1, 18.32], [-70.22, 18.23], [-70.4, 18.22], [-70.55, 18.27], [-70.7, 18.4],
  [-70.9, 18.3], [-71.08, 18.2], [-71.16, 18.05], [-71.26, 17.88], [-71.4, 17.66], [-71.55, 17.62],
  [-71.68, 17.78], [-71.75, 18.03], [-71.86, 18.2], [-71.95, 18.55], [-71.8, 18.8], [-71.73, 19.1],
  [-71.7, 19.4], [-71.73, 19.62], [-71.71, 19.8],
];

// Curva suave cerrada (Catmull-Rom → Bézier).
function smoothClosed(pts, tension = 0.5) {
  const p = pts.map(([lon, lat]) => project(lon, lat));
  const n = p.length;
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

function ellipse(lon, lat, rx, ry, rot = 0) {
  const [x, y] = project(lon, lat);
  return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(rx * K).toFixed(1)}" ry="${(ry * KY).toFixed(1)}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
}

export function mapSvg(stops) {
  const base = stops.find((s) => s.id === 'punta-cana');
  const [bx, by] = project(base.lon, base.lat);
  const routes = stops
    .filter((s) => s.id !== 'punta-cana')
    .map((s, i) => {
      const [x, y] = project(s.lon, s.lat);
      // Arco: punto de control desplazado perpendicularmente a la línea.
      const mx = (bx + x) / 2;
      const my = (by + y) / 2;
      const dx = x - bx;
      const dy = y - by;
      const len = Math.hypot(dx, dy);
      const bend = Math.min(90, len * 0.28);
      const cx = mx + (-dy / len) * bend;
      const cy = my + (dx / len) * bend;
      return `<path class="map__route" style="--i:${i}" d="M${bx.toFixed(1)} ${by.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}" pathLength="1"/>`;
    })
    .join('');
  // Retícula de latitud/longitud como en una carta náutica.
  const grid = [];
  for (let lon = -72; lon <= -68.5; lon += 0.5) {
    const [x] = project(lon, 0);
    grid.push(`<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${mapBox.h}"/>`);
  }
  for (let lat = 17.5; lat <= 20; lat += 0.5) {
    const [, y] = project(0, lat);
    grid.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/>`);
  }
  return `<svg class="map__svg" viewBox="0 0 ${W} ${mapBox.h}" role="img" aria-label="Map of the Dominican Republic">
  <defs>
    <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" class="map__dotfill"/></pattern>
  </defs>
  <g class="map__grid">${grid.join('')}</g>
  <g class="map__land">
    <path d="${smoothClosed(COAST)}"/>
    ${ellipse(-68.72, 18.155, 0.15, 0.045, -6)}
    ${ellipse(-69.02, 18.355, 0.03, 0.022)}
  </g>
  <path class="map__texture" d="${smoothClosed(COAST)}" fill="url(#dots)"/>
  <text class="map__label" x="${project(-70.9, 19.05)[0].toFixed(0)}" y="${project(-70.9, 19.05)[1].toFixed(0)}">REPÚBLICA DOMINICANA</text>
  <text class="map__label map__label--sea" x="${project(-70.6, 17.75)[0].toFixed(0)}" y="${project(-70.6, 17.75)[1].toFixed(0)}">MAR CARIBE</text>
  <text class="map__label map__label--sea" x="${project(-70.2, 19.95)[0].toFixed(0)}" y="${project(-70.2, 19.95)[1].toFixed(0)}">OCÉANO ATLÁNTICO</text>
  <g class="map__routes">${routes}</g>
</svg>`;
}
