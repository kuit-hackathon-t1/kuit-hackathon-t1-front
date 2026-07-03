import { useQuery } from "@tanstack/react-query";

import { getTrips } from "@/features/trip/api/tripApi";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useTripsQuery(userId?: number) {
  return useQuery({
    queryKey: tripKeys.list(userId),
    queryFn: () => getTrips(userId as number),
    enabled: userId !== undefined,
  });
}
