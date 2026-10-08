# Seedinho — Spécification technique (SPEC.md)

Destiné au développeur qui réimplémentera cette interface avec un vrai backend.
Le prototype est 100 % statique (voir `README.md`). Toute la donnée vient de
`src/data/mockData.js` (objet `MOCK_DATA`) et tous les textes de `src/data/copy.js`
(objet `COPY`). Les composants et fichiers sont en **anglais PascalCase**, l'UI en français.

---

## 1. Règles produit (non négociables — à reprendre telles quelles)

Les rapports sont lus par des adolescents (15-17 ans) et leurs parents.
**Une phrase inventée est le pire échec possible du produit.**

1. **Zéro contenu inventé.** Tout point fort / axe de progrès est adossé à un
   `sourceSegmentId` (verbatim du coach). Au tap sur « Ce que ton coach a dit », le
   segment exact s'affiche (`openSourceSheet`).
2. **Si le coach n'a pas parlé d'un joueur : aucun rapport généré.**
   - Côté joueur : écran « Aucun retour individuel sur ce match » (`PlayerEmptyReport`).
   - Côté coach : état « Rien n'a été dit sur ce joueur » + champ facultatif
     `Mot du coach` (`CoachReportEmpty`).
3. **Seul texte non issu du verbatim : `coachNote`** (ajout manuel du coach),
   visuellement distinct et labellisé **Mot du coach** des deux côtés.
4. **Aucune formulation type « l'IA recommande » / « analyse générée ».** Le produit
   restitue la parole du coach, il ne l'augmente pas.

Application côté données : un axe du radar sans source n'est pas affiché comme une
observation ; un joueur sans segment n'a pas d'entrée dans `reports`.

---

## 2. Contraintes techniques

- Site **100 % statique**, aucun appel réseau, aucun build. Chemins **relatifs**
  (fonctionne dans un sous-dossier GitHub Pages).
- **Hash routing** (`src/lib/router.js`) → le refresh ne casse pas. Query string
  supportée (`#/coach/report/empty?s=…&p=…`).
- **Mobile-first 390 px**, propre jusqu'à 1440 px. Cibles tactiles ≥ 48 px,
  contrastes forts (usage terrain, plein soleil).
- **Données** : uniquement `MOCK_DATA`. **Textes** : uniquement `COPY`.
- Accessibilité : `:focus-visible` visible, `prefers-reduced-motion` respecté,
  contraste AA.

---

## 3. Inventaire des écrans (route → composant)

### Parcours coach
| Route | Composant | Rôle |
|---|---|---|
| `#/coach/login` | `CoachLogin` | Email + code 6 chiffres (mocké) |
| `#/coach/sessions` | `CoachSessions` | Liste chronologique + CTA *Nouveau débrief* |
| `#/coach/new` | `NewDebrief` | Type, adversaire, date, score, lieu, sélection des présents |
| `#/coach/record` | `RecordDebrief` | Micro, chrono, waveform, pause/stop, ré-écoute, import ; garde-fou < 30 s |
| `#/coach/processing/:id` | `ProcessingSession` | 3 étapes (~6 s) → validation |
| `#/coach/review/:id` | `ReviewTranscript` | Segments + timecode ; `needsReview` surlignés ; corriger / attribuer / supprimer ; CTA bloqué si un segment non attribué |
| `#/coach/reports/:id` | `SessionReports` | Effectif + état du rapport ; CTA *Publier* |
| `#/coach/report/:reportId` | `CoachReport` | Radar 6 axes (gardien si GK), forts/progrès + verbatim source, *Mot du coach* |
| `#/coach/report/empty?s=&p=` | `CoachReportEmpty` | « Rien n'a été dit » + champ mot facultatif |
| `#/coach/publish/:id` | `PublishReports` | Récap (N envoyés, M sans retour) + confirmation + succès |
| `#/coach/player/:playerId` | `PlayerFile` | Historique des rapports + évolution des axes |

### Parcours joueur
| Route | Composant | Rôle |
|---|---|---|
| `#/player/access` | `PlayerAccess` | Code d'invitation (mocké) |
| `#/player/home` | `PlayerHome` | Dernier rapport en avant, historique, prochain match |
| `#/player/report/:id` | `PlayerReport` | Match + score, radar (courbe précédente en surimpression), forts/travail, *Mot du coach*, mention « rédigé à partir du débrief » |
| `#/player/progress` | `PlayerProgress` | Évolution des 6 axes, nb de rapports, axe le plus progressé |
| `#/player/profile` | `PlayerProfile` | Poste, numéro, saison, consentement parental si mineur |

Entrée par défaut : `#/coach/login`. La barre du bas (`RoleTabbar`) bascule
Coach ↔ Joueur — affordance de démo ; en prod, le joueur arrive par un lien profond.

---

## 4. Composants réutilisables (props)

- **`AppHeader({ title?, back?, right? })`** — barre supérieure ; `back` = hash de retour.
- **`RoleTabbar(active: 'coach'|'player')`** — bascule de parcours.
- **`StatusBadge(status: SessionStatus)`** — pastille de statut de séance.
- **`PlayerAvatar(player, size=48)`** — avatar rond + numéro (photo ou initiale).
- **`MatchHeader(session)`** — club/score/adversaire + domicile/extérieur + date.
- **`RadarChart({ axes, keys, labels, previous?, dark? })`** — radar signature 6 axes
  (scores 0-100). `previous` superpose la courbe du match précédent en pointillé.
- **`SourceLink(segmentId, label)`** + **`openSourceSheet(segmentId)`** — accès au
  verbatim source (feuille modale). **C'est le composant clé de la traçabilité.**
- Helpers : `fullName(player)`, `positionLabel(pos)`.

---

## 5. Modèle de données (`MOCK_DATA`)

```js
coach: { id, firstName, lastName, clubName, teamName }

players: [{ id, firstName, lastName, shirtNumber,
            position: "GK"|"DEF"|"MID"|"FWD",
            birthYear, isMinor, guardianEmail }]

sessions: [{ id, type: "match"|"training",
             opponent, date, score, location: "home"|"away",
             audioDurationSec, squad: [playerId],
             status: "to_debrief"|"processing"|"to_review"|"reports_ready"|"published" }]

transcripts: [{ sessionId, segments: [{
   id, startSec, endSec, text,
   confidence,     // 0..1
   playerId,       // null si non attribué
   needsReview     // true si confidence < 0.75 OU playerId null
}]}]

reports: [{ id, sessionId, playerId,
   status: "draft"|"published",
   axes:   { TECH, VISION, PHYS, ATT, DEF, MENTAL },              // 0..100 (joueur de champ)
   gkAxes: { HANDS, DISTRIBUTION, EXITS, POSITIONING, COMMUNICATION, MENTAL }, // 0..100 (gardien)
   previousAxes,   // même forme que l'axe utilisé, null si 1er rapport
   strengths:    [{ text, sourceSegmentId }],
   improvements: [{ text, sourceSegmentId }],
   coachNote,      // ajout manuel du coach, null par défaut
   publishedAt
}]
```

Pour un joueur de champ, `gkAxes = null` ; pour un gardien, `axes = null`.
Un joueur du `squad` **sans segment** n'a **aucun** report (état vide).

Sélecteurs fournis : `getPlayer`, `getSession`, `getTranscript`, `getSegment`,
`getReport`, `getReportFor(sessionId, playerId)`, `getReportsForSession`,
`getPublishedReportsForPlayer`, `getReportsForPlayer`. Le développeur remplace ces
sélecteurs par des appels API sans toucher aux écrans.

---

## 6. Machine à états du statut d'une session

```
to_debrief ──(enregistrement + envoi)──▶ processing
processing ──(transcription terminée)──▶ to_review
to_review  ──(tous les segments attribués + « Valider »)──▶ reports_ready
reports_ready ──(« Publier les rapports »)──▶ published
```

- `to_debrief`  : séance créée, pas d'audio → `RecordDebrief`.
- `processing`  : traitement en cours → `ProcessingSession` (transitoire).
- `to_review`   : transcription à valider → `ReviewTranscript`. Bloqué tant qu'un
  segment a `playerId === null`.
- `reports_ready` : rapports générés (draft) → `SessionReports`.
- `published`   : rapports visibles côté joueur.

Implémenté dans `src/lib/store.js` (`store.status` / `store.setStatus`), copie de
travail des segments et `coachNote` en mémoire — à remplacer par la persistance API.

---

## 7. États à couvrir par écran

Chargement (`ProcessingSession`, spinners), **vide** (aucune séance ; transcription
sans joueur détecté → `ReviewTranscript` liste vide ; joueur sans rapport →
`PlayerEmptyReport` / `CoachReportEmpty` ; premier rapport sans historique →
`PlayerProgress` état vide), **erreur** (enregistrement < 30 s → message ; segment
non attribué → CTA bloqué), **succès** (`PublishReports`).
