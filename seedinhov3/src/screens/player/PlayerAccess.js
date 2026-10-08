/* PlayerAccess — #/player/access. Code d'invitation mocké. */
import { h, mount } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';

export function PlayerAccess() {
  const C = COPY.player.access;
  const code = h('input', { class: 'field', maxlength: '6', placeholder: C.codePlaceholder, 'aria-label': C.codeLabel, style: { textTransform: 'uppercase', letterSpacing: '.3em', textAlign: 'center', fontWeight: '700' } });
  const screen = h('div', { class: 'screen' },
    AppHeader({}),
    h('div', { class: 'body' },
      h('p', { class: 'kicker' }, C.kicker),
      h('h1', { class: 'h1' }, C.title),
      h('p', { class: 'lead mt8' }, C.subtitle),
      h('label', { class: 'formlabel mt24' }, C.codeLabel), code,
      h('button', { class: 'btn mt24', onClick: () => { window.location.hash = '#/player/home'; } }, C.submit),
      h('p', { class: 'hint center mt16' }, C.hint),
    ),
  );
  mount(screen);
}
