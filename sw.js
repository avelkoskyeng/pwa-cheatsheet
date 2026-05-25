const VERSION = "v3";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const BASE_PATH = self.location.pathname.includes("/pwa-cheatsheet/")
  ? "/pwa-cheatsheet"
  : "";

const withBase = (path) => `${BASE_PATH}${path}`;

const OFFLINE_URL = withBase("/pages/offline.html");

const PRECACHE_URLS = [
  withBase("/"),
  withBase("/index.html"),
  withBase("/manifest.webmanifest"),

  withBase("/css/english.css"),
  withBase("/css/global-styles.css"),
  withBase("/css/main.css"),
  withBase("/css/math.css"),
  withBase("/css/pwa-banner.css"),
  withBase("/css/russian.css"),
  withBase("/css/search.css"),
  withBase("/css/speaker-banner.css"),
  withBase("/css/subject.css"),

  withBase("/data/search-index.json"),

  withBase("/fonts/stratosskyengweb-black.woff"),
  withBase("/fonts/stratosskyengweb-black.woff2"),
  withBase("/fonts/stratosskyengweb-blackitalic.woff"),
  withBase("/fonts/stratosskyengweb-blackitalic.woff2"),
  withBase("/fonts/stratosskyengweb-bold.woff"),
  withBase("/fonts/stratosskyengweb-bold.woff2"),
  withBase("/fonts/stratosskyengweb-bolditalic.woff"),
  withBase("/fonts/stratosskyengweb-bolditalic.woff2"),
  withBase("/fonts/stratosskyengweb-extrabold.woff"),
  withBase("/fonts/stratosskyengweb-extrabold.woff2"),
  withBase("/fonts/stratosskyengweb-extrabolditalic.woff"),
  withBase("/fonts/stratosskyengweb-extrabolditalic.woff2"),
  withBase("/fonts/stratosskyengweb-extralight.woff"),
  withBase("/fonts/stratosskyengweb-extralight.woff2"),
  withBase("/fonts/stratosskyengweb-extralightitalic.woff"),
  withBase("/fonts/stratosskyengweb-extralightitalic.woff2"),
  withBase("/fonts/stratosskyengweb-italic.woff"),
  withBase("/fonts/stratosskyengweb-italic.woff2"),
  withBase("/fonts/stratosskyengweb-light.woff"),
  withBase("/fonts/stratosskyengweb-light.woff2"),
  withBase("/fonts/stratosskyengweb-lightitalic.woff"),
  withBase("/fonts/stratosskyengweb-lightitalic.woff2"),
  withBase("/fonts/stratosskyengweb-medium.woff"),
  withBase("/fonts/stratosskyengweb-medium.woff2"),
  withBase("/fonts/stratosskyengweb-mediumitalic.woff"),
  withBase("/fonts/stratosskyengweb-mediumitalic.woff2"),
  withBase("/fonts/stratosskyengweb-regular.woff"),
  withBase("/fonts/stratosskyengweb-regular.woff2"),
  withBase("/fonts/stratosskyengweb-semibold.woff"),
  withBase("/fonts/stratosskyengweb-semibold.woff2"),
  withBase("/fonts/stratosskyengweb-semibolditalic.woff"),
  withBase("/fonts/stratosskyengweb-semibolditalic.woff2"),
  withBase("/fonts/stratosskyengweb-semilight.woff"),
  withBase("/fonts/stratosskyengweb-semilight.woff2"),
  withBase("/fonts/stratosskyengweb-semilightitalic.woff"),
  withBase("/fonts/stratosskyengweb-semilightitalic.woff2"),
  withBase("/fonts/stratosskyengweb-thin.woff"),
  withBase("/fonts/stratosskyengweb-thin.woff2"),
  withBase("/fonts/stratosskyengweb-thinitalic.woff"),
  withBase("/fonts/stratosskyengweb-thinitalic.woff2"),

  withBase("/icons/arw-left.svg"),
  withBase("/icons/arw-rght.svg"),
  withBase("/icons/close-circle-grey.svg"),
  withBase("/icons/close_white.svg"),
  withBase("/icons/icon-app__192.png"),
  withBase("/icons/icon-app__512.png"),
  withBase("/icons/icon-app__svg.svg"),
  withBase("/icons/lightning.svg"),
  withBase("/icons/logo_white.svg"),
  withBase("/icons/pwa__download-icon.svg"),
  withBase("/icons/speaker__icon.svg"),
  withBase("/icons/zoom.svg"),

  withBase("/imgs/apple.svg"),
  withBase("/imgs/apple_small.svg"),
  withBase("/imgs/apple_small_red.svg"),
  withBase("/imgs/earphone.svg"),
  withBase("/imgs/pencil.svg"),
  withBase("/imgs/speaker-popup__preview.svg"),
  withBase("/imgs/workbook.svg"),

  withBase("/js/app.js"),
  withBase("/js/pwa-banner.js"),
  withBase("/js/search.js"),
  withBase("/js/speaker-banner.js"),
  withBase("/js/speaker.js"),

  withBase("/pages/english-10-11.html"),
  withBase("/pages/english-2-4.html"),
  withBase("/pages/english-5-6.html"),
  withBase("/pages/english-7-8.html"),
  withBase("/pages/english-9.html"),
  withBase("/pages/math-10-11.html"),
  withBase("/pages/math-2-4.html"),
  withBase("/pages/math-5-6.html"),
  withBase("/pages/math-7-8.html"),
  withBase("/pages/math-9.html"),
  withBase("/pages/offline.html"),
  withBase("/pages/russian-10-11.html"),
  withBase("/pages/russian-2-4.html"),
  withBase("/pages/russian-5-6.html"),
  withBase("/pages/russian-7-8.html"),
  withBase("/pages/russian-9.html")
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

        const cachedIndex = await caches.match(withBase("/index.html"));
        if ((url.pathname === withBase("/") || url.pathname === `${withBase("/")}`) && cachedIndex) {
          return cachedIndex;
        }

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