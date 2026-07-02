import { useMutation, useQueryClient } from "@tanstack/react-query";

import { endTrip } from "@/features/trip/api/tripApi";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useEndTripMutation(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: number) => {
      if (userId === undefined) throw new Error("User is required to end a trip.");
      return endTrip(userId, tripId);
    },
    onSuccess: (trip) => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.current(userId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.review(userId, trip.tripId) });
    },
  });
}
