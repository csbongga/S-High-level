/**
 * Classroom Quest - Service Worker
 * Enables PWA installation, offline shell caching, and instant launch.
 */

const CACHE_NAME = "classquest-pwa-v5";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./pwa.js",
  "./qrcode.png",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon.svg",
  "./apple-touch-icon.png",
  "./high-level/",
  "./high-level/index.html",
  "./high-level/app.js",
  "./high-level/style.css",
  "./high-level/manifest.json",
  "./high-level/icon-192.png",
  "./high-level/icon-512.png",
  "./high-level/icon.svg",
  "./high-level/apple-touch-icon.png",
  "./web-programming/",
  "./web-programming/index.html",
  "./web-programming/app.js",
  "./web-programming/style.css",
  "./web-programming/manifest.json",
  "./web-programming/icon-192.png",
  "./web-programming/icon-512.png",
  "./web-programming/icon.svg",
  "./web-programming/apple-touch-icon.png"
];

// Install: Pre-cache static shell assets using allSettled to prevent single-file failures
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        SHELL_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`Failed to pre-cache ${url}:`, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for API and live pages, Stale-While-Revalidate for cached assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Strictly bypass caching for Google Apps Script, Google Sheets, or dynamic queries (Live real-time data)
  if (
    event.request.method !== "GET" ||
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("googleusercontent.com") ||
    url.hostname.includes("spreadsheets.google.com") ||
    url.hostname.includes("docs.google.com") ||
    url.searchParams.has("t")
  ) {
    return; // Bypass Service Worker cache completely
  }

  // Network-First for HTML navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match("./index.html")))
    );
    return;
  }

  // Stale-While-Revalidate for local static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
