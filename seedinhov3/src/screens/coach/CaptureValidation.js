/* CaptureValidation — #/coach/capture-review/:id. Écran 2 du flow "swipe".
 * File de cartes (une par joueur enregistré) : rapport structuré + radar
 * ajustable. Contraste net haute confiance (validation 1 tap) vs basse
 * confiance / ⟦non résolu⟧ (mis en avant, invite à relire). Ré-écoute audio,
 * ré-enregistrement par joueur. CTA global désactivé tant que chaque carte
 * n'a pas été ouverte au moins une fois. */
import { h, mount, ICON, formatClock } from '../../lib/dom.js';
import { AppHeader, PlayerAvatar } from '../../components/Shared.js';
import { RadarChart } from '../../components/RadarChart.js';
import { capture } from '../../lib/captureStore.js';
import { voice } from '../../lib/voice.js';
import { CAPTURE_PHOTO, axisKeys } from '../../data/captureSquad.js';
import { COPY } from '../../data/copy.js';
import { DEMO_AUDIO_URL } from '../../data/mockData.js';

const posLabel = (p) => ({ GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }[p] || 'Joueur');

export function CaptureValidation({ id }) {
  const ids = capture.activeIds();
  let openId = null;              // carte dépliée
  const radarValues = {};        // ajustements par joueur

  const host = h('div', { class: 'stack' });
  const cta = h('button', { class: 'btn' });

  function refreshCta() {
    const ready = capture.allViewed();
    cta.disabled = ready ? null : 'true';
    cta.replaceChildren(...[document.createTextNode(ready ? 'Valider et envoyer aux joueurs' : 'Ouvre chaque rapport pour valider'), ready ? h('span', { html: ICON.arrow }) : null].filter(Boolean));
  }

  // Mini lecteur audio du clip du joueur (ré-écoute).
  function audioClip(pid) {
    // Démo : ré-écoute = la voix du coach relit le débrief de ce joueur.
    const btn = h('span', { class: 'clip-btn', html: ICON.play });
    let on = false;
    const done = () => { on = false; btn.innerHTML = ICON.play; };
    const toggle = () => {
      if (on) { voice.stop(); done(); return; }
      on = true; btn.innerHTML = ICON.pause;
      voice.speak(capture.get(pid).transcript || capture.get(pid)._mock.transcript, done);
    };
    return h('button', { class: 'clip-wrap', onClick: (e) => { e.stopPropagation(); toggle(); } }, btn, h('span', null, 'Ré-écouter le clip'));
  }

  function adjustableRadar(pid, p) {
    const keys = axisKeys(p.position);
    const mock = capture.get(pid)._mock;
    const base = mock.radar;
    const spoken = mock.spoken || {};                 // notes dictées à la voix (axe -> /5)
    if (!radarValues[pid]) {
      // Pré-remplissage : la note dictée prime sur la suggestion structurée.
      const seed = { ...base };
      for (const k in spoken) seed[k] = spoken[k] * 20; // /5 -> /100
      radarValues[pid] = seed;
    }
    const vals = radarValues[pid];
    const radarHost = h('div', { class: 'mt8' });
    const draw = () => radarHost.replaceChildren(RadarChart({ axes: normalize(vals), keys, labels: COPY.axesShort }));
    const sliders = keys.map((k) => {
      const dictated = k in spoken;
      return h('div', { class: 'axis-slider-row' },
        h('span', { class: 'as-key' }, COPY.axes[k],
          dictated ? h('span', { class: 'voice-tag', title: 'Note dictée à la voix' }, h('span', { html: ICON.debrief }), 'dictée') : null),
        h('input', { class: 'axis-slider' + (dictated ? ' dictated' : ''), type: 'range', min: '0', max: '100', step: '5', value: String(vals[k] ?? 0),
          'aria-label': COPY.axes[k], oninput: (e) => { vals[k] = Number(e.target.value); draw(); } }));
    });
    draw();
    const hasSpoken = Object.keys(spoken).length > 0;
    return h('div', null, radarHost, h('div', { class: 'axis-sliders' },
      hasSpoken ? h('div', { class: 'voice-banner' }, h('span', { html: ICON.debrief }), 'Notes reprises de ta voix dans le débrief — ajuste si besoin.') : null,
      h('p', { class: 'hint', style: { marginBottom: '10px' } }, 'Ajuste chaque axe — le radar se met à jour en direct. Les axes non évoqués restent neutres.'),
      ...sliders));
  }
  const normalize = (v) => { const o = {}; for (const k in v) o[k] = v[k] == null ? 0 : v[k]; return o; };

  function card(pid) {
    const p = capture.squad.find((x) => x.id === pid);
    const s = capture.get(pid);
    const processing = s.status === 'processing';
    const hasLow = s._mock.segments.some((seg) => seg.conf === 'low');
    const isOpen = openId === pid;

    const head = h('button', { class: 'vc-head', onClick: () => { if (!processing) { capture.markViewed(pid); openId = isOpen ? null : pid; render(); } } },
      h('span', { style: { position: 'relative', flex: 'none' } },
        h('span', { class: 'avatar', style: { width: '46px', height: '46px' } }, h('img', { src: CAPTURE_PHOTO(pid), alt: '' })),
        h('span', { class: 'num-badge' }, String(p.number))),
      h('span', { class: 'grow', style: { textAlign: 'left', minWidth: 0 } },
        h('span', { class: 'name' }, `${p.firstName} ${p.lastName}`),
        h('span', { class: 'sub' }, posLabel(p.position))),
      processing
        ? h('span', { class: 'proc-chip' }, h('span', { class: 'spinner-sm' }), 'Traitement…')
        : (s.viewed
            ? h('span', { class: 'pill pill-ready' }, h('span', { html: ICON.checkGreen }), 'Validé')
            : (hasLow ? h('span', { class: 'pill pill-pending' }, 'À relire') : h('span', { class: 'pill pill-ready' }, h('span', { class: 'dot', style: { background: 'currentColor' } }), 'Prêt'))),
    );

    if (processing) return h('div', { class: 'vcard proc' }, head, h('p', { class: 'hint', style: { padding: '0 14px 14px' } }, 'La structuration finit en tâche de fond — pas besoin d\u2019attendre pour les autres.'));
    if (!isOpen) return h('div', { class: 'vcard' + (hasLow ? ' has-low' : '') }, head);

    const segs = s._mock.segments.length
      ? s._mock.segments.map((seg) => h('div', { class: 'seg-line ' + (seg.conf === 'low' ? 'low' : 'high') },
          h('span', { class: 'seg-badge' }, seg.conf === 'low' ? 'À vérifier' : h('span', { html: ICON.checkGreen })),
          h('p', null, seg.text)))
      : [h('p', { class: 'hint' }, 'Aucun retour structuré.')];

    return h('div', { class: 'vcard open' + (hasLow ? ' has-low' : '') }, head,
      h('div', { class: 'vc-body' },
        hasLow ? h('div', { class: 'low-banner' }, h('span', { html: ICON.quote }), 'Un segment est incertain — relis ou ré-écoute avant de valider.') : null,
        audioClip(pid),
        h('p', { class: 'eyebrow mt12', style: { margin: '12px 0 8px' } }, 'Rapport structuré'),
        ...segs,
        h('p', { class: 'eyebrow', style: { margin: '16px 0 4px' } }, 'Radar suggéré'),
        adjustableRadar(pid, p),
        h('button', { class: 'btn btn-ghost btn-sm mt12', onClick: () => { window.location.hash = `#/coach/capture?s=${id}`; } },
          h('span', { html: ICON.mic }), 'Ré-enregistrer ce joueur'),
      ));
  }

  function render() {
    host.replaceChildren(...ids.map(card));
    refreshCta();
    const screen = h('div', { class: 'screen' },
      AppHeader({ title: 'Validation', back: `#/coach/capture?s=${id}` }),
      h('div', { class: 'body pad-nav' },
        h('p', { class: 'kicker' }, 'Relis avant d\u2019envoyer'),
        h('p', { class: 'hint', style: { marginBottom: '14px' } }, `${ids.length} rapports validés. Les segments incertains restent mis en avant ; ouvre une carte pour voir le détail.`),
        host),
      h('div', { class: 'sticky-cta' }, cta),
    );
    mount(screen);
  }

  cta.onclick = () => { voice.stop(); if (capture.allViewed()) window.location.hash = `#/coach/capture-done/${id}`; };
  capture.validateAll(); // démo coachs : tous les rapports validés d'office

  if (ids.length === 0) {
    mount(h('div', { class: 'screen' },
      AppHeader({ title: 'Validation', back: '#/coach/sessions' }),
      h('div', { class: 'empty' }, h('div', { class: 'circle', html: ICON.inbox }),
        h('p', { class: 'h2', style: { fontSize: '19px' } }, 'Aucun joueur enregistré'),
        h('a', { class: 'btn btn-ghost mt16', href: `#/coach/capture?s=${id}`, style: { width: 'auto', padding: '13px 22px' } }, 'Démarrer le débrief'))));
    return;
  }
  render();
}
