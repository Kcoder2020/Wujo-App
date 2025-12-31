// Wujo App Service Worker
// Required for PWA installability

const CACHE_NAME = 'wujo-app-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event handler - required for PWA installability
self.addEventListener('fetch', (event) => {
  // Network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // For navigation requests, try network first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// Background sync for offline support
self.addEventListener('sync', (event) => {
  console.log('Background syncing!', event);
  if (event.tag === 'sync-iqubs') {
    event.waitUntil(
      Promise.resolve()
        .then(() => {
          console.log('Iqubs synced successfully!');
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: 'SYNC_SUCCESS' });
            });
          });
        })
        .catch((error) => {
          console.error('Iqub sync failed:', error);
        })
    );
  }
});
