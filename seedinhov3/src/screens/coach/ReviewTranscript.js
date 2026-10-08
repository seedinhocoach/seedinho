/* ReviewTranscript — #/coach/review/:id. Écran de validation après transcription :
 *  1. mini lecteur de l'audio du débrief (source unique des rapports)
 *  2. transcription : segments à faible confiance surlignés et éditables,
 *     (ré)attribution du joueur, suppression
 *  3. pour chaque joueur présent : le rapport généré + radar AJUSTABLE (sliders)
 *  4. CTA final « Valider et envoyer aux joueurs »
 * CTA bloqué tant qu'un segment n'est pas attribué. */
import { h, mount, ICON, formatClock } from '../../lib/dom.js';
import { AppHeader, AudioPlayer, PlayerAvatar, SourceLink, fullName, positionLabel } from '../../components/Shared.js';
import { AdjustableRadar } from '../../components/AdjustableRadar.js';
import { COPY } from '../../data/copy.js';
import { store } from '../../lib/store.js';
import { getSession, getPlayer, getReportFor, FIELD_AXES, GK_AXES } from '../../data/mockData.js';

export function ReviewTranscript({ id }) {
  const C = COPY.coach.review;
  const session = getSession(id);
  if (!session) { window.location.hash = '#/coach/sessions'; return; }

  const counterEl = h('span', { class: 'review-count' });
  const cta = h('button', { class: 'btn' });
  const list = h('div', { class: 'stack' });
  const squadPlayers = session.squad.map(getPlayer);

  function refresh() {
    const n = store.reviewCount(id);
    counterEl.replaceChildren(document.createTextNode(n > 0 ? C.counter(n) : C.allGood));
    counterEl.className = 'review-count ' + (n > 0 ? 'warn' : 'ok');
    const ready = store.allAssigned(id);
    cta.disabled = !ready;
    cta.replaceChildren(...[document.createTextNode(ready ? C.cta : C.blockedCta), ready ? h('span', { html: ICON.arrow }) : null].filter(Boolean));
    list.replaceChildren(...store.segments(id).map(segmentCard));
  }

  function segmentCard(seg) {
    const low = seg.needsReview || seg.playerId == null;
    const textarea = h('textarea', { value: seg.text, oninput: (e) => store.updateSegment(id, seg.id, { text: e.target.value }) });
    const select = h('select', { class: 'field select', onChange: (e) => { store.updateSegment(id, seg.id, { playerId: e.target.value || null }); refresh(); } },
      h('option', { value: '' }, C.unassigned),
      ...squadPlayers.map((p) => h('option', { value: p.id, selected: p.id === seg.playerId ? 'selected' : null }, `#${p.shirtNumber} ${p.firstName}`)),
    );
    return h('div', { class: 'segment' + (seg.playerId == null ? ' low' : (seg.needsReview ? ' warn' : '')) },
      h('div', { class: 'seg-head' },
        h('span', { class: 'seg-time' }, `${formatClock(seg.startSec)} – ${formatClock(seg.endSec)}`),
        low ? h('span', { class: 'conf low' }, C.needsReview) : h('span', { class: 'conf ok' }, `${Math.round(seg.confidence * 100)}%`)),
      textarea,
      h('div', { class: 'seg-assign' }, h('span', { class: 'formlabel', style: { margin: '0 8px 0 0' } }, C.assignPlayer), select),
      h('div', { class: 'seg-actions' },
        h('button', { class: 'btn btn-ghost btn-sm', onClick: () => { store.removeSegment(id, seg.id); refresh(); } }, C.deleteSeg)),
    );
  }

  // Rapports générés (draft) — un bloc par joueur, radar ajustable.
  const reportBlocks = squadPlayers.map((p) => {
    const report = getReportFor(id, p.id);
    if (!report) return null;
    const isGk = p.position === 'GK';
    const keys = isGk ? GK_AXES : FIELD_AXES;
    const base = isGk ? report.gkAxes : report.axes;
    return h('div', { class: 'card report-block' },
      h('div', { class: 'rb-head' }, PlayerAvatar(p, 44),
        h('div', null, h('div', { class: 'name' }, fullName(p)), h('div', { class: 'sub' }, positionLabel(p.position)))),
      AdjustableRadar({ reportId: report.id, baseAxes: base, previous: report.previousAxes, keys }),
      report.strengths.length ? h('div', { class: 'mt12' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 8px' } }, C.strengthsShort),
        ...report.strengths.map((s) => h('div', { class: 'axis-item' },
          h('div', { class: 'ai-top' }, h('span', { class: 'ai-dot good' }), h('p', { class: 'ai-text' }, s.text)),
          SourceLink(s.sourceSegmentId, COPY.coach.report.source)))) : null,
      report.improvements.length ? h('div', { class: 'mt12' },
        h('p', { class: 'eyebrow', style: { margin: '0 0 8px' } }, C.improvementsShort),
        ...report.improvements.map((s) => h('div', { class: 'axis-item' },
          h('div', { class: 'ai-top' }, h('span', { class: 'ai-dot work' }), h('p', { class: 'ai-text' }, s.text)),
          SourceLink(s.sourceSegmentId, COPY.coach.report.source)))) : null,
    );
  }).filter(Boolean);

  const emptyPlayers = squadPlayers.filter((p) => !getReportFor(id, p.id));

  cta.onclick = () => {
    if (!store.allAssigned(id)) return;
    store.setStatus(id, 'published');
    window.location.hash = `#/coach/publish/${id}`;
  };

  const hasSegments = store.segments(id).length > 0;
  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/coach/sessions' }),
    h('div', { class: 'body pad-nav' },
      // 1. Audio source
      h('p', { class: 'eyebrow', style: { margin: '0 0 8px' } }, C.audioLabel),
      AudioPlayer(id, { label: 'Source des rapports' }),
      // 2. Transcription
      h('p', { class: 'eyebrow', style: { margin: '22px 0 8px' } }, C.transcriptLabel),
      h('div', { class: 'review-head' }, counterEl),
      hasSegments ? list : h('p', { class: 'hint' }, C.empty),
      // 3. Rapports générés + radar ajustable
      reportBlocks.length ? h('div', null,
        h('p', { class: 'eyebrow', style: { margin: '24px 0 10px' } }, C.reportsLabel),
        h('div', { class: 'stack' }, ...reportBlocks)) : null,
      emptyPlayers.length ? h('p', { class: 'hint mt12' }, `${emptyPlayers.map((p) => p.firstName).join(', ')} : rien n'a été dit — aucun rapport (à valider tel quel).`) : null,
    ),
    hasSegments ? h('div', { class: 'sticky-cta' }, cta) : null,
  );
  mount(screen);
  if (hasSegments) refresh();
}
