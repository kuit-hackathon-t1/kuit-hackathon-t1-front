import { useQuery } from "@tanstack/react-query";

import { getCurrentTrip } from "@/features/trip/api/tripApi";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useCurrentTripQuery(userId?: number) {
  return useQuery({
    queryKey: tripKeys.current(userId),
    queryFn: () => getCurrentTrip(userId as number),
    enabled: userId !== undefined,
  });
}
