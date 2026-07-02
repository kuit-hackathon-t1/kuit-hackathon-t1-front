import { useQuery } from "@tanstack/react-query";

import { getTripReview } from "@/features/trip/api/tripApi";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useTripReviewQuery(userId?: number, tripId?: number) {
  return useQuery({
    queryKey: tripKeys.review(userId, tripId),
    queryFn: () => getTripReview(userId as number, tripId as number),
    enabled: userId !== undefined && tripId !== undefined,
  });
}
