const CACHE_NAME = "vr-shop-v1";
const urlsToCache = [
  "/",
  "/css/styles.min.css",
  "/js/main.min.js",
  "/js/products.min.js",
  "/images/vr1.jpg",
  "/images/vr2.jpg",
  "/images/vr3.jpg",
  "/images/menu_icon.png",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
