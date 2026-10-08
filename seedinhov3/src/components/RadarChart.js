/* ============================================================================
 * src/components/RadarChart.js — radar signature 6 axes (scores 0..100).
 * Élément signature : lisible sur mobile, beau en capture d'écran.
 * Peut superposer la courbe du match précédent (previous) en pointillé.
 * Props : { axes: {KEY:0..100}, keys: string[], labels: {KEY:short},
 *           previous?: {KEY:0..100}, dark?: bool }
 * ==========================================================================*/
import { h } from '../lib/dom.js';

export function RadarChart({ axes, keys, labels, previous = null, dark = true }) {
  const CX = 150, CY = 122, R = 80, LABEL_R = R + 22;
  const n = keys.length;
  const NS = 'http://www.w3.org/2000/svg';
  const ang = (i) => (-90 + i * (360 / n)) * Math.PI / 180;
  const point = (i, val) => {
    const rr = (Math.max(0, Math.min(100, val)) / 100) * R;
    return [CX + rr * Math.cos(ang(i)), CY + rr * Math.sin(ang(i))];
  };

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 300 260');
  svg.style.width = '100%'; svg.style.height = 'auto'; svg.style.display = 'block'; svg.style.overflow = 'visible';
  const add = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); svg.appendChild(e); return e; };

  const gridStroke = dark ? 'rgba(255,255,255,.14)' : 'rgba(2,86,45,.14)';
  for (let lvl = 1; lvl <= 4; lvl++) {
    const pts = keys.map((_, i) => { const p = point(i, lvl * 25); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    add('polygon', { points: pts, fill: 'none', stroke: gridStroke, 'stroke-width': '1' });
  }
  keys.forEach((_, i) => { const p = point(i, 100); add('line', { x1: CX, y1: CY, x2: p[0].toFixed(1), y2: p[1].toFixed(1), stroke: gridStroke, 'stroke-width': '1' }); });

  // Courbe précédente (comparaison) en pointillé
  if (previous) {
    const prev = keys.map((k, i) => { const p = point(i, previous[k] ?? 0); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    add('polygon', { points: prev, fill: 'none', stroke: dark ? 'rgba(255,255,255,.5)' : 'rgba(2,86,45,.4)', 'stroke-width': '1.5', 'stroke-dasharray': '4 4', 'stroke-linejoin': 'round' });
  }

  // Courbe du match
  const cur = keys.map((k, i) => { const p = point(i, axes[k] ?? 0); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
  add('polygon', { points: cur, fill: '#7CF0AC', 'fill-opacity': dark ? '0.22' : '0.14', stroke: '#5FE39B', 'stroke-width': '2.5', 'stroke-linejoin': 'round' });
  keys.forEach((k, i) => { const p = point(i, axes[k] ?? 0); add('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: '4', fill: '#7CF0AC', stroke: dark ? '#02562d' : '#fff', 'stroke-width': '2' }); });

  // Libellés d'axes uniquement (aucune valeur chiffrée — lecture purement visuelle)
  const labelEls = keys.map((k, i) => {
    const dx = Math.cos(ang(i)), dy = Math.sin(ang(i));
    const left = ((CX + LABEL_R * dx) / 300 * 100).toFixed(2);
    const top = ((CY + LABEL_R * dy) / 260 * 100).toFixed(2);
    const tx = Math.abs(dx) < 0.3 ? '-50%' : (dx > 0 ? '0' : '-100%');
    return h('div', { class: 'radar-label', style: { left: left + '%', top: top + '%', transform: `translate(${tx}, -50%)`, color: dark ? '#EFFAF3' : '#02562d' } },
      h('span', { class: 'rl-key' }, labels[k]),
    );
  });

  return h('div', { class: 'radar-card' + (dark ? '' : ' light') },
    h('div', { class: 'wrap' }, svg, ...labelEls),
    h('div', { class: 'radar-legend' },
      h('span', null, h('i', { class: 'lg cur' }), 'Ce match'),
      previous ? h('span', null, h('i', { class: 'lg prev' }), 'Match précédent') : null,
    ),
  );
}
