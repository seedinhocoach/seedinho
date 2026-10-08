/* PlayerFile — #/coach/player/:playerId. Historique des rapports du joueur +
 * évolution des axes sur la saison. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar, fullName, positionLabel } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { COPY } from '../../data/copy.js';
import { getPlayer, getReportsForPlayer, getSession, FIELD_AXES, GK_AXES } from '../../data/mockData.js';

export function PlayerFile({ playerId }) {
  const C = COPY.coach.playerFile;
  const player = getPlayer(playerId);
  if (!player) { window.location.hash = '#/coach/sessions'; return; }
  const reports = getReportsForPlayer(playerId);
  const isGk = player.position === 'GK';
  const keys = isGk ? GK_AXES : FIELD_AXES;
  const latest = reports[0];
  const axes = latest ? (isGk ? latest.gkAxes : latest.axes) : null;

  const history = reports.map((r) => {
    const s = getSession(r.sessionId);
    return h('a', { class: 'listbtn', href: `#/coach/report/${r.id}` },
      h('span', { class: 'grow' },
        h('span', { class: 'name', style: { fontSize: '14.5px' } }, `Montreuil ${s.score} ${s.opponent}`),
        h('span', { class: 'sub' }, new Date(s.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }))),
      h('span', { class: 'chev', html: ICON.chevron }),
    );
  });

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/coach/sessions' }),
    h('div', { class: 'body' },
      h('div', { class: 'row', style: { marginBottom: '18px' } },
        PlayerAvatar(player, 56),
        h('div', null, h('div', { class: 'name', style: { fontSize: '18px', fontWeight: '800' } }, fullName(player)),
          h('div', { class: 'sub' }, `${positionLabel(player.position)} · #${player.shirtNumber}`))),
      axes ? h('div', { style: { marginBottom: '18px' } }, RadarChart({ axes, keys, labels: COPY.axesShort })) : null,
      h('p', { class: 'eyebrow', style: { margin: '0 0 12px' } }, C.history),
      reports.length ? h('div', { class: 'stack' }, ...history) : h('p', { class: 'hint' }, C.noHistory),
    ),
  );
  mount(screen);
}
