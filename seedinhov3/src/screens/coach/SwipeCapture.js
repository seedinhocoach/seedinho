/* SwipeCapture — #/coach/capture?s=:id. Écran 1 du flow "swipe joueur par joueur".
 * Une carte plein écran par joueur : photo, nom, numéro. Micro central.
 * Après enregistrement : transcript brut éditable (tap sur un mot). "Suivant"
 * (bouton + swipe) sans jamais attendre la structuration (tâche de fond).
 * "Passer" discret. Barre de progression "Joueur n/N". */
import { h, mount, ICON, formatClock } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { capture } from '../../lib/captureStore.js';
import { voice } from '../../lib/voice.js';
import { CAPTURE_PHOTO } from '../../data/captureSquad.js';
const posLabel = (p) => ({ GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }[p] || 'Joueur');

export function SwipeCapture(params) {
  const sessionId = params.s || 's3';
  const squad = capture.squad;
  let idx = 0;            // index du joueur courant
  let recState = 'idle';  // idle | recording | done
  let seconds = 0, timer = null;

  const host = h('div', { class: 'swipe-host' });

  function goNext() {
    voice.stop(); clearInterval(timer);
    if (idx < squad.length - 1) { idx += 1; recState = 'idle'; seconds = 0; render(); }
    else { window.location.hash = `#/coach/capture-review/${sessionId}`; }
  }

  // Édition légère : tap sur un mot -> devient un input inline.
  function editableTranscript(id) {
    const s = capture.get(id);
    const wrap = h('div', { class: 'transcript-edit' });
    const build = () => {
      const words = (s.transcript || '').split(/(\s+)/);
      wrap.replaceChildren(...words.map((w) => {
        if (!w.trim()) return document.createTextNode(w);
        const span = h('span', { class: 'tw', title: 'Toucher pour corriger' }, w);
        span.onclick = () => {
          const inp = h('input', { class: 'tw-input', value: w });
          span.replaceWith(inp); inp.focus(); inp.select();
          const commit = () => {
            const words2 = (s.transcript || '').split(/(\s+)/);
            // remplace la première occurrence exacte
            const i = words2.indexOf(w);
            if (i > -1) { words2[i] = inp.value; capture.editTranscript(id, words2.join('')); }
            build();
          };
          inp.onblur = commit;
          inp.onkeydown = (e) => { if (e.key === 'Enter') commit(); };
        };
        return span;
      }));
    };
    build();
    return wrap;
  }

  function render() {
    const p = squad[idx];
    const s = capture.get(p.id);

    // Barre de progression discrète
    const bar = h('div', { class: 'cap-progress' },
      h('span', { class: 'cap-count' }, `Joueur ${idx + 1}/${squad.length}`),
      h('div', { class: 'cap-track' }, h('i', { style: { width: Math.round((idx + 1) / squad.length * 100) + '%' } })));

    // Carte joueur plein écran
    const card = h('div', { class: 'player-card' },
      h('div', { class: 'pc-photo' }, h('img', { src: CAPTURE_PHOTO(p.id), alt: '' }),
        h('span', { class: 'pc-num' }, String(p.number))),
      h('div', { class: 'pc-id' },
        h('span', { class: 'pc-name' }, `${p.firstName} ${p.lastName}`),
        h('span', { class: 'pc-pos' }, posLabel(p.position))),
    );

    // Micro + timer
    const timerEl = h('div', { class: 'cap-timer' + (seconds > 20 ? ' over' : '') }, formatClock(seconds), h('span', { class: 'cap-hint-t' }, ' / ~0:20'));
    const mic = h('button', { class: 'mic' + (recState === 'recording' ? ' rec' : ''), 'aria-label': 'Enregistrer', html: recState === 'recording' ? ICON.stop : ICON.mic });
    const stopRec = () => {
      if (recState !== 'recording') return;
      clearInterval(timer); voice.stop();
      capture.record(p.id, seconds || 12);
      recState = 'done';
      render();
    };
    mic.onclick = () => {
      if (recState === 'idle') {
        recState = 'recording';
        timer = setInterval(() => { seconds += 1; timerEl.textContent = formatClock(seconds); timerEl.appendChild(h('span', { class: 'cap-hint-t' }, ' / ~0:20')); if (seconds > 20) timerEl.classList.add('over'); }, 1000);
        render();
        // Démo : la voix du coach lit le débrief de ce joueur, puis l'enregistrement s'arrête seul.
        voice.speak(capture.get(p.id)._mock.transcript, stopRec);
      } else if (recState === 'recording') {
        stopRec();
      }
    };

    const recorder = h('div', { class: 'cap-recorder' },
      recState !== 'done' ? timerEl : null,
      mic,
      h('p', { class: 'cap-mic-hint' }, recState === 'recording' ? "🎙 Le coach parle… (voix de démo) — touche pour arrêter." : (recState === 'idle' ? "Touche le micro et parle de ce joueur." : "Enregistré ✓")),
      recState === 'idle' ? h('p', { class: 'cap-tip' }, h('span', { html: ICON.debrief }), 'Astuce : donne les notes à la voix (« technique 4, mental 5 ») — elles remplissent le radar.') : null,
    );

    // Après enregistrement : transcription brute éditable + statut fond
    const afterRec = recState === 'done' ? h('div', { class: 'cap-after' },
      h('div', { class: 'cap-after-head' },
        h('span', { class: 'eyebrow' }, 'Transcription (brute)'),
        h('span', { class: 'proc-chip' }, h('span', { class: 'proc-dot' }), 'Structuration en tâche de fond')),
      editableTranscript(p.id),
      h('p', { class: 'hint mt8' }, 'Touche un mot pour le corriger. Tu peux passer au suivant sans attendre.'),
    ) : null;

    // Actions : Suivant (proéminent) + Passer (discret)
    const actions = h('div', { class: 'cap-actions' },
      recState === 'done'
        ? h('button', { class: 'btn', onClick: goNext }, idx < squad.length - 1 ? 'Joueur suivant' : 'Terminer', h('span', { html: ICON.arrow }))
        : h('button', { class: 'btn', disabled: recState === 'recording' ? null : 'true', onClick: recState === 'recording' ? () => mic.onclick() : null }, 'Enregistre pour continuer'),
      h('button', { class: 'skip-link', onClick: () => { capture.skip(p.id); goNext(); } }, 'Rien à dire sur lui — passer'),
    );

    const screen = h('div', { class: 'screen cap-screen', ontouchstart: onTouchStart, ontouchend: onTouchEnd },
      AppHeader({ title: 'Débrief', back: '#/coach/sessions' }),
      h('div', { class: 'body cap-body' }, bar, card, recorder, afterRec, actions),
    );
    mount(screen);
  }

  // Swipe horizontal -> suivant (seulement si enregistré ou passé possible)
  let tx0 = null;
  function onTouchStart(e) { tx0 = e.changedTouches[0].clientX; }
  function onTouchEnd(e) {
    if (tx0 == null) return;
    const dx = e.changedTouches[0].clientX - tx0; tx0 = null;
    if (dx < -60 && recState === 'done') goNext();
  }

  capture.reset();  // repart d'un débrief neuf à chaque entrée dans le flow
  render();
}
