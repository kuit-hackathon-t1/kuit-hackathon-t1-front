import { useQuery } from "@tanstack/react-query";

import { getMissions } from "@/features/mission/api/missionApi";
import { missionKeys } from "@/features/mission/queries/missionKeys";
import type { MissionStatus } from "@/features/mission/types/mission";

export function useMissionListQuery(userId?: number, tripId?: number, status?: MissionStatus) {
  return useQuery({
    queryKey: missionKeys.list(tripId, status),
    queryFn: () => getMissions(userId as number, tripId as number, status),
    enabled: userId !== undefined && tripId !== undefined,
  });
}
