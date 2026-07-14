const CACHE_NAME = 'aci-people-helpdesk-gemini-ai-v4';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Never cache or intercept AI endpoint calls — always go to the network
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
