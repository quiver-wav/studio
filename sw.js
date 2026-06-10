/* Service worker — Studio PWA */
const VERSION = "studio-v1";
const SHELL = [
  "./",
  "index.html",
  "app.js",
  "config.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // mai mettere in cache le chiamate al backend (Supabase)
  if (url.hostname.endsWith(".supabase.co")) return;
  if (e.request.method !== "GET") return;

  // network-first per index e config (così gli aggiornamenti arrivano subito)
  const networkFirst = url.pathname.endsWith("/") ||
    url.pathname.endsWith("index.html") || url.pathname.endsWith("config.js") ||
    url.pathname.endsWith("app.js") || url.pathname.endsWith("sw.js");

  if (networkFirst) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copy = r.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request))
    );
  }
});
