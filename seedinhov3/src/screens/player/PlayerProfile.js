/* PlayerProfile — #/player/profile. Poste, numéro, saison, consentement
 * parental si mineur. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar, PlayerTabbar, fullName, positionLabel, RoleSwitchPill } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { getPlayer, MOCK_DATA } from '../../data/mockData.js';
import { DEMO_PLAYER } from './PlayerHome.js';

export function PlayerProfile() {
  const C = COPY.player.profile;
  const player = getPlayer(DEMO_PLAYER);
  const row = (label, value) => h('div', { class: 'profrow' }, h('span', { class: 'pr-k' }, label), h('span', { class: 'pr-v' }, value));

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/player/home', right: RoleSwitchPill('coach') }),
    h('div', { class: 'body pad-nav' },
      h('div', { class: 'center', style: { marginBottom: '20px' } },
        h('div', { style: { display: 'inline-block' } }, PlayerAvatar(player, 88)),
        h('h2', { class: 'h2', style: { fontSize: '20px', marginTop: '12px' } }, fullName(player)),
        h('p', { class: 'sub' }, `${MOCK_DATA.coach.clubName} · ${MOCK_DATA.coach.teamName}`)),
      h('div', { class: 'card' },
        row(C.position, positionLabel(player.position)),
        row(C.number, '#' + player.shirtNumber),
        row(C.season, '2025 – 2026'),
      ),
      player.isMinor ? h('div', { class: 'consent-card mt16' },
        h('span', { class: 'cc-icon', html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#02562d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><polyline points="9 12 11.5 14.5 15.5 10"/></svg>' }),
        h('div', null, h('div', { class: 'cc-title' }, C.consent), h('div', { class: 'cc-sub' }, C.consentOk))) : null,
    ),
    PlayerTabbar('home'),
  );
  mount(screen);
}
