self.addEventListener('install', (event) => {
  console.log('CricketZone Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('CricketZone Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // Empty fetch handler is required by Chrome to trigger the "Add to Home screen" / "Install App" prompt.
  // We aren't doing offline caching right now, just passing the request through.
});
