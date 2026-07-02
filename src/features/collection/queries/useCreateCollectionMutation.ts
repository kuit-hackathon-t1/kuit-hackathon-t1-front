import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCollection } from "@/features/collection/api/collectionApi";
import { collectionKeys } from "@/features/collection/queries/collectionKeys";
import type { CollectionCreatePayload } from "@/features/collection/types/collection";
import { missionKeys } from "@/features/mission/queries/missionKeys";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useCreateCollectionMutation(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CollectionCreatePayload) => {
      if (userId === undefined) throw new Error("User is required to create a collection.");
      return createCollection(userId, payload);
    },
    onSuccess: (_response, payload) => {
      void queryClient.invalidateQueries({ queryKey: collectionKeys.list(payload.tripId) });
      void queryClient.invalidateQueries({ queryKey: missionKeys.list(payload.tripId) });
      void queryClient.invalidateQueries({ queryKey: missionKeys.detail(payload.missionId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.current(userId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.list(userId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.review(userId, payload.tripId) });
    },
  });
}
