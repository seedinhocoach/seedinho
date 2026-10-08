/* CoachSettings — #/coach/settings. Réglages coach + sélecteur de démo pour
 * basculer vers l'espace joueur (présentation uniquement). */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, CoachTabbar, DemoRoleSwitch, RoleSwitchPill } from '../../components/Shared.js';
import { MOCK_DATA } from '../../data/mockData.js';

export function CoachSettings() {
  const infoRow = (k, v) => h('div', { class: 'profrow' }, h('span', { class: 'pr-k' }, k), h('span', { class: 'pr-v' }, v));

  const screen = h('div', { class: 'screen' },
    AppHeader({ right: RoleSwitchPill('player') }),
    h('div', { class: 'body pad-nav' },
      h('p', { class: 'kicker' }, 'Réglages'),
      h('h1', { class: 'h1' }, `${MOCK_DATA.coach.firstName} ${MOCK_DATA.coach.lastName}`),
      h('p', { class: 'lead mt8' }, `Coach · ${MOCK_DATA.coach.clubName}`),

      h('div', { class: 'card mt24' },
        infoRow('Club', MOCK_DATA.coach.clubName),
        infoRow('Équipe', MOCK_DATA.coach.teamName),
        infoRow('Saison', '2025 – 2026')),

      h('p', { class: 'eyebrow', style: { margin: '24px 0 10px' } }, 'Démo — changer d\u2019espace'),
      DemoRoleSwitch('coach'),
      h('p', { class: 'hint mt8' }, 'Ce sélecteur sert uniquement à la présentation. Les deux espaces sont distincts.'),

      h('button', { class: 'btn btn-ghost mt24', onClick: () => { window.location.hash = '#/coach/login'; } }, 'Se déconnecter'),
    ),
    CoachTabbar('settings'),
  );
  mount(screen);
}
