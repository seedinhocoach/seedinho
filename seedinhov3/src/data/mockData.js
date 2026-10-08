/* ============================================================================
 * src/data/mockData.js — SOURCE UNIQUE de données (à remplacer par une API).
 * Aucune donnée n'est dispersée dans les composants : l'UI lit tout ici via
 * les sélecteurs en bas de fichier.
 * Contexte : équipe U17 de foot amateur français. Verbatims crédibles.
 * ==========================================================================*/

export const MOCK_DATA = {
  coach: {
    id: 'c1', firstName: 'Karim', lastName: 'Benali',
    clubName: 'AS Montreuil FC', teamName: 'U17 A',
  },

  players: [
    { id: 'p1',  firstName: 'Lucas',   lastName: 'Mercier',  shirtNumber: 1,  position: 'GK',  birthYear: 2009, isMinor: true, guardianEmail: 'parent.mercier@email.fr' },
    { id: 'p2',  firstName: 'Rayan',   lastName: 'Haddad',   shirtNumber: 2,  position: 'DEF', birthYear: 2009, isMinor: true, guardianEmail: 'parent.haddad@email.fr' },
    { id: 'p3',  firstName: 'Enzo',    lastName: 'Fontaine', shirtNumber: 3,  position: 'DEF', birthYear: 2009, isMinor: true, guardianEmail: 'parent.fontaine@email.fr' },
    { id: 'p4',  firstName: 'Noah',    lastName: 'Girard',   shirtNumber: 4,  position: 'DEF', birthYear: 2010, isMinor: true, guardianEmail: 'parent.girard@email.fr' },
    { id: 'p5',  firstName: 'Gabriel', lastName: 'Roux',     shirtNumber: 5,  position: 'DEF', birthYear: 2010, isMinor: true, guardianEmail: 'parent.roux@email.fr' },
    { id: 'p6',  firstName: 'Malik',   lastName: 'Sylla',    shirtNumber: 6,  position: 'MID', birthYear: 2009, isMinor: true, guardianEmail: 'parent.sylla@email.fr' },
    { id: 'p7',  firstName: 'Théo',    lastName: 'Lambert',  shirtNumber: 7,  position: 'FWD', birthYear: 2009, isMinor: true, guardianEmail: 'parent.lambert@email.fr' },
    { id: 'p8',  firstName: 'Ibrahim', lastName: 'Traoré',   shirtNumber: 8,  position: 'MID', birthYear: 2009, isMinor: true, guardianEmail: 'parent.traore@email.fr' },
    { id: 'p9',  firstName: 'Adam',    lastName: 'Moreau',   shirtNumber: 9,  position: 'FWD', birthYear: 2010, isMinor: true, guardianEmail: 'parent.moreau@email.fr' },
    { id: 'p10', firstName: 'Mattéo',  lastName: 'Blanc',    shirtNumber: 10, position: 'MID', birthYear: 2009, isMinor: true, guardianEmail: 'parent.blanc@email.fr' },
    { id: 'p11', firstName: 'Younes',  lastName: 'Cherif',   shirtNumber: 11, position: 'FWD', birthYear: 2010, isMinor: true, guardianEmail: 'parent.cherif@email.fr' },
    { id: 'p12', firstName: 'Sami',    lastName: 'Delaunay', shirtNumber: 14, position: 'MID', birthYear: 2009, isMinor: true, guardianEmail: 'parent.delaunay@email.fr' },
    { id: 'p13', firstName: 'Hugo',    lastName: 'Perrin',   shirtNumber: 15, position: 'DEF', birthYear: 2010, isMinor: true, guardianEmail: 'parent.perrin@email.fr' },
    { id: 'p14', firstName: 'Nathan',  lastName: 'Faure',    shirtNumber: 16, position: 'GK',  birthYear: 2010, isMinor: true, guardianEmail: 'parent.faure@email.fr' },
    { id: 'p15', firstName: 'Ryan',    lastName: 'Dubois',   shirtNumber: 17, position: 'FWD', birthYear: 2009, isMinor: true, guardianEmail: 'parent.dubois@email.fr' },
    { id: 'p16', firstName: 'Elias',   lastName: 'Bonnet',   shirtNumber: 18, position: 'MID', birthYear: 2010, isMinor: true, guardianEmail: 'parent.bonnet@email.fr' },
  ],

  sessions: [
    { id: 's1', type: 'match', opponent: 'US Gévigny',     date: '2026-05-30', score: '2-1', location: 'home', audioDurationSec: 168,
      squad: ['p1','p2','p3','p4','p5','p6','p7','p8','p10','p12','p13'], status: 'published' },
    { id: 's2', type: 'match', opponent: 'AS Rignac',       date: '2026-06-06', score: '0-2', location: 'away', audioDurationSec: 152,
      squad: ['p1','p2','p4','p5','p6','p7','p8','p10','p11','p13','p15'], status: 'published' },
    { id: 's3', type: 'match', opponent: 'FC Salvagnac',    date: '2026-06-13', score: '3-3', location: 'home', audioDurationSec: 141,
      squad: ['p1','p2','p3','p6','p7','p8','p9','p10','p11','p12'], status: 'to_review' },
    { id: 's4', type: 'match', opponent: 'Espérance Naucelle', date: '2026-06-20', score: null, location: 'home', audioDurationSec: 0,
      squad: ['p1','p2','p4','p5','p6','p7','p8','p10','p11','p13','p15'], status: 'to_debrief' },
  ],

  transcripts: [
    // ---- s1 (publiée) : verbatims sources des rapports publiés ----
    { sessionId: 's1', segments: [
      { id: 's1-1', startSec: 5,  endSec: 15, playerId: 'p1', confidence: 0.95, needsReview: false,
        text: "Lucas dans les buts, gros match, deux arrêts qui nous gardent devant, il a bien commandé sa défense." },
      { id: 's1-2', startSec: 16, endSec: 27, playerId: 'p2', confidence: 0.9, needsReview: false,
        text: "Rayan à droite, solide défensivement, il a bien tenu son couloir, par contre il monte pas assez." },
      { id: 's1-3', startSec: 28, endSec: 40, playerId: 'p6', confidence: 0.92, needsReview: false,
        text: "Malik au milieu, énorme récupération, il gratte tous les ballons, faut juste qu'il lève un peu la tête après." },
      { id: 's1-4', startSec: 41, endSec: 52, playerId: 'p7', confidence: 0.88, needsReview: false,
        text: "Théo devant, il a mis le but, bonne activité, il presse bien le premier défenseur." },
      { id: 's1-5', startSec: 53, endSec: 63, playerId: 'p8', confidence: 0.9, needsReview: false,
        text: "Ibrahim box to box, il a couvert énormément de terrain, très juste techniquement." },
      { id: 's1-6', startSec: 64, endSec: 74, playerId: 'p4', confidence: 0.86, needsReview: false,
        text: "Noah en charnière, propre, il ressort bien les ballons, à l'aise sous pression." },
    ]},
    // ---- s2 (reports_ready) : transcript validé, sources des rapports en cours ----
    { sessionId: 's2', segments: [
      { id: 's2-1', startSec: 6,  endSec: 18, playerId: 'p1', confidence: 0.94, needsReview: false,
        text: "Lucas, bon match encore, sa sortie aérienne était nickel, le jeu au pied propre. Le choix de relance par contre, faut qu'il regarde mieux avant." },
      { id: 's2-2', startSec: 19, endSec: 30, playerId: 'p2', confidence: 0.91, needsReview: false,
        text: "Rayan, gros match, techniquement pas de souci, il a fait deux-trois débordements qui ont fait mal." },
      { id: 's2-3', startSec: 31, endSec: 43, playerId: 'p4', confidence: 0.89, needsReview: false,
        text: "Noah central, à l'aise au pied court et long, il s'est libéré du marquage plusieurs fois. À lui d'être décisif sur les coups de pied arrêtés." },
      { id: 's2-4', startSec: 44, endSec: 55, playerId: 'p5', confidence: 0.85, needsReview: false,
        text: "Gabriel joue un an au-dessus, à gauche, faut qu'il utilise beaucoup plus son pied gauche, mais il tient le poste." },
      { id: 's2-5', startSec: 56, endSec: 68, playerId: 'p6', confidence: 0.9, needsReview: false,
        text: "Malik a couru dans tous les sens, beaucoup d'énergie, mais il a perdu de l'utilité en fin de match, trop dispersé." },
      { id: 's2-6', startSec: 69, endSec: 80, playerId: 'p7', confidence: 0.87, needsReview: false,
        text: "Théo côté droit, beaucoup de ballons touchés, mais il manque le déséquilibre, faut qu'il ose le un-contre-un." },
      { id: 's2-7', startSec: 81, endSec: 93, playerId: 'p8', confidence: 0.92, needsReview: false,
        text: "Ibrahim, super match, box to box, il prend la profondeur, joue court et long, un vrai patron du milieu." },
      { id: 's2-8', startSec: 94, endSec: 104, playerId: 'p10', confidence: 0.88, needsReview: false,
        text: "Mattéo à côté, gros match aussi, très complémentaire avec Ibrahim, propre dans tout ce qu'il fait." },
      // p11 (Younes), p13 (Hugo) et p15 (Ryan) sont dans le squad mais NON cités => état vide.
    ]},
    // ---- s3 (to_review) : transcript brut, plusieurs segments à vérifier ----
    { sessionId: 's3', segments: [
      { id: 's3-1', startSec: 4,  endSec: 14, playerId: 'p1', confidence: 0.93, needsReview: false,
        text: "Lucas a fait ce qu'il fallait, rien à redire sur les trois buts encaissés." },
      { id: 's3-2', startSec: 15, endSec: 25, playerId: 'p6', confidence: 0.9, needsReview: false,
        text: "Malik, bon match au milieu, il a bien orienté le jeu." },
      { id: 's3-3', startSec: 26, endSec: 34, playerId: null, confidence: 0.52, needsReview: true,
        text: "euh… le numéro 9 là, enfin je crois que c'est… bon il a raté deux occasions faciles." },
      { id: 's3-4', startSec: 35, endSec: 46, playerId: 'p7', confidence: 0.7, needsReview: true,
        text: "Théo… ou Sami je sais plus qui était à droite, en tout cas ça a bien débordé côté droit." },
      { id: 's3-5', startSec: 47, endSec: 57, playerId: 'p8', confidence: 0.91, needsReview: false,
        text: "Ibrahim toujours aussi présent, il a égalisé sur la fin, mental de fou." },
      { id: 's3-6', startSec: 58, endSec: 66, playerId: null, confidence: 0.4, needsReview: true,
        text: "et puis y'a le petit… le 11, non le 10, bref il a beaucoup parlé sur le terrain, bon leader." },
    ]},
  ],

  reports: [
    // ===== s1 : rapports PUBLIÉS (premiers de saison, previousAxes = null) =====
    { id: 'r-s1-p1', sessionId: 's1', playerId: 'p1', status: 'published', publishedAt: '2026-05-31',
      axes: null, gkAxes: { HANDS: 74, DISTRIBUTION: 60, EXITS: 78, POSITIONING: 72, COMMUNICATION: 80, MENTAL: 76 }, previousAxes: null,
      strengths: [{ text: "Deux arrêts décisifs qui gardent l'équipe devant.", sourceSegmentId: 's1-1' },
                  { text: "Tu commandes bien ta défense, ça se sent.", sourceSegmentId: 's1-1' }],
      improvements: [], coachNote: null },
    { id: 'r-s1-p2', sessionId: 's1', playerId: 'p2', status: 'published', publishedAt: '2026-05-31',
      axes: { TECH: 62, VISION: 55, PHYS: 68, ATT: 40, DEF: 74, MENTAL: 64 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Solide défensivement, tu tiens bien ton couloir.", sourceSegmentId: 's1-2' }],
      improvements: [{ text: "Ose monter plus souvent pour peser devant.", sourceSegmentId: 's1-2' }], coachNote: null },
    { id: 'r-s1-p6', sessionId: 's1', playerId: 'p6', status: 'published', publishedAt: '2026-05-31',
      axes: { TECH: 60, VISION: 52, PHYS: 82, ATT: 48, DEF: 78, MENTAL: 70 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Récupération énorme, tu grattes tous les ballons.", sourceSegmentId: 's1-3' }],
      improvements: [{ text: "Lève la tête après la récupération pour mieux ressortir.", sourceSegmentId: 's1-3' }], coachNote: null },
    { id: 'r-s1-p7', sessionId: 's1', playerId: 'p7', status: 'published', publishedAt: '2026-05-31',
      axes: { TECH: 64, VISION: 58, PHYS: 66, ATT: 72, DEF: 42, MENTAL: 68 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Buteur du match, bonne activité, tu presses bien.", sourceSegmentId: 's1-4' }],
      improvements: [], coachNote: null },
    { id: 'r-s1-p8', sessionId: 's1', playerId: 'p8', status: 'published', publishedAt: '2026-05-31',
      axes: { TECH: 78, VISION: 74, PHYS: 80, ATT: 66, DEF: 70, MENTAL: 78 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Box to box, tu couvres un terrain immense, très juste techniquement.", sourceSegmentId: 's1-5' }],
      improvements: [], coachNote: 'Continue comme ça, tu tires l\u2019équipe vers le haut.' },
    { id: 'r-s1-p4', sessionId: 's1', playerId: 'p4', status: 'published', publishedAt: '2026-05-31',
      axes: { TECH: 70, VISION: 66, PHYS: 68, ATT: 44, DEF: 76, MENTAL: 66 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Propre en charnière, tu ressors bien sous pression.", sourceSegmentId: 's1-6' }],
      improvements: [], coachNote: null },

    // ===== s2 : rapports DRAFT (en cours de validation) avec previousAxes = s1 =====
    { id: 'r-s2-p1', sessionId: 's2', playerId: 'p1', status: 'published', publishedAt: '2026-06-07',
      axes: null, gkAxes: { HANDS: 76, DISTRIBUTION: 52, EXITS: 82, POSITIONING: 74, COMMUNICATION: 78, MENTAL: 76 },
      previousAxes: { HANDS: 74, DISTRIBUTION: 60, EXITS: 78, POSITIONING: 72, COMMUNICATION: 80, MENTAL: 76 },
      strengths: [{ text: "Sortie aérienne nickel et jeu au pied propre.", sourceSegmentId: 's2-1' }],
      improvements: [{ text: "Regarde mieux tes options avant de relancer.", sourceSegmentId: 's2-1' }], coachNote: null },
    { id: 'r-s2-p2', sessionId: 's2', playerId: 'p2', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 80, VISION: 62, PHYS: 70, ATT: 66, DEF: 74, MENTAL: 72 }, gkAxes: null,
      previousAxes: { TECH: 62, VISION: 55, PHYS: 68, ATT: 40, DEF: 74, MENTAL: 64 },
      strengths: [{ text: "Gros match, techniquement au-dessus, tes débordements ont fait mal.", sourceSegmentId: 's2-2' }],
      improvements: [], coachNote: null },
    { id: 'r-s2-p4', sessionId: 's2', playerId: 'p4', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 74, VISION: 68, PHYS: 68, ATT: 50, DEF: 78, MENTAL: 66 }, gkAxes: null,
      previousAxes: { TECH: 70, VISION: 66, PHYS: 68, ATT: 44, DEF: 76, MENTAL: 66 },
      strengths: [{ text: "À l'aise au pied, tu te libères bien du marquage.", sourceSegmentId: 's2-3' }],
      improvements: [{ text: "Deviens décisif sur les coups de pied arrêtés.", sourceSegmentId: 's2-3' }], coachNote: null },
    { id: 'r-s2-p5', sessionId: 's2', playerId: 'p5', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 58, VISION: 60, PHYS: 62, ATT: 42, DEF: 70, MENTAL: 74 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Tu joues un an au-dessus et tu tiens le poste — chapeau.", sourceSegmentId: 's2-4' }],
      improvements: [{ text: "Utilise beaucoup plus ton pied gauche à ton poste.", sourceSegmentId: 's2-4' }], coachNote: null },
    { id: 'r-s2-p6', sessionId: 's2', playerId: 'p6', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 60, VISION: 50, PHYS: 84, ATT: 46, DEF: 76, MENTAL: 66 }, gkAxes: null,
      previousAxes: { TECH: 60, VISION: 52, PHYS: 82, ATT: 48, DEF: 78, MENTAL: 70 },
      strengths: [{ text: "Énergie et volume de course impressionnants.", sourceSegmentId: 's2-5' }],
      improvements: [{ text: "Cours juste, reste utile jusqu'au bout du match.", sourceSegmentId: 's2-5' }], coachNote: null },
    { id: 'r-s2-p7', sessionId: 's2', playerId: 'p7', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 64, VISION: 56, PHYS: 66, ATT: 68, DEF: 42, MENTAL: 64 }, gkAxes: null,
      previousAxes: { TECH: 64, VISION: 58, PHYS: 66, ATT: 72, DEF: 42, MENTAL: 68 },
      strengths: [{ text: "Beaucoup de ballons touchés, tu es dans le jeu.", sourceSegmentId: 's2-6' }],
      improvements: [{ text: "Ose le un-contre-un pour créer le déséquilibre.", sourceSegmentId: 's2-6' }], coachNote: null },
    { id: 'r-s2-p8', sessionId: 's2', playerId: 'p8', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 82, VISION: 78, PHYS: 82, ATT: 70, DEF: 72, MENTAL: 82 }, gkAxes: null,
      previousAxes: { TECH: 78, VISION: 74, PHYS: 80, ATT: 66, DEF: 70, MENTAL: 78 },
      strengths: [{ text: "Super match, un vrai patron du milieu, court et long.", sourceSegmentId: 's2-7' }],
      improvements: [], coachNote: null },
    { id: 'r-s2-p10', sessionId: 's2', playerId: 'p10', status: 'published', publishedAt: '2026-06-07',
      axes: { TECH: 76, VISION: 72, PHYS: 68, ATT: 62, DEF: 64, MENTAL: 74 }, gkAxes: null, previousAxes: null,
      strengths: [{ text: "Gros match, très complémentaire au milieu, propre partout.", sourceSegmentId: 's2-8' }],
      improvements: [], coachNote: null },
    // p11 (Younes) et p13 (Hugo) : squad s2 mais AUCUN verbatim => aucun rapport (état vide).

    // ===== s3 : rapports DRAFT générés après validation de la transcription =====
    { id: 'r-s3-p1', sessionId: 's3', playerId: 'p1', status: 'draft', publishedAt: null,
      axes: null, gkAxes: { HANDS: 70, DISTRIBUTION: 58, EXITS: 76, POSITIONING: 74, COMMUNICATION: 78, MENTAL: 72 },
      previousAxes: { HANDS: 76, DISTRIBUTION: 52, EXITS: 82, POSITIONING: 74, COMMUNICATION: 78, MENTAL: 76 },
      strengths: [{ text: "Rien à redire sur les trois buts encaissés, tu as fait le job.", sourceSegmentId: 's3-1' }],
      improvements: [], coachNote: null },
    { id: 'r-s3-p6', sessionId: 's3', playerId: 'p6', status: 'draft', publishedAt: null,
      axes: { TECH: 64, VISION: 58, PHYS: 82, ATT: 48, DEF: 74, MENTAL: 68 }, gkAxes: null,
      previousAxes: { TECH: 60, VISION: 50, PHYS: 84, ATT: 46, DEF: 76, MENTAL: 66 },
      strengths: [{ text: "Bon match au milieu, tu as bien orienté le jeu.", sourceSegmentId: 's3-2' }],
      improvements: [], coachNote: null },
    { id: 'r-s3-p8', sessionId: 's3', playerId: 'p8', status: 'draft', publishedAt: null,
      axes: { TECH: 82, VISION: 78, PHYS: 82, ATT: 72, DEF: 72, MENTAL: 86 }, gkAxes: null,
      previousAxes: { TECH: 82, VISION: 78, PHYS: 82, ATT: 70, DEF: 72, MENTAL: 82 },
      strengths: [{ text: "Toujours présent, tu as égalisé sur la fin — mental de fou.", sourceSegmentId: 's3-5' }],
      improvements: [], coachNote: null },
  ],
};

/* ------------------------------ Sélecteurs -------------------------------- */
export const getPlayer   = (id) => MOCK_DATA.players.find((p) => p.id === id) || null;
export const getSession  = (id) => MOCK_DATA.sessions.find((s) => s.id === id) || null;
export const getTranscript = (sessionId) => MOCK_DATA.transcripts.find((t) => t.sessionId === sessionId) || { sessionId, segments: [] };
export const getSegment  = (segId) => {
  for (const t of MOCK_DATA.transcripts) { const s = t.segments.find((x) => x.id === segId); if (s) return s; }
  return null;
};
export const getReport   = (id) => MOCK_DATA.reports.find((r) => r.id === id) || null;
export const getReportFor = (sessionId, playerId) => MOCK_DATA.reports.find((r) => r.sessionId === sessionId && r.playerId === playerId) || null;
export const getReportsForSession = (sessionId) => MOCK_DATA.reports.filter((r) => r.sessionId === sessionId);
export const getPublishedReportsForPlayer = (playerId) =>
  MOCK_DATA.reports.filter((r) => r.playerId === playerId && r.status === 'published')
    .sort((a, b) => (getSession(b.sessionId).date).localeCompare(getSession(a.sessionId).date));
export const getReportsForPlayer = (playerId) =>
  MOCK_DATA.reports.filter((r) => r.playerId === playerId)
    .sort((a, b) => (getSession(b.sessionId).date).localeCompare(getSession(a.sessionId).date));

export const FIELD_AXES = ['TECH', 'VISION', 'PHYS', 'ATT', 'DEF', 'MENTAL'];
export const GK_AXES = ['HANDS', 'DISTRIBUTION', 'EXITS', 'POSITIONING', 'COMMUNICATION', 'MENTAL'];

/** Portraits joueurs — un avatar photo pour chaque joueur (jamais d'initiale). */
export const PLAYER_PHOTOS = {
  p1: 'assets/players/lucas.png',  p2: 'assets/players/rayan.png',   p3: 'assets/players/enzo.png',
  p4: 'assets/players/noah.png',   p5: 'assets/players/gabriel.png', p6: 'assets/players/malik.png',
  p7: 'assets/players/theo.png',   p8: 'assets/players/ibrahim.png', p9: 'assets/players/adam.png',
  p10: 'assets/players/matteo.png', p11: 'assets/players/younes.png', p12: 'assets/players/lucas.png',
  p13: 'assets/players/rayan.png', p14: 'assets/players/noah.png',   p15: 'assets/players/theo.png',
  p16: 'assets/players/malik.png',
};

/** Audio de démo : le même fichier sert de "débrief enregistré" tout au long. */
export const DEMO_AUDIO_URL = 'assets/debrief.mp3';
