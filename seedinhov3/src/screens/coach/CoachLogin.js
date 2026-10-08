/* CoachLogin — #/coach/login. Connexion mockée (toute valeur passe). */
import { h, mount } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';

export function CoachLogin() {
  const C = COPY.coach.login;
  const email = h('input', { class: 'field', type: 'email', placeholder: C.emailPlaceholder, 'aria-label': C.emailLabel });
  const code = h('input', { class: 'field', type: 'text', inputmode: 'numeric', maxlength: '6', placeholder: C.codePlaceholder, 'aria-label': C.codeLabel });
  const screen = h('div', { class: 'screen' },
    AppHeader({}),
    h('div', { class: 'body' },
      h('p', { class: 'kicker' }, C.kicker),
      h('h1', { class: 'h1' }, C.title),
      h('p', { class: 'lead mt8' }, C.subtitle),
      h('div', { class: 'stack mt24' },
        h('label', { class: 'formlabel' }, C.emailLabel), email,
        h('label', { class: 'formlabel' }, C.codeLabel), code,
      ),
      h('button', { class: 'btn mt24', onClick: () => { window.location.hash = '#/coach/sessions'; } }, C.submit),
      h('p', { class: 'hint center mt16' }, C.hint),
    ),
  );
  mount(screen);
}
