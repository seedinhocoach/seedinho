/* NewDebrief — #/coach/new. Adversaire, date, score, sélection des joueurs
 * présents (grille de cartes photo + numéro + prénom). Puis enregistrement.
 * (Champs "Type de séance" et "Lieu" retirés — flux simplifié.) */
import { h, mount } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { MOCK_DATA, PLAYER_PHOTOS } from '../../data/mockData.js';

const DEMO_SESSION = 's3'; // le débrief de démo se rejoue sur la séance à valider

export function NewDebrief() {
  const C = COPY.coach.newSession;
  const selected = new Set(MOCK_DATA.players.slice(0, 11).map((p) => p.id));

  const grid = h('div', { class: 'squad-grid' });
  const renderGrid = () => grid.replaceChildren(...MOCK_DATA.players.map((p) => {
    const on = selected.has(p.id);
    return h('button', { class: 'squad-pill' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onClick: () => { on ? selected.delete(p.id) : selected.add(p.id); renderGrid(); } },
      h('span', { class: 'sp-photo' }, h('img', { src: PLAYER_PHOTOS[p.id], alt: '' }), h('span', { class: 'sp-num' }, String(p.shirtNumber))),
      h('span', { class: 'sp-name' }, p.firstName));
  }));
  renderGrid();

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/coach/sessions' }),
    h('div', { class: 'body pad-nav' },
      h('label', { class: 'formlabel' }, C.opponentLabel),
      h('input', { class: 'field', placeholder: C.opponentPlaceholder, value: 'AS Rignac' }),
      h('div', { class: 'field-row mt16' },
        h('div', { style: { flex: '1' } }, h('label', { class: 'formlabel' }, C.dateLabel), h('input', { class: 'field', type: 'date', value: '2026-06-13' })),
        h('div', { style: { flex: '1' } }, h('label', { class: 'formlabel' }, C.scoreLabel), h('input', { class: 'field', placeholder: '0-2', value: '3-3' })),
      ),
      h('label', { class: 'formlabel mt24' }, C.squadLabel),
      h('p', { class: 'hint', style: { marginBottom: '10px' } }, C.squadHint),
      grid,
    ),
    h('div', { class: 'sticky-cta' },
      h('button', { class: 'btn', onClick: () => { window.location.hash = `#/coach/capture?s=${DEMO_SESSION}`; } }, C.cta),
    ),
  );
  mount(screen);
}
