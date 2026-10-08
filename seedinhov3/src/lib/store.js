/* ============================================================================
 * src/lib/store.js — état de démo en mémoire (remplace le backend).
 * Gère la machine à états d'une session et les copies de travail des segments.
 *
 * Machine à états d'une session :
 *   to_debrief → processing → to_review → reports_ready → published
 * ==========================================================================*/
import { MOCK_DATA, getTranscript, DEMO_AUDIO_URL } from '../data/mockData.js';

const statusById = Object.fromEntries(MOCK_DATA.sessions.map((s) => [s.id, s.status]));
// Copies de travail des segments (édition/attribution pendant la validation).
const segmentsById = {};
for (const t of MOCK_DATA.transcripts) segmentsById[t.sessionId] = t.segments.map((s) => ({ ...s }));
// Mots du coach ajoutés manuellement (par sessionId+playerId).
const coachNotes = {};
// Audio du débrief enregistré, conservé pour toute la démo (par sessionId).
const audioBySession = {};
// Ajustements manuels du radar par le coach (par reportId).
const radarOverrides = {};

export const store = {
  status(sessionId) { return statusById[sessionId]; },
  setStatus(sessionId, status) { statusById[sessionId] = status; },

  // --- Audio du débrief (source unique des rapports) ---
  setAudio(sessionId, url, durationSec) { audioBySession[sessionId] = { url, durationSec }; },
  getAudio(sessionId) { return audioBySession[sessionId] || { url: DEMO_AUDIO_URL, durationSec: (MOCK_DATA.sessions.find((s) => s.id === sessionId) || {}).audioDurationSec || 0 }; },

  // --- Radar ajustable (override manuel du coach) ---
  getRadar(reportId, fallback) { return radarOverrides[reportId] ? { ...radarOverrides[reportId] } : { ...fallback }; },
  setRadarAxis(reportId, fallback, key, value) {
    if (!radarOverrides[reportId]) radarOverrides[reportId] = { ...fallback };
    radarOverrides[reportId][key] = Math.max(0, Math.min(100, value));
    return radarOverrides[reportId];
  },

  segments(sessionId) { return segmentsById[sessionId] || (segmentsById[sessionId] = getTranscript(sessionId).segments.map((s) => ({ ...s }))); },
  updateSegment(sessionId, segId, patch) {
    const seg = this.segments(sessionId).find((s) => s.id === segId);
    if (seg) {
      Object.assign(seg, patch);
      if ('playerId' in patch || 'text' in patch) seg.needsReview = seg.playerId == null;
    }
    return seg;
  },
  removeSegment(sessionId, segId) {
    segmentsById[sessionId] = this.segments(sessionId).filter((s) => s.id !== segId);
  },
  reviewCount(sessionId) { return this.segments(sessionId).filter((s) => s.needsReview || s.playerId == null).length; },
  allAssigned(sessionId) { return this.segments(sessionId).every((s) => s.playerId != null); },

  coachNoteKey(sessionId, playerId) { return sessionId + ':' + playerId; },
  getCoachNote(sessionId, playerId) { return coachNotes[this.coachNoteKey(sessionId, playerId)] || null; },
  setCoachNote(sessionId, playerId, text) { coachNotes[this.coachNoteKey(sessionId, playerId)] = text || null; },
};
