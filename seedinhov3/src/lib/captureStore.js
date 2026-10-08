/* ============================================================================
 * src/lib/captureStore.js — état local du flow "swipe" (démo, en mémoire).
 * Détient l'état par joueur et simule la structuration en tâche de fond :
 * le coach passe au joueur suivant sans jamais attendre.
 * ==========================================================================*/
import { CAPTURE_SQUAD, CAPTURE_MOCK } from '../data/captureSquad.js';

function seed() {
  const byId = {};
  for (const p of CAPTURE_SQUAD) {
    const m = CAPTURE_MOCK[p.id] || {};
    byId[p.id] = {
      recorded: false,
      skipped: false,
      transcript: '',              // rempli à l'enregistrement (verbatim brut, éditable)
      status: 'idle',              // idle | processing | ready
      viewed: false,               // ouvert au moins une fois sur l'écran 2
      durationSec: 0,
      _mock: m,
    };
  }
  return byId;
}

let state = seed();
const timers = {};

export const capture = {
  squad: CAPTURE_SQUAD,
  get(id) { return state[id]; },
  all() { return CAPTURE_SQUAD.map((p) => ({ player: p, ...state[id_(p)] })); },

  /** Enregistrement terminé pour un joueur : transcript brut + structuration en fond. */
  record(id, durationSec) {
    const s = state[id];
    s.recorded = true; s.skipped = false; s.durationSec = durationSec || 0;
    s.transcript = s._mock.transcript || '';
    s.status = 'processing';
    clearTimeout(timers[id]);
    // Structuration en tâche de fond (le coach n'attend pas). ~ selon le mock.
    const delay = s._mock.proc === 'processing' ? 9000 : 2500;
    timers[id] = setTimeout(() => { s.status = 'ready'; }, delay);
  },
  editTranscript(id, text) { state[id].transcript = text; },
  skip(id) { const s = state[id]; s.skipped = true; s.recorded = false; s.status = 'idle'; },
  unskip(id) { state[id].skipped = false; },

  markViewed(id) { state[id].viewed = true; },
  reset() { state = seed(); },

  /** Démo coachs : chaque rapport enregistré est considéré validé. */
  validateAll() { for (const id of this.activeIds()) { state[id].viewed = true; state[id].status = 'ready'; } },

  /** Joueurs concernés par la validation (enregistrés, non passés). */
  activeIds() { return CAPTURE_SQUAD.filter((p) => state[p.id].recorded && !state[p.id].skipped).map((p) => p.id); },
  allViewed() {
    // Démo : validation non bloquante dès qu'au moins un rapport existe.
    return this.activeIds().length > 0;
  },
};

function id_(p) { return p.id; }
