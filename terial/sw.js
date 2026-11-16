/* CodePatcher Terial — isolated service worker for /terial/ */
const C = 'codepatcher-terial-subdir-v1';
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon.svg","./css/.gitkeep","./css/components.css","./css/layouts.css","./css/responsive.css","./css/themes.css","./css/tokens.css","./js/.gitkeep","./js/01-state.js","./js/02-pwa.js","./js/03-utils.js","./js/04-tokenizers.js","./js/05-patch-engine.js","./js/06-ui-core.js","./js/07-errors-report.js","./js/08-editor-view.js","./js/09-history.js","./js/10-editor-ops.js","./js/11-find-replace.js","./js/12-patch-ui.js","./js/13-symbols-keyboard.js","./js/14-files-tabs.js","./js/15-project-io.js","./js/16-export.js","./js/16b-text-bundle.js","./js/17-drawer.js","./js/18-settings.js","./js/19-isolation-selftest.js","./js/20-file-clipboard.js","./js/21-smoke-tests.js","./js/22-palette-shortcuts.js","./js/23-versions.js","./js/24-preview-console.js","./js/25-storage.js","./js/26-link-updates.js","./js/27-multiselect.js","./js/28-report-ambiguity.js","./js/29-patch-history.js","./js/30-home.js","./js/31-outline.js","./js/32-github.js","./js/32b-github.js","./js/33-files-toolbar.js","./js/33b-files-toolbar.js","./js/34-jekyll-pwa.js"];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('codepatcher-terial-subdir-') && k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || !u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  e.respondWith(fetch(r, {cache:'no-cache'}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(C).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r).then(hit => hit || (r.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
