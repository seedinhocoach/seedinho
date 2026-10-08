/* ============================================================================
 * src/app.js — routeur : déclare toutes les routes (anglais technique) et
 * démarre l'app. Entrée par défaut : connexion coach.
 * ==========================================================================*/
import { route, startRouter } from './lib/router.js';
// Coach
import { CoachLogin } from './screens/coach/CoachLogin.js';
import { CoachSessions } from './screens/coach/CoachSessions.js';
import { CoachSquad } from './screens/coach/CoachSquad.js';
import { CoachSettings } from './screens/coach/CoachSettings.js';
import { NewDebrief } from './screens/coach/NewDebrief.js';
import { SwipeCapture } from './screens/coach/SwipeCapture.js';
import { CaptureValidation } from './screens/coach/CaptureValidation.js';
import { CaptureReports } from './screens/coach/CaptureReports.js';
import { RecordDebrief } from './screens/coach/RecordDebrief.js';
import { ProcessingSession } from './screens/coach/ProcessingSession.js';
import { ReviewTranscript } from './screens/coach/ReviewTranscript.js';
import { SessionReports } from './screens/coach/SessionReports.js';
import { CoachReport, CoachReportEmpty } from './screens/coach/CoachReport.js';
import { PublishReports } from './screens/coach/PublishReports.js';
import { PlayerFile } from './screens/coach/PlayerFile.js';
// Joueur
import { PlayerAccess } from './screens/player/PlayerAccess.js';
import { PlayerHome } from './screens/player/PlayerHome.js';
import { PlayerReport } from './screens/player/PlayerReport.js';
import { PlayerProgress } from './screens/player/PlayerProgress.js';
import { PlayerProfile } from './screens/player/PlayerProfile.js';

// ---- Parcours coach ----
route('/coach/login', CoachLogin);
route('/coach/sessions', CoachSessions);
route('/coach/squad', CoachSquad);
route('/coach/settings', CoachSettings);
route('/coach/new', NewDebrief);
route('/coach/capture', SwipeCapture);
route('/coach/capture-review/:id', CaptureValidation);
route('/coach/capture-done/:id', CaptureReports);
route('/coach/record', RecordDebrief);
route('/coach/processing/:id', ProcessingSession);
route('/coach/review/:id', ReviewTranscript);
route('/coach/reports/:id', SessionReports);
route('/coach/report/empty', CoachReportEmpty); // avant :reportId
route('/coach/report/:reportId', CoachReport);
route('/coach/publish/:id', PublishReports);
route('/coach/player/:playerId', PlayerFile);

// ---- Parcours joueur ----
route('/player/access', PlayerAccess);
route('/player/home', PlayerHome);
route('/player/report/:id', PlayerReport);
route('/player/progress', PlayerProgress);
route('/player/profile', PlayerProfile);

// Deux entrées distinctes ; défaut = connexion coach.
startRouter(() => { window.location.hash = '#/coach/login'; });
