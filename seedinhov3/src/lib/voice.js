/* src/lib/voice.js — voix de démo (synthèse vocale du navigateur, fr-FR).
 * Simule le coach qui parle : lit le verbatim mocké d'un joueur. */
let frVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = window.speechSynthesis.getVoices();
  frVoice = vs.find((v) => /fr[-_]FR/i.test(v.lang) && /male|homme|thomas|paul|henri/i.test(v.name))
    || vs.find((v) => /^fr/i.test(v.lang)) || null;
  return frVoice;
}
if ('speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export const voice = {
  available() { return 'speechSynthesis' in window; },
  /** Lit `text` ; appelle onEnd à la fin (ou immédiatement si indisponible). */
  speak(text, onEnd) {
    if (!this.available() || !text) { if (onEnd) setTimeout(onEnd, 1500); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR'; u.rate = 1.05; u.pitch = 0.9;
    if (frVoice || pickVoice()) u.voice = frVoice;
    u.onend = () => onEnd && onEnd();
    u.onerror = () => onEnd && onEnd();
    window.speechSynthesis.speak(u);
  },
  stop() { if (this.available()) window.speechSynthesis.cancel(); },
  speaking() { return this.available() && window.speechSynthesis.speaking; },
};
