import type {
  CollectionCreatePayload,
  CollectionCreateResponse,
  CollectionDetail,
  CollectionListItem,
  CollectionListResponse,
  CollectionStatus,
} from "@/features/collection/types/collection";
import { endpoints } from "@/shared/api/endpoints";
import { fetchClient } from "@/shared/api/fetchClient";

export async function createCollection(
  userId: number,
  payload: CollectionCreatePayload,
): Promise<CollectionCreateResponse> {
  return fetchClient.post<CollectionCreateResponse>(endpoints.collections.create, payload, { userId });
}

export async function getCollections(
  userId: number,
  {
    tripId,
    status,
  }: {
    tripId: number;
    status?: CollectionStatus;
  },
): Promise<CollectionListItem[]> {
  const response = await fetchClient.get<CollectionListResponse>(endpoints.collections.list(tripId, status), { userId });
  return response.collections;
}

export async function getCollection(userId: number, collectionId: number): Promise<CollectionDetail> {
  return fetchClient.get<CollectionDetail>(endpoints.collections.detail(collectionId), { userId });
}
