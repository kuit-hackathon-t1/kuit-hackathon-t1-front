import { useQuery } from "@tanstack/react-query";

import { getCollection } from "@/features/collection/api/collectionApi";
import { collectionKeys } from "@/features/collection/queries/collectionKeys";

export function useCollectionDetailQuery(userId?: number, collectionId?: number) {
  return useQuery({
    queryKey: collectionKeys.detail(collectionId),
    queryFn: () => getCollection(userId as number, collectionId as number),
    enabled: userId !== undefined && collectionId !== undefined,
  });
}
