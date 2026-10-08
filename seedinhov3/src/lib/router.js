/* ============================================================================
 * src/lib/router.js — routeur par hash (compatible GitHub Pages, sans serveur)
 * Format des routes : '#/coach/sessions/:id/validate'
 * ==========================================================================*/

const routes = [];

/** Enregistre une route : pattern + handler(params) => HTMLElement. */
export function route(pattern, handler) {
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:[^/]+/g, (m) => {
    keys.push(m.slice(1));
    return '([^/]+)';
  }) + '$');
  routes.push({ rx, keys, handler });
}

function resolve(hash) {
  const raw = (hash || '#/').replace(/^#/, '') || '/';
  const [path, queryStr] = raw.split('?');
  const query = {};
  if (queryStr) for (const pair of queryStr.split('&')) {
    const [k, v] = pair.split('=');
    query[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  for (const r of routes) {
    const m = (path || '/').match(r.rx);
    if (m) {
      const params = { ...query };
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { handler: r.handler, params };
    }
  }
  return null;
}

/** Navigation programmatique. */
export function go(path) { window.location.hash = path; }

/** Démarre le routeur : rend l'écran courant et écoute les changements. */
export function startRouter(fallback) {
  const render = () => {
    const match = resolve(window.location.hash);
    if (match) match.handler(match.params);
    else fallback();
  };
  window.addEventListener('hashchange', render);
  render();
}
