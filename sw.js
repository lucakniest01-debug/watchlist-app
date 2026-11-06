// Minimaler Service Worker: macht die Seite als App installierbar und hält die App-Dateien für den Start bereit.
const CACHE = "watchlist-app-v35";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "icon-32.png", "three.module.min.js", "css3d.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Erst Netz, bei Offline die gespeicherte Version
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
