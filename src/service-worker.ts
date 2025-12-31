/// <reference lib="webworker" />

interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
  waitUntil(promise: Promise<any>): void;
}

declare function postMessage(message: any): void;

const sw = self as unknown as ServiceWorkerGlobalScope;

// Cache name for PWA assets
const CACHE_NAME = "wujo-app-v1";

sw.addEventListener("install", (event: ExtendableEvent) => {
  console.log("Service Worker installing.");
  // Skip waiting to activate immediately
  sw.skipWaiting();
});

sw.addEventListener("activate", (event: ExtendableEvent) => {
  console.log("Service Worker activating.");
  // Claim all clients immediately
  event.waitUntil(sw.clients.claim());
});

// Fetch event handler - required for PWA installability
sw.addEventListener("fetch", (event: FetchEvent) => {
  // Network-first strategy for API calls
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        return response;
      });
    })
  );
});

sw.addEventListener("sync", (event: any) => {
  console.log("Background syncing!", event);
  if (event.tag === "sync-iqubs") {
    event.waitUntil(
      syncIqubs()
        .then(() => {
          console.log("Iqubs synced successfully!");
          postMessage({ type: "SYNC_SUCCESS" });
        })
        .catch((error) => {
          console.error("Iqub sync failed:", error);
          postMessage({ type: "SYNC_ERROR", payload: error });
          // Optionally, re-throw the error to trigger retry
          // throw error;
        })
    );
  }
});

async function syncIqubs() {
  // Replace with actual sync logic
  console.log("Simulating iqub sync");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a sync error
      const shouldFail = Math.random() < 0.5; // 50% chance of failure
      if (shouldFail) {
        reject("Simulated sync error");
      } else {
        console.log("Iqub sync complete");
        resolve(true);
      }
    }, 2000);
  });
}
