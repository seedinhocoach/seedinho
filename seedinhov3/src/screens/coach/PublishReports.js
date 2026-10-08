/* PublishReports — #/coach/publish/:id. Récap (N rapports, M sans retour),
 * confirmation explicite, puis écran de succès. */
import { h, mount, ICON } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { getSession, getReportFor } from '../../data/mockData.js';
import { store } from '../../lib/store.js';

export function PublishReports({ id }) {
  const C = COPY.coach.publish;
  const session = getSession(id);
  if (!session) { window.location.hash = '#/coach/sessions'; return; }
  const withReport = session.squad.filter((pid) => getReportFor(id, pid)).length;
  const without = session.squad.length - withReport;

  const app = document.getElementById('app');
  function renderConfirm() {
    const screen = h('div', { class: 'screen' },
      AppHeader({ title: C.title, back: `#/coach/reports/${id}` }),
      h('div', { class: 'body' },
        h('div', { class: 'publish-stat' },
          h('div', { class: 'ps-big' }, String(withReport)),
          h('div', { class: 'ps-lbl' }, `rapport${withReport > 1 ? 's' : ''} à envoyer`)),
        without > 0 ? h('p', { class: 'hint center mt12' }, `${without} joueur${without > 1 ? 's' : ''} sans retour ce match — aucun rapport ne sera envoyé pour eux.`) : null,
        h('button', { class: 'btn mt24', onClick: publish }, h('span', { html: ICON.arrow }), C.confirm),
        h('a', { class: 'btn btn-ghost mt12', href: `#/coach/reports/${id}` }, COPY.common.cancel),
      ),
    );
    mount(screen);
  }
  function publish() {
    store.setStatus(id, 'published');
    const screen = h('div', { class: 'screen' },
      AppHeader({}),
      h('div', { class: 'success' },
        h('div', { class: 'success-circle', html: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#02562d" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' }),
        h('h2', { class: 'h2', style: { fontSize: '22px' } }, C.successTitle),
        h('p', { class: 'hint center', style: { maxWidth: '30ch' } }, C.successBody),
        h('a', { class: 'btn mt24', href: '#/coach/sessions', style: { width: 'auto', padding: '15px 26px' } }, C.backToSessions),
      ),
    );
    mount(screen);
  }
  renderConfirm();
}
