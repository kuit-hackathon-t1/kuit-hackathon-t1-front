import type { CollectionStatus } from "@/features/collection/types/collection";

export const collectionKeys = {
  all: ["collections"] as const,
  list: (tripId?: number, status?: CollectionStatus) =>
    status === undefined ? ([...collectionKeys.all, "list", tripId] as const) : ([...collectionKeys.all, "list", tripId, status] as const),
  detail: (collectionId?: number) => [...collectionKeys.all, "detail", collectionId] as const,
};
