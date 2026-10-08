/* ============================================================================
 * src/components/Shared.js — composants réutilisables (PascalCase).
 *   AppHeader, RoleTabbar, StatusBadge, PlayerAvatar, MatchHeader,
 *   SourceLink + openSourceSheet (affiche le verbatim source),
 *   SegmentRow (validation), helpers fullName / positionLabel.
 * ==========================================================================*/
import { h, ICON, formatClock } from '../lib/dom.js';
import { COPY } from '../data/copy.js';
import { PLAYER_PHOTOS, getSegment, getPlayer } from '../data/mockData.js';
import { store } from '../lib/store.js';

export const fullName = (p) => `${p.firstName} ${p.lastName}`;
export const positionLabel = (pos) => ({ GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }[pos] || 'Joueur');

/** Bouton pilule de bascule de démo (header) — seul pont entre les 2 espaces.
 * `to` = 'coach' | 'player' : l'espace vers lequel basculer. */
export function RoleSwitchPill(to) {
  const isCoach = to === 'coach';
  const href = isCoach ? '#/coach/sessions' : '#/player/home';
  const label = isCoach ? 'Mode coach' : 'Mode joueur';
  const icon = isCoach
    ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>'
    : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/></svg>';
  return h('a', { class: 'switchpill', href, 'aria-label': 'Démo — passer en ' + label },
    h('span', { class: 'sp-badge' }, 'Démo'),
    h('span', { html: icon }),
    h('span', { class: 'sp-label' }, label),
  );
}

/** Barre supérieure. `back` = hash de retour. `right` = node optionnel. */
export function AppHeader({ title, back, right } = {}) {
  return h('header', { class: 'appbar' },
    back
      ? h('button', { class: 'iconbtn', 'aria-label': COPY.common.back, html: ICON.back, onClick: () => { window.location.hash = back; } })
      : h('img', { class: 'logo', src: 'assets/logo-text-green.svg', alt: COPY.brand }),
    title ? h('span', { class: 'title', style: { marginLeft: back ? '4px' : '10px' } }, title) : null,
    h('span', { class: 'spacer' }),
    right || null,
  );
}

/** Barre de navigation basse — ESPACE COACH : Débriefs · Effectif · Réglages. */
export function CoachTabbar(active) {
  return h('nav', { class: 'tabbar', 'aria-label': 'Navigation coach' },
    h('a', { href: '#/coach/sessions', class: active === 'sessions' ? 'active' : '' }, h('span', { html: ICON.debrief }), 'Débriefs'),
    h('a', { href: '#/coach/squad', class: active === 'squad' ? 'active' : '' }, h('span', { html: ICON.squad }), 'Effectif'),
    h('a', { href: '#/coach/settings', class: active === 'settings' ? 'active' : '' }, h('span', { html: ICON.gear }), 'Réglages'),
  );
}

/** Barre de navigation basse — ESPACE JOUEUR : Mes rapports · Ma progression. */
export function PlayerTabbar(active) {
  return h('nav', { class: 'tabbar', 'aria-label': 'Navigation joueur' },
    h('a', { href: '#/player/home', class: active === 'home' ? 'active' : '' }, h('span', { html: ICON.reports }), 'Mes rapports'),
    h('a', { href: '#/player/progress', class: active === 'progress' ? 'active' : '' }, h('span', { html: ICON.chart }), 'Ma progression'),
  );
}

/** Sélecteur de démo pour basculer coach ↔ joueur (présentation uniquement). */
export function DemoRoleSwitch(active) {
  return h('div', { class: 'roleswitch' },
    h('a', { href: '#/coach/sessions', class: 'rs-btn' + (active === 'coach' ? ' on' : '') }, 'Espace coach'),
    h('a', { href: '#/player/home', class: 'rs-btn' + (active === 'player' ? ' on' : '') }, 'Espace joueur'),
  );
}

/** Pastille de statut d'une session (parcours coach). */
export function StatusBadge(status) {
  const cls = { published: 'pill-ready', reports_ready: 'pill-ready', to_review: 'pill-pending', processing: 'pill-pending', to_debrief: 'pill-draft' }[status] || 'pill-draft';
  return h('span', { class: 'pill ' + cls }, h('span', { class: 'dot', style: { background: 'currentColor' } }), COPY.coach.sessions.statusLabel[status]);
}

/** Avatar rond photo + numéro de maillot (toujours une photo). */
export function PlayerAvatar(player, size = 48) {
  const photo = PLAYER_PHOTOS[player.id] || 'assets/players/lucas.png';
  return h('div', { style: { position: 'relative', flex: 'none' } },
    h('div', { class: 'avatar', style: { width: size + 'px', height: size + 'px' } },
      h('img', { src: photo, alt: '' })),
    h('span', { class: 'num-badge' }, String(player.shirtNumber)),
  );
}

/**
 * Mini lecteur audio (play/pause + waveform + durée) — le débrief enregistré,
 * source unique des rapports. Réutilisé sur validation et détail de rapport.
 */
export function AudioPlayer(sessionId, { label } = {}) {
  const { url, durationSec } = store.getAudio(sessionId);
  const audio = h('audio', { src: url, preload: 'metadata' });
  const bars = Array.from({ length: 28 }, (_, i) => h('i', { style: { height: (18 + (i % 7) * 11) + '%' } }));
  const wave = h('div', { class: 'mini-wave' }, ...bars);
  const timeEl = h('span', { class: 'mp-time' }, formatClock(durationSec));
  const btn = h('button', { class: 'mp-play', 'aria-label': 'Lecture', html: ICON.play });
  let playing = false;
  const setBars = (on) => wave.querySelectorAll('i').forEach((b) => { b.style.animationPlayState = on ? 'running' : 'paused'; });
  btn.onclick = () => {
    if (audio.paused) { audio.play().catch(() => {}); }
    else audio.pause();
  };
  audio.addEventListener('play', () => { playing = true; btn.innerHTML = ICON.pause; wave.classList.add('live'); setBars(true); });
  audio.addEventListener('pause', () => { playing = false; btn.innerHTML = ICON.play; setBars(false); });
  audio.addEventListener('ended', () => { btn.innerHTML = ICON.play; wave.classList.remove('live'); setBars(false); });
  audio.addEventListener('timeupdate', () => { timeEl.textContent = formatClock(audio.currentTime) + ' / ' + formatClock(durationSec); });
  return h('div', { class: 'audioplayer' },
    btn, wave,
    h('div', { class: 'mp-meta' }, timeEl, h('span', { class: 'mp-src' }, label || 'Débrief du coach')),
    audio,
  );
}

/** En-tête de match : adversaire + score + domicile/extérieur. */
export function MatchHeader(session) {
  const [gf, ga] = (session.score || '–-–').split('-');
  return h('div', { class: 'matchhead' },
    h('div', { class: 'mh-teams' },
      h('span', { class: 'mh-club' }, 'Montreuil'),
      h('span', { class: 'mh-score' }, session.score || '– : –'),
      h('span', { class: 'mh-club' }, session.opponent),
    ),
    h('div', { class: 'mh-meta' }, `${session.location === 'home' ? 'Domicile' : 'Extérieur'} · ${new Date(session.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`),
  );
}

/* ------------------------- Verbatim source (traçabilité) ------------------ */
/** Lien "voir ce que le coach a dit" → ouvre une feuille avec le verbatim. */
export function SourceLink(segmentId, label) {
  return h('button', { class: 'sourcelink', onClick: () => openSourceSheet(segmentId) },
    h('span', { html: ICON.quote }), label);
}

/** Feuille modale affichant le segment exact du coach. */
export function openSourceSheet(segmentId) {
  const seg = getSegment(segmentId);
  const player = seg && seg.playerId ? getPlayer(seg.playerId) : null;
  const close = () => overlay.remove();
  const clock = (s) => { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const sheet = h('div', { class: 'sheet', onClick: (e) => e.stopPropagation() },
    h('div', { class: 'sheet-grab' }),
    h('p', { class: 'eyebrow', style: { marginBottom: '10px' } }, COPY.coach.report.sourceLabel),
    h('div', { class: 'sheet-quote' },
      h('span', { html: ICON.quote }),
      h('p', null, seg ? `« ${seg.text} »` : 'Segment introuvable.')),
    seg ? h('p', { class: 'hint', style: { marginTop: '10px' } }, `${player ? player.firstName + ' · ' : ''}${clock(seg.startSec)} – ${clock(seg.endSec)}`) : null,
    h('button', { class: 'btn btn-ghost', style: { marginTop: '18px' }, onClick: close }, COPY.common.done),
  );
  const overlay = h('div', { class: 'overlay', onClick: close }, sheet);
  document.body.appendChild(overlay);
}
