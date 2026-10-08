/* CoachSquad — #/coach/squad. Effectif complet (avatars photo). Chaque joueur
 * ouvre sa fiche (historique + évolution). Onglet Effectif de la nav coach. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, CoachTabbar, PlayerAvatar, fullName, positionLabel, RoleSwitchPill } from '../../components/Shared.js';
import { MOCK_DATA } from '../../data/mockData.js';

export function CoachSquad() {
  const rows = MOCK_DATA.players.map((p) => h('button', { class: 'listbtn', onClick: () => { window.location.hash = `#/coach/player/${p.id}`; } },
    PlayerAvatar(p, 46),
    h('span', { class: 'grow' },
      h('span', { class: 'name' }, fullName(p)),
      h('span', { class: 'sub' }, `${positionLabel(p.position)} · #${p.shirtNumber}`)),
    h('span', { class: 'chev', html: ICON.chevron }),
  ));

  const screen = h('div', { class: 'screen' },
    AppHeader({ right: RoleSwitchPill('player') }),
    h('div', { class: 'body pad-nav' },
      h('p', { class: 'kicker' }, 'Effectif'),
      h('h1', { class: 'h1' }, MOCK_DATA.coach.teamName),
      h('p', { class: 'lead mt8' }, `${MOCK_DATA.players.length} joueurs`),
      h('div', { class: 'stack mt16' }, ...rows),
    ),
    CoachTabbar('squad'),
  );
  mount(screen);
}
