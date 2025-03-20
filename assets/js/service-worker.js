// Service Worker for Yash Jangid Portfolio
const CACHE_NAME = 'yj-portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/modern-theme.css',
  '/assets/css/Loader.css',
  '/assets/css/exit-modal.css',
  '/assets/css/404.css',
  '/assets/js/script.js',
  '/assets/js/exit-handler.js',
  '/assets/js/404.js',
  '/assets/images/favicon.png',
  '/assets/images/profile2.jpg',
  '/assets/images/yash.png',
  '/resume_yash_jangid.pdf',
  // Add other important assets
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache API calls or external resources
                if (event.request.url.indexOf('http') === 0) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          }
        );
      })
  );
}); 