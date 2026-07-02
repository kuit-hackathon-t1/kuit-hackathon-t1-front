import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startMission } from "@/features/mission/api/missionApi";
import { missionKeys } from "@/features/mission/queries/missionKeys";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useStartMissionMutation(userId?: number, tripId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (missionId: number) => {
      if (userId === undefined) throw new Error("User is required to start a mission.");
      return startMission(userId, missionId);
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: missionKeys.list(tripId) });
      void queryClient.invalidateQueries({ queryKey: missionKeys.detail(response.missionId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.current(userId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.list(userId) });
    },
  });
}
