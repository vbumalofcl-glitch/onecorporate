const CACHE_NAME = 'onecorporate-v1.2.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './logo.png',
  './building maintenance.png',
  './building_maintenance_icon.ico',
  './manifest.json',
  './maintenance_procedure/procedure.html',
  './maintenance_procedure/app.js',
  './maintenance_procedure/style.css',
  './construction_guideline/index.html',
  './construction_guideline/app.js',
  './construction_guideline/style.css',
  './inventory/inventory.html',
  './inventory/app.js',
  './inventory/style.css',
  './emergency_evaluation/emergency.html',
  './emergency_evaluation/app.js',
  './emergency_evaluation/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached on install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
