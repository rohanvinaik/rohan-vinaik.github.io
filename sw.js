/**
 * Service Worker for Offline Support
 * Provides caching and offline functionality
 */

const CACHE_NAME = 'rohan-portfolio-v1.0.0';

// Critical assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/research-graph.css',
  '/error-handler.js',
  '/terminal.js',
  '/skill-project-map.js',
  '/filter-system.js',
  '/loading-indicator.js',
  '/image-lazy-load.js',
  '/keyboard-shortcuts.js',
  '/performance-monitor.js',
  '/mobile-touch.js',
  '/site-stats.js',
  '/scroll-progress.js',
  '/assets/logo.svg'
];

// Assets to cache on demand
const DYNAMIC_CACHE = 'rohan-portfolio-dynamic-v1';

/**
 * Install Event
 * Pre-cache critical assets
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('[SW] Cache installation failed:', err);
      })
  );
});

/**
 * Activate Event
 * Clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old caches
              return cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

/**
 * Fetch Event
 * Network-first strategy with cache fallback
 */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except fonts)
  const url = new URL(request.url);
  if (url.origin !== location.origin && !url.hostname.includes('googleapis') && !url.hostname.includes('gstatic')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone response for caching
        const responseClone = response.clone();

        // Cache successful responses
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            // Don't cache API requests or very large files
            if (!request.url.includes('/api/') && response.headers.get('content-length') < 5000000) {
              cache.put(request, responseClone);
            }
          })
          .catch(err => {
            console.warn('[SW] Failed to cache:', request.url, err);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request)
          .then(cached => {
            if (cached) {
              console.log('[SW] Serving from cache:', request.url);
              return cached;
            }

            // No cache available, return offline page
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }

            // For other resources, return a simple response
            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

/**
 * Message Event
 * Handle messages from clients
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

/**
 * Sync Event (for background sync when online again)
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-papers') {
    event.waitUntil(syncPapers());
  }
});

async function syncPapers() {
  try {
    console.log('[SW] Background syncing papers...');
    // This could be used to fetch latest papers when coming back online
    // For now, just a placeholder
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    return Promise.reject(error);
  }
}

console.log('[SW] Service worker script loaded');
