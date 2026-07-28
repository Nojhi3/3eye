/**
 * Small browser-local database adapter used until a hosted database is added.
 * IndexedDB is the primary store; localStorage remains a migration/back-up
 * path so existing demo data is not lost when upgrading the app.
 */
const DATABASE_NAME = "ideaforge-local-db";
const STORE_NAME = "state";
const DATABASE_VERSION = 1;

type StoredValue = unknown;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Unable to open local database."));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
}

function indexedDbRequest<T>(
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const request = operation(transaction.objectStore(STORE_NAME));
        request.onerror = () => reject(request.error ?? new Error("Local database request failed."));
        request.onsuccess = () => resolve(request.result);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => reject(transaction.error ?? new Error("Local database transaction failed."));
      }),
  );
}

export async function readLocalState<T>(key: string): Promise<T | null> {
  if (!canUseBrowserStorage()) return null;

  try {
    const stored = await indexedDbRequest<StoredValue | undefined>((store) => store.get(key));
    if (stored !== undefined) return stored as T;
  } catch (error) {
    console.warn("IndexedDB read failed; using localStorage fallback.", error);
  }

  const legacyValue = window.localStorage.getItem(key);
  if (!legacyValue) return null;

  try {
    const parsed = JSON.parse(legacyValue) as T;
    await writeLocalState(key, parsed);
    return parsed;
  } catch (error) {
    console.warn(`Could not migrate ${key} from localStorage.`, error);
    return null;
  }
}

export async function writeLocalState<T>(key: string, value: T): Promise<void> {
  if (!canUseBrowserStorage()) return;

  window.localStorage.setItem(key, JSON.stringify(value));

  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(value, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Local database write failed."));
    });
    database.close();
  } catch (error) {
    console.warn("IndexedDB write failed; localStorage copy was retained.", error);
  }
}

export async function removeLocalState(key: string): Promise<void> {
  if (!canUseBrowserStorage()) return;

  window.localStorage.removeItem(key);
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Local database delete failed."));
    });
    database.close();
  } catch (error) {
    console.warn("IndexedDB delete failed; localStorage copy was removed.", error);
  }
}
