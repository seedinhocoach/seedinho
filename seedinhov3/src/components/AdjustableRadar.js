/* ============================================================================
 * src/components/AdjustableRadar.js — radar + curseurs (sliders) par axe.
 * Le coach ajuste chaque axe ; le radar se met à jour immédiatement.
 * Aucune valeur chiffrée n'est affichée (ni radar, ni sliders) — lecture
 * purement visuelle, conforme à la règle produit.
 * ==========================================================================*/
import { h } from '../lib/dom.js';
import { RadarChart } from './RadarChart.js';
import { COPY } from '../data/copy.js';
import { store } from '../lib/store.js';

export function AdjustableRadar({ reportId, baseAxes, previous, keys }) {
  const values = store.getRadar(reportId, baseAxes);
  const radarHost = h('div', { class: 'mt8' });

  const renderRadar = () => radarHost.replaceChildren(
    RadarChart({ axes: values, keys, labels: COPY.axesShort, previous }));

  const sliders = keys.map((k) => {
    const input = h('input', {
      class: 'axis-slider', type: 'range', min: '0', max: '100', step: '5', value: String(Math.round(values[k] ?? 0)),
      'aria-label': COPY.axes[k],
      oninput: (e) => { const v = Number(e.target.value); values[k] = v; store.setRadarAxis(reportId, baseAxes, k, v); renderRadar(); },
    });
    return h('div', { class: 'axis-slider-row' },
      h('span', { class: 'as-key' }, COPY.axes[k]),
      input);
  });

  renderRadar();
  return h('div', null,
    radarHost,
    h('div', { class: 'axis-sliders' },
      h('p', { class: 'hint', style: { marginBottom: '10px' } }, 'Ajuste chaque axe si besoin — le radar se met à jour en direct.'),
      ...sliders),
  );
}
