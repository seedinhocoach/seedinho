/* CoachReport — #/coach/report/:reportId  (et /report/empty pour l'état vide).
 * Vue coach d'un rapport : radar 6 axes (gardien si GK), points forts & axes
 * de progrès avec accès au verbatim source, Mot du coach, boutons Modifier. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar, AudioPlayer, fullName, positionLabel, SourceLink } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { COPY } from '../../data/copy.js';
import { getReport, getPlayer, getSession, FIELD_AXES, GK_AXES } from '../../data/mockData.js';
import { store } from '../../lib/store.js';

// État vide (coach) : rien n'a été dit — champ mot facultatif.
export function CoachReportEmpty(params) {
  const C = COPY.coach.emptyPlayer;
  const player = getPlayer(params.p);
  const sessionId = params.s;
  const ta = h('textarea', { class: 'field', placeholder: C.placeholder, value: store.getCoachNote(sessionId, params.p) || '' });
  const screen = h('div', { class: 'screen' },
    AppHeader({ title: player ? player.firstName : 'Joueur', back: `#/coach/reports/${sessionId}` }),
    h('div', { class: 'body' },
      h('div', { class: 'empty-inline' }, h('span', { html: ICON.inbox })),
      h('h2', { class: 'h2 center', style: { fontSize: '20px' } }, C.title),
      h('p', { class: 'hint center', style: { maxWidth: '32ch', margin: '8px auto 0' } }, C.body),
      h('div', { class: 'coachnote-edit mt24' },
        h('label', { class: 'formlabel' }, COPY.coach.report.coachNote), ta),
      h('button', { class: 'btn mt16', onClick: () => { store.setCoachNote(sessionId, params.p, ta.value); window.location.hash = `#/coach/reports/${sessionId}`; } }, C.save),
    ),
  );
  mount(screen);
}

export function CoachReport({ reportId }) {
  const C = COPY.coach.report;
  const report = getReport(reportId);
  if (!report) { window.location.hash = '#/coach/sessions'; return; }
  const player = getPlayer(report.playerId);
  const session = getSession(report.sessionId);
  const isGk = player.position === 'GK';
  const keys = isGk ? GK_AXES : FIELD_AXES;
  const base = isGk ? report.gkAxes : report.axes;
  const axes = store.getRadar(report.id, base); // reflète les ajustements du coach

  const itemRow = (item, kind) => h('div', { class: 'axis-item' },
    h('div', { class: 'ai-top' },
      h('span', { class: 'ai-dot ' + kind }),
      h('p', { class: 'ai-text' }, item.text),
      h('button', { class: 'ai-edit', html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>', onClick: () => {} }),
    ),
    SourceLink(item.sourceSegmentId, C.source),
  );

  const note = null; void note;

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: `${player.firstName} · #${player.shirtNumber}`, back: `#/coach/reports/${report.sessionId}` }),
    h('div', { class: 'report-hero' },
      h('span', { class: 'blob' }),
      h('div', { class: 'r' }, PlayerAvatar(player, 64),
        h('div', null,
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px' } }, h('h1', null, player.firstName), h('span', { class: 'n' }, '#' + player.shirtNumber)),
          h('div', { class: 'role' }, positionLabel(player.position))),
      ),
      h('div', { class: 'role', style: { position: 'relative', marginTop: '12px', fontSize: '12.5px' } }, `Montreuil ${session.score} ${session.opponent}`),
    ),
    h('div', { class: 'body' },
      h('div', { style: { marginBottom: '18px' } }, RadarChart({ axes, keys, labels: COPY.axesShort, previous: report.previousAxes })),
      report.strengths.length ? h('div', { class: 'mt16' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 10px' } }, C.strengths),
        ...report.strengths.map((s) => itemRow(s, 'good'))) : null,
      report.improvements.length ? h('div', { class: 'mt16' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 10px' } }, C.improvements),
        ...report.improvements.map((s) => itemRow(s, 'work'))) : null,
    ),
  );
  mount(screen);
}
