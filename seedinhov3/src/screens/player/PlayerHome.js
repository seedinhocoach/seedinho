/* PlayerHome — #/player/home. Dernier rapport en avant, historique, prochain
 * match. Le joueur de démo est fixé (en prod : identité portée par le lien). */
import { h, mount, ICON, formatDate } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar, PlayerTabbar, fullName, RoleSwitchPill } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { getPlayer, getPublishedReportsForPlayer, getSession, MOCK_DATA } from '../../data/mockData.js';

export const DEMO_PLAYER = 'p8'; // Ibrahim (2 rapports publiés)

export function PlayerHome() {
  const C = COPY.player.home;
  const player = getPlayer(DEMO_PLAYER);
  const reports = getPublishedReportsForPlayer(DEMO_PLAYER);
  const latest = reports[0];
  const latestSession = latest ? getSession(latest.sessionId) : null;
  const nextMatch = MOCK_DATA.sessions.find((s) => s.status === 'to_debrief');

  const historyRows = reports.slice(1).map((r) => {
    const s = getSession(r.sessionId);
    return h('a', { class: 'listbtn', href: `#/player/report/${r.id}` },
      h('span', { class: 'grow' },
        h('span', { class: 'name', style: { fontSize: '14.5px' } }, `Montreuil ${s.score} ${s.opponent}`),
        h('span', { class: 'sub' }, formatDate(s.date))),
      h('span', { class: 'chev', html: ICON.chevron }));
  });

  const screen = h('div', { class: 'screen' },
    AppHeader({ right: h('div', { class: 'hdr-actions' }, RoleSwitchPill('coach'), h('a', { href: '#/player/profile', class: 'iconbtn', 'aria-label': 'Profil', html: ICON.player })) }),
    h('div', { class: 'body pad-nav' },
      h('div', { class: 'row', style: { marginBottom: '18px' } }, PlayerAvatar(player, 52),
        h('div', null, h('div', { class: 'name', style: { fontSize: '17px', fontWeight: '800' } }, fullName(player)),
          h('div', { class: 'sub' }, `${player.shirtNumber} · ${MOCK_DATA.coach.teamName}`))),

      latest ? h('a', { class: 'latest-card', href: `#/player/report/${latest.id}` },
        h('p', { class: 'eyebrow', style: { color: '#7CF0AC' } }, C.latest),
        h('p', { class: 'lc-title' }, `Montreuil ${latestSession.score} ${latestSession.opponent}`),
        h('p', { class: 'lc-date' }, formatDate(latestSession.date)),
        h('span', { class: 'lc-cta' }, 'Voir mon rapport', h('span', { html: ICON.arrow })),
      ) : h('p', { class: 'hint' }, C.noReportYet),

      historyRows.length ? h('div', null,
        h('p', { class: 'eyebrow', style: { margin: '26px 0 12px' } }, C.history),
        h('div', { class: 'stack' }, ...historyRows)) : null,

      nextMatch ? h('div', { class: 'nextmatch mt24' },
        h('p', { class: 'eyebrow', style: { marginBottom: '8px' } }, C.nextMatch),
        h('div', { class: 'row' },
          h('span', { class: 'nm-icon', html: ICON.target }),
          h('div', null, h('div', { class: 'name', style: { fontSize: '15px' } }, `Montreuil – ${nextMatch.opponent}`),
            h('div', { class: 'sub' }, `${formatDate(nextMatch.date)} · ${nextMatch.location === 'home' ? 'domicile' : 'extérieur'}`)))) : null,

      h('a', { class: 'btn btn-ghost mt24', href: '#/player/progress' }, 'Voir ma progression'),
    ),
    PlayerTabbar('home'),
  );
  mount(screen);
}
