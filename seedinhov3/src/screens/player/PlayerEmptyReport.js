/* PlayerEmptyReport — état vide côté joueur : aucun retour individuel. */
import { h, mount, ICON, formatDate } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';

export function PlayerEmptyReport(session) {
  const C = COPY.player.emptyReport;
  const screen = h('div', { class: 'screen' },
    AppHeader({ title: 'Mon rapport', back: '#/player/home' }),
    h('div', { class: 'empty' },
      h('div', { class: 'circle', html: ICON.inbox }),
      h('p', { class: 'h2', style: { fontSize: '20px' } }, C.title),
      h('p', { class: 'hint center', style: { maxWidth: '30ch', fontSize: '14px' } }, C.body),
      session ? h('p', { class: 'hint center mt8' }, `Montreuil ${session.score} ${session.opponent} · ${formatDate(session.date)}`) : null,
      h('a', { class: 'btn btn-ghost mt16', href: '#/player/home', style: { width: 'auto', padding: '13px 22px' } }, COPY.common.back),
    ),
  );
  mount(screen);
}
