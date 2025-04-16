/// <reference lib="webworker" />

interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
  waitUntil(promise: Promise<any>): void;
}

declare function postMessage(message: any): void;

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event: ExtendableEvent) => {
  console.log("Service Worker installing.");
});

sw.addEventListener("activate", (event: ExtendableEvent) => {
  console.log("Service Worker activating.");
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
