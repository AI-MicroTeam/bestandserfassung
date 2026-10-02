// Bestandserfassung - Ablage fuer den Betrieb ohne Netz. Erzeugt, nicht von Hand aendern.
const ABLAGE = "bestand-8bcbed0599";
const DATEIEN = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(ABLAGE).then(c => c.addAll(DATEIEN)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== ABLAGE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const kopie = r.clone();
      caches.open(ABLAGE).then(c => c.put(e.request, kopie));
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("./")))
  );
});
