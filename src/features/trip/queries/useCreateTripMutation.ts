import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTrip } from "@/features/trip/api/tripApi";
import { tripKeys } from "@/features/trip/queries/tripKeys";
import type { TripCreatePayload } from "@/features/trip/types/trip";

export function useCreateTripMutation(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TripCreatePayload) => {
      if (userId === undefined) throw new Error("User is required to create a trip.");
      return createTrip(userId, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.current(userId) });
    },
  });
}
