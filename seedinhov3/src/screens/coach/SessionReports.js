/* SessionReports — #/coach/reports/:id. Effectif de la séance : état du
 * rapport de chaque joueur (prêt / rien à dire). CTA Publier les rapports. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar, MatchHeader, fullName, positionLabel } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { getSession, getReportFor, getPlayer } from '../../data/mockData.js';
import { store } from '../../lib/store.js';

export function SessionReports({ id }) {
  const C = COPY.coach.reports;
  const session = getSession(id);
  if (!session) { window.location.hash = '#/coach/sessions'; return; }
  const published = store.status(id) === 'published';

  const rows = session.squad.map((pid) => {
    const p = getPlayer(pid);
    const report = getReportFor(id, pid);
    const has = !!report;
    return h('button', { class: 'listbtn', onClick: () => {
      window.location.hash = has ? `#/coach/report/${report.id}` : `#/coach/report/empty?s=${id}&p=${pid}`;
    } },
      PlayerAvatar(p, 46),
      h('span', { class: 'grow' },
        h('span', { class: 'name' }, fullName(p)),
        h('span', { class: 'sub' }, positionLabel(p.position)),
        h('span', { style: { display: 'inline-block', marginTop: '6px' } },
          has ? h('span', { class: 'pill pill-ready' }, h('span', { class: 'dot', style: { background: 'currentColor' } }), C.ready)
              : h('span', { class: 'pill pill-draft' }, h('span', { class: 'dot', style: { background: 'currentColor' } }), C.nothing)),
      ),
      h('span', { class: 'chev', html: ICON.chevron }),
    );
  });

  const readyCount = session.squad.filter((pid) => getReportFor(id, pid)).length;

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/coach/sessions' }),
    h('div', { class: 'body pad-nav' },
      MatchHeader(session),
      h('p', { class: 'kicker mt16' }, `${readyCount} rapports prêts`),
      h('div', { class: 'stack mt8' }, ...rows),
    ),
    h('div', { class: 'sticky-cta' },
      published
        ? h('button', { class: 'btn btn-ghost', onClick: () => { window.location.hash = '#/coach/sessions'; } }, COPY.common.done)
        : h('button', { class: 'btn', onClick: () => { window.location.hash = `#/coach/publish/${id}`; } }, h('span', { html: ICON.arrow }), C.publish),
    ),
  );
  mount(screen);
}
