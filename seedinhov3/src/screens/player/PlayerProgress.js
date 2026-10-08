/* PlayerProgress — #/player/progress. Évolution des 6 axes sur la saison,
 * nombre de rapports, axe le plus progressé. État vide si < 2 rapports. */
import { h, mount } from '../../lib/dom.js';
import { AppHeader, PlayerTabbar, RoleSwitchPill } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { COPY } from '../../data/copy.js';
import { getPlayer, getPublishedReportsForPlayer, FIELD_AXES, GK_AXES } from '../../data/mockData.js';
import { DEMO_PLAYER } from './PlayerHome.js';

export function PlayerProgress() {
  const C = COPY.player.progress;
  const player = getPlayer(DEMO_PLAYER);
  const reports = getPublishedReportsForPlayer(DEMO_PLAYER); // du + récent au + ancien
  const isGk = player.position === 'GK';
  const keys = isGk ? GK_AXES : FIELD_AXES;
  const axesOf = (r) => (isGk ? r.gkAxes : r.axes) || {};

  let content;
  if (reports.length < 2) {
    content = h('div', { class: 'empty', style: { padding: '50px 20px' } },
      h('p', { class: 'h2', style: { fontSize: '19px' } }, C.title),
      h('p', { class: 'hint center', style: { maxWidth: '28ch' } }, C.empty));
  } else {
    const latest = axesOf(reports[0]);
    const first = axesOf(reports[reports.length - 1]);
    // Axe le plus progressé
    let best = keys[0], bestDelta = -Infinity;
    keys.forEach((k) => { const d = (latest[k] ?? 0) - (first[k] ?? 0); if (d > bestDelta) { bestDelta = d; best = k; } });

    const bars = keys.map((k) => {
      const cur = latest[k] ?? 0, delta = cur - (first[k] ?? 0);
      const dir = delta > 2 ? 'up' : (delta < -2 ? 'down' : 'flat');
      const arrow = dir === 'up' ? '↗' : dir === 'down' ? '↘' : '→';
      return h('div', { class: 'axisbar' },
        h('div', { class: 'ab-head' }, h('span', { class: 'ab-key' }, COPY.axes[k]),
          h('span', { class: 'ab-delta ' + dir }, arrow)),
        h('div', { class: 'ab-track' }, h('i', { style: { width: cur + '%' } })));
    });

    content = h('div', null,
      h('div', { style: { marginBottom: '16px' } }, RadarChart({ axes: latest, keys, labels: COPY.axesShort, previous: first })),
      h('div', { class: 'progress-stats' },
        h('div', { class: 'pstat' }, h('div', { class: 'pstat-big' }, String(reports.length)), h('div', { class: 'pstat-lbl' }, C.reportsReceived(reports.length).replace(/^\d+\s/, ''))),
        h('div', { class: 'pstat' }, h('div', { class: 'pstat-big', style: { color: '#0a6e3b' } }, COPY.axesShort[best]), h('div', { class: 'pstat-lbl' }, C.mostImproved))),
      h('p', { class: 'eyebrow', style: { margin: '22px 0 12px' } }, C.season),
      ...bars,
      // Résumé de saison — synthèse de l'ensemble des matchs reçus (pas un seul).
      h('div', { class: 'coachnote mt24' },
        h('div', { class: 'cn-head' }, h('span', { html: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#02562d"><path d="M7 7h4v6H8l-1 4H5l1-4V7zm8 0h4v6h-3l-1 4h-2l1-4V7z"/></svg>' }), C.seasonSummary),
        h('p', { class: 'cn-body' }, C.seasonSummaryText)),
      h('p', { class: 'hint mt8' }, C.seasonSummaryNote),
    );
  }

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/player/home', right: RoleSwitchPill('coach') }),
    h('div', { class: 'body pad-nav' }, content),
    PlayerTabbar('progress'),
  );
  mount(screen);
}
