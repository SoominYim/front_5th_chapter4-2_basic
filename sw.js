const CACHE_NAME = "vr-shop-v5";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/images/icon-192.png",
  "/images/icon-512.png",
  "/css/styles.min.css",
  "/js/main.min.js",
  "/js/products.min.js",
  "/images/Hero_Desktop.webp",
  "/images/Hero_Tablet.webp",
  "/images/Hero_Mobile.webp",
  "/images/vr1.jpg",
  "/images/vr2.jpg",
  "/images/vr3.jpg",
  "/images/menu_icon.png",
];

// Install event
self.addEventListener("install", event => {
  console.log("Service Worker installing");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log("Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener("activate", event => {
  console.log("Service Worker activating");
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event with network-first strategy for better performance
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
