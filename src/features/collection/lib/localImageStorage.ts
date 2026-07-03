import { openDB, type DBSchema } from "idb";

import type { LocalImage } from "@/features/collection/types/collection";

const DB_NAME = "travel-mission-local-images";
const STORE_NAME = "images";
const DB_VERSION = 1;

type LocalImageDb = DBSchema & {
  images: {
    key: string;
    value: LocalImage;
  };
};

function getDb() {
  return openDB<LocalImageDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function saveLocalImage(image: LocalImage): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, image);
}

export async function getLocalImage(id: string): Promise<LocalImage | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function deleteLocalImage(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
