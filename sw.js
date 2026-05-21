const VERSION = "v2";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const OFFLINE_URL = "/pages/offline.html";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/css/english.css",
  "/css/global-styles.css",
  "/css/main.css",
  "/css/math.css",
  "/css/pwa-banner.css",
  "/css/russian.css",
  "/css/search.css",
  "/css/speaker-banner.css",
  "/css/subject.css",
  "/data/search-index.json",
  "/fonts/stratosskyengweb-black.woff",
  "/fonts/stratosskyengweb-black.woff2",
  "/fonts/stratosskyengweb-blackitalic.woff",
  "/fonts/stratosskyengweb-blackitalic.woff2",
  "/fonts/stratosskyengweb-bold.woff",
  "/fonts/stratosskyengweb-bold.woff2",
  "/fonts/stratosskyengweb-bolditalic.woff",
  "/fonts/stratosskyengweb-bolditalic.woff2",
  "/fonts/stratosskyengweb-extrabold.woff",
  "/fonts/stratosskyengweb-extrabold.woff2",
  "/fonts/stratosskyengweb-extrabolditalic.woff",
  "/fonts/stratosskyengweb-extrabolditalic.woff2",
  "/fonts/stratosskyengweb-extralight.woff",
  "/fonts/stratosskyengweb-extralight.woff2",
  "/fonts/stratosskyengweb-extralightitalic.woff",
  "/fonts/stratosskyengweb-extralightitalic.woff2",
  "/fonts/stratosskyengweb-italic.woff",
  "/fonts/stratosskyengweb-italic.woff2",
  "/fonts/stratosskyengweb-light.woff",
  "/fonts/stratosskyengweb-light.woff2",
  "/fonts/stratosskyengweb-lightitalic.woff",
  "/fonts/stratosskyengweb-lightitalic.woff2",
  "/fonts/stratosskyengweb-medium.woff",
  "/fonts/stratosskyengweb-medium.woff2",
  "/fonts/stratosskyengweb-mediumitalic.woff",
  "/fonts/stratosskyengweb-mediumitalic.woff2",
  "/fonts/stratosskyengweb-regular.woff",
  "/fonts/stratosskyengweb-regular.woff2",
  "/fonts/stratosskyengweb-semibold.woff",
  "/fonts/stratosskyengweb-semibold.woff2",
  "/fonts/stratosskyengweb-semibolditalic.woff",
  "/fonts/stratosskyengweb-semibolditalic.woff2",
  "/fonts/stratosskyengweb-semilight.woff",
  "/fonts/stratosskyengweb-semilight.woff2",
  "/fonts/stratosskyengweb-semilightitalic.woff",
  "/fonts/stratosskyengweb-semilightitalic.woff2",
  "/fonts/stratosskyengweb-thin.woff",
  "/fonts/stratosskyengweb-thin.woff2",
  "/fonts/stratosskyengweb-thinitalic.woff",
  "/fonts/stratosskyengweb-thinitalic.woff2",
  "/icons/arw-left.svg",
  "/icons/arw-rght.svg",
  "/icons/close-circle-grey.svg",
  "/icons/close_white.svg",
  "/icons/icon-app__192.png",
  "/icons/icon-app__512.png",
  "/icons/icon-app__svg.svg",
  "/icons/lightning.svg",
  "/icons/logo_white.svg",
  "/icons/pwa__download-icon.svg",
  "/icons/speaker__icon.svg",
  "/icons/zoom.svg",
  "/imgs/apple.svg",
  "/imgs/apple_small.svg",
  "/imgs/apple_small_red.svg",
  "/imgs/earphone.svg",
  "/imgs/pencil.svg",
  "/imgs/speaker-popup__preview.svg",
  "/imgs/workbook.svg",
  "/js/app.js",
  "/js/pwa-banner.js",
  "/js/search.js",
  "/js/speaker-banner.js",
  "/js/speaker.js",
  "/pages/english-10-11.html",
  "/pages/english-2-4.html",
  "/pages/english-5-6.html",
  "/pages/english-7-8.html",
  "/pages/english-9.html",
  "/pages/math-10-11.html",
  "/pages/math-2-4.html",
  "/pages/math-5-6.html",
  "/pages/math-7-8.html",
  "/pages/math-9.html",
  "/pages/offline.html",
  "/pages/russian-10-11.html",
  "/pages/russian-2-4.html",
  "/pages/russian-5-6.html",
  "/pages/russian-7-8.html",
  "/pages/russian-9.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        const cachedPage = await caches.match(req, { ignoreSearch: true });
        if (cachedPage) return cachedPage;

        const cachedIndex = await caches.match("/index.html");
        if (url.pathname === "/" && cachedIndex) return cachedIndex;

        return caches.match(OFFLINE_URL);
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const fresh = await fetch(req);
      if (fresh.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(req, fresh.clone());
      }
      return fresh;
    } catch {
      if (req.destination === "document") {
        return caches.match(OFFLINE_URL);
      }
      return Response.error();
    }
  })());
});