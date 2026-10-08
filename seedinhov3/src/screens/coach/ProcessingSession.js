/* ProcessingSession — #/coach/processing/:id. 3 étapes séquentielles (~6 s)
 * puis bascule vers la validation de la transcription. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { store } from '../../lib/store.js';

export function ProcessingSession({ id }) {
  const C = COPY.coach.processing;
  store.setStatus(id, 'processing');
  const steps = C.steps.map((label) => {
    const tick = h('span', { class: 'tick off' });
    const lbl = h('span', { class: 'lbl' }, label);
    return { row: h('div', { class: 'step' }, tick, lbl), tick, lbl };
  });

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title }),
    h('div', { class: 'loader' },
      h('div', { class: 'spinner' }),
      h('p', { class: 'h2', style: { fontSize: '20px' } }, C.heading),
      h('p', { class: 'hint', style: { maxWidth: '28ch' } }, C.note),
      h('div', { class: 'steps' }, ...steps.map((s) => s.row)),
    ),
  );
  mount(screen);

  let i = 0;
  const t = setInterval(() => {
    if (i < steps.length) {
      steps[i].tick.className = 'tick on'; steps[i].tick.innerHTML = ICON.check;
      steps[i].lbl.className = 'lbl on'; i += 1;
    } else {
      clearInterval(t);
      store.setStatus(id, 'to_review');
      window.location.hash = `#/coach/review/${id}`;
    }
  }, 1800);
}
