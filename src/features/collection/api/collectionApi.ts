import type {
  Collection,
  CollectionCreatePayload,
  CollectionStatus,
} from "@/features/collection/types/collection";

const COLLECTIONS_KEY = "mock-collections";
const TRIPS_KEY = "mock-trips";

type MockTrip = {
  id: number;
  userId: number;
  region: string;
};

function readCollections(): Collection[] {
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  return raw ? (JSON.parse(raw) as Collection[]) : [];
}

function writeCollections(collections: Collection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

function readTrips(): MockTrip[] {
  const raw = localStorage.getItem(TRIPS_KEY);
  return raw ? (JSON.parse(raw) as MockTrip[]) : [];
}

export async function createCollection(payload: CollectionCreatePayload): Promise<Collection> {
  const trip = readTrips().find((item) => item.id === payload.tripId && item.userId === payload.userId);

  const collection: Collection = {
    id: Date.now(),
    userId: payload.userId,
    tripId: payload.tripId,
    missionId: payload.missionId,
    missionTitle: "이름 없는 미션",
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
