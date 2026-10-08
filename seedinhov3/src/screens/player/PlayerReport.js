/* PlayerReport — #/player/report/:id. Match + score, radar avec courbe du
 * match précédent en surimpression, points forts, axes de travail, Mot du
 * coach si présent, mention "rédigé à partir du débrief". */
import { h, mount, ICON, formatDate } from '../../lib/dom.js';
import { AppHeader, SourceLink } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { COPY } from '../../data/copy.js';
import { getReport, getPlayer, getSession, FIELD_AXES, GK_AXES } from '../../data/mockData.js';
import { store } from '../../lib/store.js';
import { PlayerEmptyReport } from './PlayerEmptyReport.js';

export function PlayerReport({ id }) {
  const C = COPY.player.report;
  const report = getReport(id);
  if (!report) { window.location.hash = '#/player/home'; return; }
  const player = getPlayer(report.playerId);
  const session = getSession(report.sessionId);
  const isGk = player.position === 'GK';
  const keys = isGk ? GK_AXES : FIELD_AXES;
  const axes = isGk ? report.gkAxes : report.axes;
  if (!axes) { PlayerEmptyReport(session); return; }

  const note = store.getCoachNote(report.sessionId, report.playerId) || report.coachNote;

  const items = (arr, kind) => arr.map((it) => h('div', { class: 'axis-item' },
    h('div', { class: 'ai-top' }, h('span', { class: 'ai-dot ' + kind }), h('p', { class: 'ai-text' }, it.text)),
    SourceLink(it.sourceSegmentId, C.source),
  ));

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: `Mon rapport`, back: '#/player/home' }),
    h('div', { class: 'report-hero' },
      h('span', { class: 'blob' }),
      h('p', { class: 'rh-match' }, `Montreuil ${session.score} ${session.opponent}`),
      h('p', { class: 'rh-date' }, `${session.location === 'home' ? 'Domicile' : 'Extérieur'} · ${formatDate(session.date)}`),
    ),
    h('div', { class: 'body' },
      h('div', { style: { marginBottom: '10px' } }, RadarChart({ axes, keys, labels: COPY.axesShort, previous: report.previousAxes })),
      h('p', { class: 'frommark' }, h('span', { html: ICON.quote }), C.fromDebrief),
      report.strengths.length ? h('div', { class: 'mt16' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 10px' } }, C.strengths), ...items(report.strengths, 'good')) : null,
      report.improvements.length ? h('div', { class: 'mt16' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 10px' } }, C.improvements), ...items(report.improvements, 'work')) : null,
      note ? h('div', { class: 'coachnote mt16' },
        h('div', { class: 'cn-head' }, h('span', { html: ICON.quote }), C.coachNote),
        h('p', { class: 'cn-body' }, note)) : null,
    ),
  );
  mount(screen);
}
