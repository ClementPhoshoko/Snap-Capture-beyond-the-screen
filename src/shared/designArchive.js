const DB_NAME = "snapDesignArchive";
const DB_VERSION = 1;
const STORE_NAME = "extracts";

function openArchiveDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore(mode, callback) {
  return openArchiveDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  }));
}

export function saveDesignExtractArchive(id, blob) {
  return withStore("readwrite", (store) => store.put({ id, blob, updatedAt: new Date().toISOString() }));
}

export function getDesignExtractArchive(id) {
  return withStore("readonly", (store) => store.get(id)).then((entry) => entry?.blob || null);
}

export function deleteDesignExtractArchive(id) {
  return withStore("readwrite", (store) => store.delete(id));
}

export function deleteDesignExtractArchives(ids = []) {
  if (!ids.length) return Promise.resolve();
  return openArchiveDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    for (const id of ids) store.delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  }));
}
