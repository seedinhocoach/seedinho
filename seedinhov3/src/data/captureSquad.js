/* ============================================================================
 * src/data/captureSquad.js — flow "swipe joueur par joueur".
 * 8 joueurs (photos réelles assets/squad/p1..p8), transcripts bruts et
 * rapports structurés mockés. Respecte la règle : rien d'inventé, un axe non
 * évoqué reste neutre, un segment douteux est marqué basse confiance.
 * ==========================================================================*/

export const CAPTURE_SQUAD = [
  { id: 'p1', firstName: 'Lucas',   lastName: 'Mercier',  number: 1,  position: 'GK'  },
  { id: 'p2', firstName: 'Rayan',   lastName: 'Haddad',   number: 7,  position: 'DEF' },
  { id: 'p3', firstName: 'Adam',    lastName: 'Moreau',   number: 9,  position: 'FWD' },
  { id: 'p4', firstName: 'Théo',    lastName: 'Lambert',  number: 10, position: 'MID' },
  { id: 'p5', firstName: 'Enzo',    lastName: 'Fontaine', number: 11, position: 'MID' },
  { id: 'p6', firstName: 'Nathan',  lastName: 'Faure',    number: 4,  position: 'DEF' },
  { id: 'p7', firstName: 'Ibrahim', lastName: 'Traoré',   number: 8,  position: 'MID' },
  { id: 'p8', firstName: 'Sami',    lastName: 'Delaunay', number: 14, position: 'FWD' },
];

export const CAPTURE_PHOTO = (id) => `assets/squad/${id}.png`;

export const FIELD_AXES = ['TECH', 'VISION', 'PHYS', 'ATT', 'DEF', 'MENTAL'];
export const GK_AXES = ['HANDS', 'DISTRIBUTION', 'EXITS', 'POSITIONING', 'COMMUNICATION', 'MENTAL'];
export const axisKeys = (pos) => (pos === 'GK' ? GK_AXES : FIELD_AXES);

/**
 * Contenu mocké par joueur :
 *  - transcript : verbatim brut du coach (ce qu'il dirait au micro)
 *  - report.segments : rapport structuré = phrases, chacune high/low confidence
 *    (une phrase 'low' contient un ⟦non résolu⟧ à relire)
 *  - radar : axes suggérés (0..100) ; axes non évoqués laissés à null (neutres)
 *  - spoken : notes DICTÉES à la voix par le coach dans le débrief (axe -> /5).
 *    Elles pré-remplissent le radar et sont marquées « dictée » (gain de temps).
 *  - proc : 'processing' => structuration encore en cours à l'arrivée sur l'écran 2
 *  - skippable : proposé comme "rien à dire" par défaut si true
 */
export const CAPTURE_MOCK = {
  p1: {
    transcript: "Lucas, bon match dans les cages. Sa sortie aérienne était nickel, le jeu au pied propre. Sur la relance par contre il doit mieux regarder avant de jouer. Je lui mets 4 sur les sorties, et 2 sur la relance.",
    spoken: { EXITS: 4, DISTRIBUTION: 2 },
    segments: [
      { axis: 'EXITS', conf: 'high', text: "Bon match dans les cages : ta sortie aérienne était nickel." },
      { axis: 'HANDS', conf: 'high', text: "Jeu au pied propre, tu es en confiance sur tes prises." },
      { axis: 'DISTRIBUTION', conf: 'high', text: "À travailler : mieux regarder tes options avant de relancer." },
    ],
    radar: { HANDS: 74, DISTRIBUTION: 52, EXITS: 82, POSITIONING: null, COMMUNICATION: null, MENTAL: null },
    proc: 'ready',
  },
  p2: {
    transcript: "Rayan, gros match, techniquement pas de souci, il a fait deux trois débordements côté droit qui ont fait mal. Techniquement je le mets à 4, et 4 aussi en attaque.",
    spoken: { TECH: 4, ATT: 4 },
    segments: [
      { axis: 'TECH', conf: 'high', text: "Gros match, techniquement pas de souci." },
      { axis: 'ATT', conf: 'high', text: "Deux-trois débordements côté droit qui ont fait mal." },
    ],
    radar: { TECH: 80, VISION: null, PHYS: 66, ATT: 68, DEF: 72, MENTAL: null },
    proc: 'ready',
  },
  p3: {
    transcript: "Adam devant, euh… il a raté deux occasions, faut qu'il soit plus… enfin sur le placement je sais pas trop, à revoir.",
    segments: [
      { axis: 'ATT', conf: 'low', text: "Deux occasions manquées devant — ⟦non résolu⟧ : à relire, le coach hésite sur la cause.", playerText: "Deux occasions manquées devant." },
      { axis: null, conf: 'low', text: "⟦non résolu⟧ : « sur le placement je sais pas trop » — segment incertain, à écouter." },
    ],
    radar: { TECH: null, VISION: null, PHYS: null, ATT: 40, DEF: null, MENTAL: null },
    proc: 'ready',
  },
  p4: {
    transcript: "Théo au milieu, très bonne vision, il a orienté le jeu, quelques ballons perdus en fin de match par fatigue.",
    segments: [
      { axis: 'VISION', conf: 'high', text: "Très bonne vision, tu as orienté le jeu." },
      { axis: 'PHYS', conf: 'low', text: "Quelques ballons perdus en fin de match — ⟦non résolu⟧ : fatigue à confirmer.", playerText: "Quelques ballons perdus en fin de match." },
    ],
    radar: { TECH: 70, VISION: 82, PHYS: 58, ATT: null, DEF: null, MENTAL: null },
    proc: 'processing',
  },
  p5: {
    transcript: "Enzo, beaucoup d'activité, il a bien pressé, il doit gagner en précision dans la dernière passe.",
    segments: [
      { axis: 'PHYS', conf: 'high', text: "Beaucoup d'activité, bon pressing." },
      { axis: 'ATT', conf: 'high', text: "À gagner : la précision dans la dernière passe." },
    ],
    radar: { TECH: 62, VISION: 60, PHYS: 78, ATT: 54, DEF: null, MENTAL: null },
    proc: 'processing',
  },
  p6: {
    transcript: "Nathan solide derrière, bon jeu de tête, il a bien géré les duels.",
    segments: [
      { axis: 'DEF', conf: 'high', text: "Solide derrière, tu as bien géré les duels." },
      { axis: 'PHYS', conf: 'high', text: "Bon jeu de tête sur les ballons hauts." },
    ],
    radar: { TECH: null, VISION: null, PHYS: 74, ATT: null, DEF: 80, MENTAL: null },
    proc: 'processing',
  },
  p7: {
    transcript: "Ibrahim, un vrai patron au milieu, présent partout, il a égalisé sur la fin, mental énorme. Pour moi c'est 5 au mental, 4 physiquement.",
    spoken: { MENTAL: 5, PHYS: 4 },
    segments: [
      { axis: 'MENTAL', conf: 'high', text: "Mental énorme : tu as égalisé sur la fin." },
      { axis: 'PHYS', conf: 'high', text: "Présent partout, un vrai patron au milieu." },
    ],
    radar: { TECH: 78, VISION: 76, PHYS: 82, ATT: 70, DEF: 68, MENTAL: 86 },
    proc: 'ready',
  },
  p8: {
    // pas d'entrée : proposé "à passer" par défaut (rien dit ce match-là)
    transcript: '',
    segments: [],
    radar: { TECH: null, VISION: null, PHYS: null, ATT: null, DEF: null, MENTAL: null },
    proc: 'ready', skippable: true,
  },
};
