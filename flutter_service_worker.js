'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "e0a8121915f3309aceb2db360b880455",
"index.html": "d905d9ae267d50f3e43ec0ba367e2867",
"/": "d905d9ae267d50f3e43ec0ba367e2867",
"main.dart.js": "66ef0ea4f6fe5ac1980d83f55be699b2",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "644edbed2dfc4d4933411c59df7eaff9",
"assets/AssetManifest.json": "82e8cd4a7c9bedfb391aba999d3daac7",
"assets/NOTICES": "145e5a37295e6deaac13c118350fe3a2",
"assets/FontManifest.json": "92268ec3e706b281519f48bb8e988ba3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "7e7c94cc608693e0e30cfe8e24da6772",
"assets/jason/plans.json": "0440c2bfd7755804ec5f0be13bfce7ba",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/cri.jpg": "93406f7965c3cf2d808f6b2e3aa7b269",
"assets/assets/images/image8.png": "a46e2c30f5219f38b0a005f255b31374",
"assets/assets/images/image9.png": "00620c8f74c73a5fc85a6cd8ffe22c4a",
"assets/assets/images/instragram.png": "e31c0811302280462e0d33b96538acf4",
"assets/assets/images/vector.jpg": "cd1cb85145e37240f65aab0fa4ca8e73",
"assets/assets/images/image12.png": "f75f9d3fc1c17b6f804766b47fc2507b",
"assets/assets/images/image11.png": "52726176843ea091ed3387f75ae2c240",
"assets/assets/images/image10.png": "9c0d96e5724283885a91bb66b41eab95",
"assets/assets/images/twitter.png": "96c8656805adcfe74673188d884d97ac",
"assets/assets/images/easy.jpg": "0eb828c8a4f58107b2a6440d525a1e0d",
"assets/assets/images/Frame.png": "237a794d46700ea46f089b400770c9a2",
"assets/assets/images/image7.png": "fdbae495f16bf63712751a2cf77cf318",
"assets/assets/images/frame.jpg": "7dca2bd0eca5859d623e192d40e1568b",
"assets/assets/images/youtube.png": "9aeb7dd18a9393a72a4a16da98a56bb9",
"assets/assets/images/cash.jpg": "871b9cdb77dd6688ac5dfc370b6fbb34",
"assets/assets/images/image6.png": "027295e328ed1d35df6c4571fbd8562b",
"assets/assets/images/image4.png": "50e7061b197915078fb0f88ebfda4ee0",
"assets/assets/images/image5.png": "c6d5b725d6f9796c59a787417ac3cb7c",
"assets/assets/images/whatsapp.png": "56282caab6cd046efd5d821bf67a49ff",
"assets/assets/images/facebook.png": "87aa70313c1b3b7049f3f56ade31a409",
"assets/assets/images/image1.png": "72397016f5837863062171b58444a620",
"assets/assets/images/image2.png": "248448322380fd0654c7add04a32a6b7",
"assets/assets/images/bg.png": "ec05996a6c3273d56c4906c9c8d70729",
"assets/assets/images/image3.png": "6c60b6d826e3aa8387cb328d4c995d36",
"assets/assets/fonts/PTSans-Regular.ttf": "5b127e9e1cedad57860a5bb8b2cc9d61",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
