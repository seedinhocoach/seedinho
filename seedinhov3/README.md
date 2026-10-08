# Seedinho — MVP web (v2)

Prototype **frontend statique** : un coach de foot amateur enregistre un débrief
audio après le match ; l'audio est transcrit, découpé par joueur, et chaque joueur
reçoit un **rapport individuel construit uniquement à partir de ce que le coach a dit**
(radar 6 axes + points forts + axes de progrès, tous adossés au verbatim source).

Deux usages : **pilote terrain** (coachs + joueurs réels) et **spécification** pour le
développeur qui réimplémentera l'interface avec un vrai backend (voir `SPEC.md`).

## Lancer en local

ES modules → servir en HTTP (pas d'ouverture directe en `file://`) :

```bash
cd seedinhov2
python3 -m http.server 8080     # ou : npx serve .
# http://localhost:8080
```

Aucun build, aucune dépendance.

## Déployer sur GitHub Pages

Le site est 100 % statique et utilise des **chemins relatifs** : il fonctionne dans un
sous-dossier (ex. `https://<user>.github.io/seedinho-v1/seedinhov2/`).

1. Committer le dossier `seedinhov2/` dans le dépôt.
2. Activer GitHub Pages (branche + dossier racine du dépôt).
3. Ouvrir l'URL du dossier `seedinhov2/`. La navigation par hash (`#/…`) survit au refresh.

## Ce qui est mocké

- **Toutes** les données viennent de `src/data/mockData.js` (`MOCK_DATA`). Aucun réseau.
- **Tous** les textes viennent de `src/data/copy.js` (`COPY`), français uniquement.
- Connexion coach, code joueur, Google/Apple : simulés (toute valeur passe).
- Transcription et génération : minuteurs qui simulent le traitement.
- État de démo (statuts de séance, édition des segments, mot du coach) : en mémoire
  (`src/lib/store.js`), réinitialisé au rechargement.

## Structure

```
seedinhov2/
├── index.html              # shell + point de montage #app
├── README.md · SPEC.md
├── assets/                 # écussons, portraits, logos (relatifs)
└── src/
    ├── app.js              # déclaration des routes
    ├── styles.css          # thème #02562d, mobile-first
    ├── data/{mockData,copy}.js
    ├── lib/{dom,router,store}.js
    ├── components/{Shared,RadarChart}.js
    └── screens/
        ├── coach/  (CoachLogin, CoachSessions, NewDebrief, RecordDebrief,
        │            ProcessingSession, ReviewTranscript, SessionReports,
        │            CoachReport, PublishReports, PlayerFile)
        └── player/ (PlayerAccess, PlayerHome, PlayerReport, PlayerEmptyReport,
                     PlayerProgress, PlayerProfile)
```

Composants et fichiers en **anglais PascalCase**, interface en **français**.
Détail des écrans, props, modèle de données, machine à états et règles produit : **`SPEC.md`**.

## Règle produit clé

**Zéro contenu inventé.** Chaque point fort et axe de progrès renvoie au verbatim
exact du coach (tap → segment source). Un joueur non évoqué n'a pas de rapport
(état vide dédié). Seul le *Mot du coach* est un ajout manuel, clairement labellisé.
