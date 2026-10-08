/* CoachSessions — #/coach/sessions. Liste chronologique + CTA Nouveau débrief. */
import { h, mount, ICON, formatDate } from '../../lib/dom.js';
import { AppHeader, StatusBadge, CoachTabbar, RoleSwitchPill } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { MOCK_DATA } from '../../data/mockData.js';
import { store } from '../../lib/store.js';

// Route de destination selon le statut de la session.
function routeFor(session) {
  const st = store.status(session.id);
  if (st === 'to_debrief') return `#/coach/capture?s=${session.id}`;
  if (st === 'processing') return `#/coach/processing/${session.id}`;
  if (st === 'to_review') return `#/coach/review/${session.id}`;
  return `#/coach/reports/${session.id}`; // reports_ready | published
}

export function CoachSessions() {
  const C = COPY.coach.sessions;
  const sessions = [...MOCK_DATA.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const rows = sessions.map((s) => h('button', { class: 'listbtn', onClick: () => { window.location.hash = routeFor(s); } },
    h('span', { class: 'crest-lg' }, h('img', { src: `assets/crests/${crestFor(s.opponent)}`, alt: '', onerror: 'this.style.display=\"none\"' })),
    h('span', { class: 'grow' },
      h('span', { class: 'name' }, `Montreuil ${s.score || '–'} ${s.opponent}`),
      h('span', { class: 'sub' }, `${formatDate(s.date)} · ${s.location === 'home' ? 'domicile' : 'extérieur'}`),
      h('span', { style: { display: 'inline-block', marginTop: '7px' } }, StatusBadge(store.status(s.id))),
    ),
    h('span', { class: 'chev', html: ICON.chevron }),
  ));

  const screen = h('div', { class: 'screen' },
    AppHeader({ right: RoleSwitchPill('player') }),
    h('div', { class: 'body pad-nav' },
      h('p', { class: 'kicker' }, C.kicker),
      h('h1', { class: 'h1' }, `${MOCK_DATA.coach.clubName}`),
      h('p', { class: 'lead mt8' }, `${MOCK_DATA.coach.teamName} · coach ${MOCK_DATA.coach.firstName}`),
      h('button', { class: 'btn mt24', onClick: () => { window.location.hash = '#/coach/new'; } }, h('span', { html: ICON.plus }), C.newDebrief),
      h('p', { class: 'eyebrow', style: { margin: '28px 0 12px' } }, 'Séances'),
      sessions.length ? h('div', { class: 'stack' }, ...rows) : h('p', { class: 'hint' }, C.empty),
    ),
    CoachTabbar('sessions'),
  );
  mount(screen);
}

function crestFor(opponent) {
  const map = { 'AS Rignac': 'riviere.png', 'US Gévigny': 'vallieres.png', 'FC Salvagnac': 'lorient.png', 'Espérance Naucelle': 'etoile.png' };
  return map[opponent] || 'horizon.png';
}
