import { openDB } from 'idb';

const DB_NAME = 'SurVerseDB';
const STORE_NAME = 'downloads';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const db = {
  async saveSong(song, blob) {
    const database = await dbPromise;
    return database.put(STORE_NAME, {
      ...song,
      blob,
      downloadedAt: new Date().toISOString(),
    });
  },

  async getAllSongs() {
    const database = await dbPromise;
    return database.getAll(STORE_NAME);
  },

  async deleteSong(id) {
    const database = await dbPromise;
    return database.delete(STORE_NAME, id);
  },

  async getSong(id) {
    const database = await dbPromise;
    return database.get(STORE_NAME, id);
  },
};
