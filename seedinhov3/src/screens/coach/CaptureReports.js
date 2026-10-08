/* CaptureReports — #/coach/capture-done/:id. Fin du débrief : rapports envoyés,
 * affichés en entier pour chaque joueur (photo, retours du coach, radar). */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { capture } from '../../lib/captureStore.js';
import { CAPTURE_PHOTO, axisKeys } from '../../data/captureSquad.js';
import { COPY } from '../../data/copy.js';

const posLabel = (p) => ({ GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }[p] || 'Joueur');

export function CaptureReports({ id }) {
  const ids = capture.activeIds();
  const skipped = capture.squad.filter((p) => capture.get(p.id).skipped);

  const reportCard = (pid) => {
    const p = capture.squad.find((x) => x.id === pid);
    const m = capture.get(pid)._mock;
    const keys = axisKeys(p.position);
    const vals = { ...m.radar };
    for (const k in (m.spoken || {})) vals[k] = m.spoken[k] * 20;
    const axes = {}; for (const k of keys) axes[k] = vals[k] == null ? 0 : vals[k];

    return h('div', { class: 'final-report' },
      h('div', { class: 'fr-head' },
        h('span', { style: { position: 'relative', flex: 'none' } },
          h('span', { class: 'avatar', style: { width: '54px', height: '54px' } }, h('img', { src: CAPTURE_PHOTO(pid), alt: '' })),
          h('span', { class: 'num-badge' }, String(p.number))),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { class: 'fr-name' }, `${p.firstName} ${p.lastName}`),
          h('div', { class: 'fr-pos' }, posLabel(p.position))),
        h('span', { class: 'pill pill-ready' }, h('span', { html: ICON.checkGreen }), 'Envoyé')),
      h('div', { class: 'fr-radar' }, RadarChart({ axes, keys, labels: COPY.axesShort })),
      h('p', { class: 'eyebrow', style: { margin: '14px 0 8px' } }, 'Les retours de ton coach'),
      ...(() => {
        // Côté joueur : jamais de note interne ni de passage non résolu.
        // Segment incertain => version résolue (playerText) si elle existe, sinon retiré.
        const lines = m.segments
          .map((seg) => (seg.conf === 'low' ? seg.playerText : seg.text))
          .filter(Boolean);
        return lines.length
          ? lines.map((t) => h('div', { class: 'seg-line high' }, h('span', { class: 'seg-badge', html: ICON.checkGreen }), h('p', null, t)))
          : [h('p', { class: 'hint' }, 'Pas de retour détaillé sur ce match.')];
      })(),
    );
  };

  mount(h('div', { class: 'screen' },
    AppHeader({ title: 'Rapports envoyés', back: `#/coach/capture-review/${id}` }),
    h('div', { class: 'body pad-nav' },
      h('div', { class: 'success-head' },
        h('div', { class: 'success-circle', html: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#02562d" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' }),
        h('h2', { class: 'h2', style: { fontSize: '21px' } }, `${ids.length} rapports envoyés`),
        h('p', { class: 'hint center' }, 'Voici ce que chaque joueur reçoit.')),
      h('div', { class: 'stack mt16' }, ...ids.map(reportCard)),
      skipped.length ? h('p', { class: 'hint mt16' }, `Sans retour ce match (rien n'a été dit) : ${skipped.map((p) => p.firstName).join(', ')}.`) : null,
      h('a', { class: 'btn mt24', href: '#/coach/sessions' }, 'Retour à mes débriefs'),
    ),
  ));
}
