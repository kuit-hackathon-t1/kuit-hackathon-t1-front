import { useQuery } from "@tanstack/react-query";

import { getCollections } from "@/features/collection/api/collectionApi";
import { collectionKeys } from "@/features/collection/queries/collectionKeys";
import type { CollectionStatus } from "@/features/collection/types/collection";

export function useCollectionsQuery(userId?: number, tripId?: number, status?: CollectionStatus) {
  return useQuery({
    queryKey: collectionKeys.list(tripId, status),
    queryFn: () => getCollections(userId as number, { tripId: tripId as number, status }),
    enabled: userId !== undefined && tripId !== undefined,
  });
}
