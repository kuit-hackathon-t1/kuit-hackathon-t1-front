import { useQuery } from "@tanstack/react-query";

import { getMission } from "@/features/mission/api/missionApi";
import { missionKeys } from "@/features/mission/queries/missionKeys";

export function useMissionDetailQuery(userId?: number, missionId?: number) {
  return useQuery({
    queryKey: missionKeys.detail(missionId),
    queryFn: () => getMission(userId as number, missionId as number),
    enabled: userId !== undefined && missionId !== undefined,
  });
}
