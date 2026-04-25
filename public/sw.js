const CACHE_NAME = 'af-omniverse-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Sirf static assets ko cache karo, API calls ko nahi
const isStaticAsset = (url) => {
  const urlObj = new URL(url, location.origin);
  // Agar path /api se start ho to cache mat karo
  if (urlObj.pathname.startsWith('/api/')) return false;
  // Agar file extension static hai to cache karo
  return /\.(html|css|js|json|png|jpg|jpeg|svg|webp|woff2?)$/.test(urlObj.pathname) || 
         urlObj.pathname === '/' || 
         urlObj.pathname === '/index.html';
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Sirf GET requests aur static assets ke liye cache, API calls bypass
  if (event.request.method !== 'GET' || !isStaticAsset(url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached); // Agar network fail ho to cached response de do
      return cached || networkFetch;
    })
  );
});
// Add push event listener
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
  });
});