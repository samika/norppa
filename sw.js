const pathPrefix = location.pathname.replace(/\/sw\.js$/, "");
const staticResources = [
  `${pathPrefix}`,
  `${pathPrefix}/`,
  `${pathPrefix}/index.html`,
  `${pathPrefix}/index.js`,
  `${pathPrefix}/style.css`,
];

async function cacheResources(resources) {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
}

async function getCachedAndRefresh(request) {
  const cacheMatch = await caches.match(request);
  const response = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open("v1");
      cache.put(request, response.clone());
    }

    return response;
  });

  return cacheMatch || (await response);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (staticResources.includes(url.pathname)) {
    event.respondWith(getCachedAndRefresh(event.request));
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(cacheResources(staticResources));
});
