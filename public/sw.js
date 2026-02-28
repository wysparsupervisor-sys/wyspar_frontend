const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
    '/icon.png',
    "/logo.png",
    '/icon-192.png',
    '/icon-512.png'
];


//handle push notifications
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            image: data.image,
            data: { url: data.url },
            actions: data.actions,
        })
    );
});

self.addEventListener("notificationclick", event => {
    if(!event.action) return;
    event.notification.close();

    if(event.action === "view"){
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === "reply"){
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    };
})

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
    if (ASSETS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(
            caches.match(event.request)
        );
    };
});