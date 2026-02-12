const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
    '/icon.png',
    "/logo.png",
    '/icon-192.png',
    '/icon-512.png'
];

//cache assets on install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

//activate immediately
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME
            ).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

//server cached assets when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).then(res => {
            const resClone = res.clone();
            event.waitUntil(
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone))
            );
            return res;
        }).catch(() => caches.match(event.request))
    );
});