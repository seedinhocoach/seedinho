/* RecordDebrief — #/coach/record?s=:id. Enregistrement : micro, chrono,
 * waveform, pause/reprise/stop, ré-écoute, import fichier. Garde-fou < 30 s. */
import { h, mount, ICON, formatClock } from '../../lib/dom.js';
import { AppHeader } from '../../components/Shared.js';
import { COPY } from '../../data/copy.js';
import { store } from '../../lib/store.js';
import { DEMO_AUDIO_URL } from '../../data/mockData.js';

export function RecordDebrief(params) {
  const C = COPY.coach.record;
  const sessionId = params.s || 's2';
  let state = 'idle'; // idle | recording | paused | stopped
  let seconds = 0, timer = null;

  const timerEl = h('div', { class: 'timer' }, '0:00');
  const hint = h('p', { class: 'hint center', style: { maxWidth: '32ch' } }, C.hintIdle);
  const errEl = h('p', { class: 'err-text center', style: { display: 'none' } }, C.tooShort);
  const wave = h('div', { class: 'wave' }, ...Array.from({ length: 25 }, (_, i) => h('i', { style: { height: (16 + (i % 6) * 12) + '%', animationDelay: (i * 0.04).toFixed(2) + 's', animationPlayState: 'paused' } })));
  const mic = h('button', { class: 'mic', 'aria-label': 'Micro', html: ICON.mic });
  const controls = h('div', { class: 'rec-controls' });

  const setWave = (run) => wave.querySelectorAll('i').forEach((b) => { b.style.animationPlayState = run ? 'running' : 'paused'; });

  function render() {
    mic.className = 'mic' + (state === 'recording' ? ' rec' : '');
    mic.innerHTML = state === 'recording' ? ICON.stop : ICON.mic;
    setWave(state === 'recording');
    if (state === 'idle') { hint.textContent = C.hintIdle; controls.replaceChildren(); }
    else if (state === 'recording') { hint.textContent = C.hintRec; controls.replaceChildren(); }
    else if (state === 'stopped') {
      hint.textContent = '';
      controls.replaceChildren(
        h('button', { class: 'btn btn-ghost', onClick: () => {} }, h('span', { html: ICON.mic }), C.review),
        h('button', { class: 'btn', onClick: send }, h('span', { html: ICON.arrow }), C.send),
      );
    }
  }

  function send() {
    if (seconds < 30) { errEl.style.display = 'block'; return; }
    // Conserve l'audio du débrief : source unique réutilisée tout au long du parcours.
    store.setAudio(sessionId, DEMO_AUDIO_URL, seconds);
    window.location.hash = `#/coach/processing/${sessionId}`;
  }

  mic.onclick = () => {
    if (state === 'idle' || state === 'paused') {
      state = 'recording';
      timer = setInterval(() => { seconds += 1; timerEl.textContent = formatClock(seconds); }, 1000);
    } else if (state === 'recording') {
      clearInterval(timer); state = 'stopped'; errEl.style.display = 'none';
    }
    render();
  };

  const fileInput = h('input', { type: 'file', accept: 'audio/*', style: { display: 'none' }, onChange: (e) => {
    const f = e.target.files && e.target.files[0];
    store.setAudio(sessionId, f ? URL.createObjectURL(f) : DEMO_AUDIO_URL, 141);
    window.location.hash = `#/coach/processing/${sessionId}`;
  } });

  const screen = h('div', { class: 'screen' },
    AppHeader({ title: C.title, back: '#/coach/new' }),
    h('div', { class: 'body', style: { display: 'flex', flexDirection: 'column' } },
      h('div', { class: 'recorder' }, timerEl, wave, mic, hint, errEl, controls),
      h('div', { class: 'divider' }),
      h('button', { class: 'btn btn-ghost', onClick: () => fileInput.click() }, h('span', { html: ICON.upload }), C.importAudio),
      fileInput,
    ),
  );
  mount(screen);
  render();
}
