/* MEDSWU-EAD offline cache — v3.25 (e6eddde41b) */
const CACHE = 'medswu-ead-3.25-e6eddde41b';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache:'reload' }))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('medswu-ead-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if(e.data === 'skip') self.skipWaiting(); });
// the program is one file: serve it from the cache (works offline); a new version arrives as a new sw.js
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch:true }).then(hit => hit || (r.mode === 'navigate' ? caches.match('index.html') : null)).then(hit => hit || fetch(r)));
});
