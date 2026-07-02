import type {
  Collection,
  CollectionCreatePayload,
  CollectionStatus,
} from "@/features/collection/types/collection";
import { getMission } from "@/features/mission/api/missionApi";
import type { Trip } from "@/features/trip/types/trip";

const COLLECTIONS_KEY = "mock-collections";
const TRIPS_KEY = "mock-trips";

function readCollections(): Collection[] {
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  return raw ? (JSON.parse(raw) as Collection[]) : [];
}

function writeCollections(collections: Collection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

function readTrips(): Trip[] {
  const raw = localStorage.getItem(TRIPS_KEY);
  return raw ? (JSON.parse(raw) as Trip[]) : [];
}

export async function createCollection(payload: CollectionCreatePayload): Promise<Collection> {
  const mission = await getMission(payload.missionId);
  const trip = readTrips().find((item) => item.id === payload.tripId && item.userId === payload.userId);

  const collection: Collection = {
    id: Date.now(),
    userId: payload.userId,
    tripId: payload.tripId,
    missionId: payload.missionId,
    missionTitle: mission?.title ?? "이름 없는 미션",
    missionDescription: mission?.description,
    status: payload.status,
    memo: payload.memo,
    shape: payload.shape,
    imageUrl: null,
    imageKey: null,
    localImageId: payload.localImageId,
    region: trip?.region,
    createdAt: new Date().toISOString(),
  };

  writeCollections([...readCollections(), collection]);
  return collection;
}

export async function getCollections({
  tripId,
  status,
}: {
  tripId?: number;
  status?: CollectionStatus;
}): Promise<Collection[]> {
  return readCollections()
    .filter((collection) => (!tripId || collection.tripId === tripId) && (!status || collection.status === status))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCollection(collectionId: number): Promise<Collection | null> {
  return readCollections().find((collection) => collection.id === collectionId) ?? null;
}
