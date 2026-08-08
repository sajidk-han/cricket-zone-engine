self.addEventListener('install', (event) => {
  console.log('CricketZone Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('CricketZone Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // Pass through the request to satisfy PWA install requirements
  event.respondWith(fetch(event.request).catch(() => new Response('Offline')));
});
