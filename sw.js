const VERSION = "v2";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

// Определяем BASE_PATH из scope
const BASE_PATH = self.location.pathname.includes('/pwa-cheatsheet') ? '/pwa-cheatsheet' : '';
const OFFLINE_URL = BASE_PATH + "/pages/offline.html";

const PRECACHE_URLS = [
  BASE_PATH + "/",
  BASE_PATH + "/index.html",
  BASE_PATH + "/manifest.webmanifest",
  BASE_PATH + "/css/english.css",
  BASE_PATH + "/css/global-styles.css",
  BASE_PATH + "/css/main.css",
  BASE_PATH + "/css/math.css",
  BASE_PATH + "/css/pwa-banner.css",
  BASE_PATH + "/css/russian.css",
  BASE_PATH + "/css/search.css",
  BASE_PATH + "/css/speaker-banner.css",
  BASE_PATH + "/css/subject.css",
  BASE_PATH + "/data/search-index.json",
  BASE_PATH + "/fonts/stratosskyengweb-black.woff",
  BASE_PATH + "/fonts/stratosskyengweb-black.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-blackitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-blackitalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-bold.woff",
  BASE_PATH + "/fonts/stratosskyengweb-bold.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-bolditalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-bolditalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-extrabold.woff",
  BASE_PATH + "/fonts/stratosskyengweb-extrabold.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-extrabolditalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-extrabolditalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-extralight.woff",
  BASE_PATH + "/fonts/stratosskyengweb-extralight.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-extralightitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-extralightitalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-italic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-italic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-light.woff",
  BASE_PATH + "/fonts/stratosskyengweb-light.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-lightitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-lightitalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-medium.woff",
  BASE_PATH + "/fonts/stratosskyengweb-medium.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-mediumitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-mediumitalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-regular.woff",
  BASE_PATH + "/fonts/stratosskyengweb-regular.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-semibold.woff",
  BASE_PATH + "/fonts/stratosskyengweb-semibold.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-semibolditalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-semibolditalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-semilight.woff",
  BASE_PATH + "/fonts/stratosskyengweb-semilight.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-semilightitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-semilightitalic.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-thin.woff",
  BASE_PATH + "/fonts/stratosskyengweb-thin.woff2",
  BASE_PATH + "/fonts/stratosskyengweb-thinitalic.woff",
  BASE_PATH + "/fonts/stratosskyengweb-thinitalic.woff2",
  BASE_PATH + "/icons/arw-left.svg",
  BASE_PATH + "/icons/arw-rght.svg",
  BASE_PATH + "/icons/close-circle-grey.svg",
  BASE_PATH + "/icons/close_white.svg",
  BASE_PATH + "/icons/icon-app__192.png",
  BASE_PATH + "/icons/icon-app__512.png",
  BASE_PATH + "/icons/icon-app__svg.svg",
  BASE_PATH + "/icons/favicon.svg",
  BASE_PATH + "/icons/lightning.svg",
  BASE_PATH + "/icons/logo_white.svg",
  BASE_PATH + "/icons/pwa__download-icon.svg",
  BASE_PATH + "/icons/speaker__icon.svg",
  BASE_PATH + "/icons/zoom.svg",
  BASE_PATH + "/imgs/apple.svg",
  BASE_PATH + "/imgs/apple_small.svg",
  BASE_PATH + "/imgs/apple_small_red.svg",
  BASE_PATH + "/imgs/earphone.svg",
  BASE_PATH + "/imgs/pencil.svg",
  BASE_PATH + "/imgs/speaker-popup__preview.svg",
  BASE_PATH + "/imgs/workbook.svg",
  BASE_PATH + "/js/app.js",
  BASE_PATH + "/js/config.js",
  BASE_PATH + "/js/page-init.js",
  BASE_PATH + "/js/pwa-banner.js",
  BASE_PATH + "/js/search.js",
  BASE_PATH + "/js/speaker-banner.js",
  BASE_PATH + "/js/speaker.js",
  BASE_PATH + "/pages/english-10-11.html",
  BASE_PATH + "/pages/english-2-4.html",
  BASE_PATH + "/pages/english-5-6.html",
  BASE_PATH + "/pages/english-7-8.html",
  BASE_PATH + "/pages/english-9.html",
  BASE_PATH + "/pages/math-10-11.html",
  BASE_PATH + "/pages/math-2-4.html",
  BASE_PATH + "/pages/math-5-6.html",
  BASE_PATH + "/pages/math-7-8.html",
  BASE_PATH + "/pages/math-9.html",
  BASE_PATH + "/pages/offline.html",
  BASE_PATH + "/pages/russian-10-11.html",
  BASE_PATH + "/pages/russian-2-4.html",
  BASE_PATH + "/pages/russian-5-6.html",
  BASE_PATH + "/pages/russian-7-8.html",
  BASE_PATH + "/pages/russian-9.html",
  BASE_PATH + "/404.html"
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